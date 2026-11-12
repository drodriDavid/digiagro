# ============================================================================
#  DIGIAGRO - comprobador del panel de estado (http://150.214.178.23/estado/)
#  ----------------------------------------------------------------------------
#  Comprueba SAVIA, los cuadernos y la web de DIGIAGRO desde el propio servidor
#  y escribe F:\digiagro\estado\datos\estado.json, que lee el panel.
#  Lo ejecuta la tarea "DIGIAGRO estado" (SYSTEM, cada 2 min) con la COPIA que
#  instalar-estado.ps1 deja en F:\digiagro\estado\comprobar.ps1 (un push no
#  cambia lo que corre como SYSTEM). Si cambias este fichero, vuelve a ejecutar
#  instalar-estado.ps1 como administrador.
#
#  Aviso de caídas: un servicio se da por caído tras 2 fallos seguidos. Entonces
#  se abre una incidencia, se anota en el registro de eventos (Aplicación,
#  origen "DIGIAGRO estado") y, si la máquina tiene SAVIA_SMTP_* configurado,
#  se manda un correo a SAVIA_ADMIN_EMAIL (o drodrigu@ujaen.es). Igual al volver.
#
#  El JSON público solo lleva rutas, códigos, tiempos y motivos genéricos: ni
#  contenidos de respuesta, ni contadores internos, ni claves.
#
#  Uso: comprobar.ps1 [-Base carpeta] [-SinCorreo] [-PruebaCorreo] [-UrlPrueba url,...]
# ============================================================================
param(
    [string]$Base = 'F:\digiagro\estado',
    [string]$Datos = '',
    [switch]$SinCorreo,
    [switch]$PruebaCorreo,
    [string[]]$UrlPrueba = @()   # solo para probar el aviso: añade comprobaciones de estas URL
)
$ErrorActionPreference = 'Stop'
if (-not $Datos) { $Datos = Join-Path $Base 'datos' }
$LOG       = Join-Path $Base 'logs\comprobar.log'
$JSON      = Join-Path $Datos 'estado.json'
$CUADERNOS = 'F:\savia\savia-web\iis-site\cuadernos'
$MUESTRAS  = 360   # 12 h a una comprobación cada 2 min
$FALLOS_PARA_CAIDA = 2
$INCIDENCIAS_MAX = 60
$ORIGEN_EVENTOS = 'DIGIAGRO estado'

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Add-Type -AssemblyName System.Web.Extensions
$ser = New-Object System.Web.Script.Serialization.JavaScriptSerializer
$ser.MaxJsonLength = 64MB

function Anota($msg) {
    New-Item -ItemType Directory -Force (Split-Path $LOG) | Out-Null
    Add-Content $LOG "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  $msg" -Encoding utf8
}
# PowerShell envuelve muchos valores en PSObject, que JavaScriptSerializer no sabe serializar:
# antes de escribir se pasa todo a diccionarios, listas y valores simples de .NET.
Add-Type -ReferencedAssemblies ([psobject].Assembly.Location) -TypeDefinition @'
using System.Collections;
using System.Collections.Generic;
using System.Management.Automation;
public static class EstadoJson {
    public static object Limpia(object v) {
        while (v is PSObject) v = ((PSObject)v).BaseObject;
        if (v == null || v is string || v is System.ValueType) return v;
        IDictionary d = v as IDictionary;
        if (d != null) {
            var r = new Dictionary<string, object>();
            foreach (DictionaryEntry e in d) r[e.Key.ToString()] = Limpia(e.Value);
            return r;
        }
        IEnumerable l = v as IEnumerable;
        if (l != null) {
            var r = new List<object>();
            foreach (object x in l) r.Add(Limpia(x));
            return r;
        }
        return v.ToString();
    }
}
'@
function D($h) { $d = New-Object 'System.Collections.Generic.Dictionary[string,object]'; foreach ($k in $h.Keys) { $d[$k] = $h[$k] }; return ,$d }
function Ahora { (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ') }

# ---------------------------------------------------------------------------
# Correo (con la configuración SMTP de máquina que ya usa SAVIA)
# ---------------------------------------------------------------------------
function Env($n) { [Environment]::GetEnvironmentVariable($n, 'Machine') }
function Manda-Correo($asunto, $cuerpo) {
    if ($SinCorreo) { return 'sin correo (opción -SinCorreo)' }
    $hostSmtp = Env 'SAVIA_SMTP_HOST'; if (-not $hostSmtp) { $hostSmtp = 'smtp.gmail.com' }
    $puerto = Env 'SAVIA_SMTP_PORT'; if (-not $puerto) { $puerto = 587 }
    $usuario = Env 'SAVIA_SMTP_USER'; $clave = Env 'SAVIA_SMTP_PASS'
    $de = Env 'SAVIA_SMTP_FROM'; if (-not $de) { $de = $usuario }
    $para = Env 'SAVIA_ADMIN_EMAIL'; if (-not $para) { $para = 'drodrigu@ujaen.es' }
    if (-not $usuario -or -not $clave) { return 'sin correo (no hay SMTP de máquina)' }
    try {
        $smtp = New-Object Net.Mail.SmtpClient($hostSmtp, [int]$puerto)
        $smtp.EnableSsl = $true
        $smtp.Timeout = 20000
        $smtp.Credentials = New-Object Net.NetworkCredential($usuario, $clave)
        $m = New-Object Net.Mail.MailMessage($de, $para)
        $m.Subject = $asunto
        $m.Body = $cuerpo
        $m.BodyEncoding = [Text.Encoding]::UTF8
        $m.SubjectEncoding = [Text.Encoding]::UTF8
        $smtp.Send($m)
        $m.Dispose(); $smtp.Dispose()
        return 'correo enviado'
    } catch {
        return "correo fallido: $($_.Exception.GetBaseException().Message)"
    }
}
function Evento($tipo, $texto) {
    try {
        if ([Diagnostics.EventLog]::SourceExists($ORIGEN_EVENTOS)) {
            Write-EventLog -LogName Application -Source $ORIGEN_EVENTOS -EventId $(if ($tipo -eq 'Error') { 1001 } else { 1000 }) -EntryType $tipo -Message $texto
        }
    } catch { }
}

if ($PruebaCorreo) {
    $r = Manda-Correo '[Estado DIGIAGRO/SAVIA] Prueba del aviso' "Correo de prueba del panel de estado.`r`nPanel: http://150.214.178.23/estado/`r`nEnviado: $(Get-Date -Format 'dd/MM/yyyy HH:mm')"
    Write-Host $r; Anota "prueba de correo: $r"; exit 0
}

# ---------------------------------------------------------------------------
# Qué se comprueba
# ---------------------------------------------------------------------------
$comprobaciones = New-Object System.Collections.ArrayList
function Agrega($id, $grupo, $nombre, $url, $tipo, $extra) {
    [void]$comprobaciones.Add(@{ id = $id; grupo = $grupo; nombre = $nombre; url = $url; tipo = $tipo; extra = $extra })
}
Agrega 'savia-web'    'SAVIA' 'Web de SAVIA'           'https://savia.ujaen.es/'          'contiene' 'SAVIA'
Agrega 'savia-health' 'SAVIA' 'Salud de SAVIA'          'https://savia.ujaen.es/health'    'json-true' $null
Agrega 'savia-api'    'SAVIA' 'API interna (uvicorn)'   'http://127.0.0.1:8010/health'     'json-true' $null
Agrega 'cuadernos-salud' 'Cuadernos' 'API de los cuadernos' 'https://savia.ujaen.es/api/cuadernos/salud' 'json-ok' $null

$fijos = 'livingsoill-cuaderno', 'proyectos-uja', 'regen4andalucia-uja', 'soildataspace-cuaderno', 'tfg-tfm-cuaderno'
$ids = New-Object System.Collections.ArrayList
foreach ($c in $fijos) { [void]$ids.Add($c) }
# Además, cualquier otra carpeta publicada con portada propia (actualidad, accesos...)
try {
    Get-ChildItem $CUADERNOS -Directory -ErrorAction Stop | Sort-Object Name | ForEach-Object {
        if ((Test-Path (Join-Path $_.FullName 'index.html')) -and -not $ids.Contains($_.Name)) { [void]$ids.Add($_.Name) }
    }
} catch { }
foreach ($c in $ids) { Agrega "cuaderno-$c" 'Cuadernos' $c "https://savia.ujaen.es/cuadernos/$c/" 'contiene' '<html' }

Agrega 'digiagro-web' 'DIGIAGRO' 'Web de DIGIAGRO' 'http://150.214.178.23/' 'contiene' 'DIGIAGRO'
$n = 0; foreach ($u in $UrlPrueba) { $n++; Agrega "prueba-$n" 'Prueba' "Prueba $n" $u 'contiene' '' }

# ---------------------------------------------------------------------------
# Una petición
# ---------------------------------------------------------------------------
function Prueba($c) {
    $res = @{ codigo = 0; ms = 0; ok = $false; motivo = '' }
    $reloj = [Diagnostics.Stopwatch]::StartNew()
    $resp = $null
    try {
        $req = [Net.HttpWebRequest]::Create($c.url)
        $req.Method = 'GET'
        $req.Timeout = 20000
        $req.ReadWriteTimeout = 20000
        $req.AllowAutoRedirect = $true
        $req.UserAgent = 'DIGIAGRO-estado/1.0'
        $req.Headers.Add('Cache-Control', 'no-cache')
        $req.AutomaticDecompression = [Net.DecompressionMethods]::GZip -bor [Net.DecompressionMethods]::Deflate
        try { $resp = $req.GetResponse() } catch [Net.WebException] {
            if ($_.Exception.Response) { $resp = $_.Exception.Response } else { throw }
        }
        $res.codigo = [int]$resp.StatusCode
        $lector = New-Object IO.StreamReader($resp.GetResponseStream(), [Text.Encoding]::UTF8)
        $buf = New-Object char[] 262144
        $n = $lector.ReadBlock($buf, 0, $buf.Length)
        $cuerpo = New-Object string($buf, 0, $n)
        $lector.Dispose()
        $reloj.Stop()
        $res.ms = [int]$reloj.ElapsedMilliseconds
        if ($res.codigo -ne 200) { $res.motivo = "HTTP $($res.codigo)"; return $res }
        switch ($c.tipo) {
            'contiene' {
                if ($cuerpo.IndexOf($c.extra, [StringComparison]::OrdinalIgnoreCase) -ge 0) { $res.ok = $true }
                else { $res.motivo = 'La página no tiene el contenido esperado' }
            }
            'json-true' {
                try { $j = $ser.DeserializeObject($cuerpo) } catch { $j = $null }
                if (-not ($j -is [Collections.IDictionary])) { $res.motivo = 'La respuesta no es JSON'; break }
                $mal = @($j.Keys | Where-Object { $j[$_] -is [bool] -and -not $j[$_] })
                $estadoMal = $j.ContainsKey('status') -and $j['status'] -ne 'ok'
                if ($mal.Count -eq 0 -and -not $estadoMal) { $res.ok = $true }
                else {
                    $p = @($mal); if ($estadoMal) { $p += 'status' }
                    $res.motivo = 'Campos que no están bien: ' + ($p -join ', ')
                }
            }
            'json-ok' {
                try { $j = $ser.DeserializeObject($cuerpo) } catch { $j = $null }
                if (($j -is [Collections.IDictionary]) -and $j['ok'] -eq $true) { $res.ok = $true }
                else { $res.motivo = 'La API no responde ok' }
            }
        }
    } catch {
        $reloj.Stop()
        $res.ms = [int]$reloj.ElapsedMilliseconds
        $e = $_.Exception.GetBaseException()
        if ($e -is [Net.WebException]) {
            switch ($e.Status) {
                'Timeout'               { $res.motivo = 'Sin respuesta (tiempo agotado)' }
                'ConnectFailure'        { $res.motivo = 'Conexión rechazada' }
                'NameResolutionFailure' { $res.motivo = 'No se resuelve el nombre' }
                'TrustFailure'          { $res.motivo = 'Certificado no válido' }
                'SecureChannelFailure'  { $res.motivo = 'Fallo de TLS' }
                default                 { $res.motivo = "Error de red ($($e.Status))" }
            }
        } elseif ($e -is [Net.Sockets.SocketException]) { $res.motivo = 'Conexión rechazada' }
        else { $res.motivo = 'Error al conectar' }
    } finally {
        if ($resp) { $resp.Close() }
    }
    return $res
}

# ---------------------------------------------------------------------------
# Estado anterior
# ---------------------------------------------------------------------------
$previo = $null
if (Test-Path $JSON) {
    try { $previo = $ser.DeserializeObject([IO.File]::ReadAllText($JSON, [Text.Encoding]::UTF8)) } catch { $previo = $null }
}
$anterior = @{}
if ($previo -and $previo['servicios']) { foreach ($s in $previo['servicios']) { $anterior[$s['id']] = $s } }
$incidencias = New-Object System.Collections.ArrayList
if ($previo -and $previo['incidencias']) { foreach ($i in $previo['incidencias']) { [void]$incidencias.Add($i) } }

# ---------------------------------------------------------------------------
# Comprobar todo
# ---------------------------------------------------------------------------
try {
    $t = Ahora
    $epoch = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
    $servicios = New-Object System.Collections.ArrayList
    $caidas = @(); $vueltas = @()

    foreach ($c in $comprobaciones) {
        $r = Prueba $c
        $a = $anterior[$c.id]
        $hist = New-Object System.Collections.ArrayList
        if ($a -and $a['historial']) { foreach ($h in $a['historial']) { [void]$hist.Add($h) } }
        [void]$hist.Add(@($epoch, $(if ($r.ok) { 1 } else { 0 }), $r.ms, $r.codigo))
        while ($hist.Count -gt $MUESTRAS) { $hist.RemoveAt(0) }

        $fallosSeguidos = 0
        if (-not $r.ok) { $fallosSeguidos = 1 + $(if ($a -and $a['fallos_seguidos']) { [int]$a['fallos_seguidos'] } else { 0 }) }
        $estabaCaido = [bool]($a -and $a['caido'])
        $caido = $estabaCaido
        if (-not $r.ok -and $fallosSeguidos -ge $FALLOS_PARA_CAIDA) { $caido = $true }
        if ($r.ok) { $caido = $false }

        $desde = if ($a -and $a['desde']) { $a['desde'] } else { $t }
        if ($a -and ([bool]$a['ok']) -ne $r.ok) { $desde = $t }

        if ($caido -and -not $estabaCaido) {
            [void]$incidencias.Insert(0, (D ([ordered]@{ id = $c.id; nombre = "$($c.grupo) · $($c.nombre)"; inicio = $t; fin = $null; motivo = $r.motivo })))
            $caidas += "$($c.grupo) · $($c.nombre) ($($c.url)): $($r.motivo)"
        }
        if ($estabaCaido -and -not $caido) {
            foreach ($i in $incidencias) { if ($i['id'] -eq $c.id -and -not $i['fin']) { $i['fin'] = $t; break } }
            $vueltas += "$($c.grupo) · $($c.nombre) ($($c.url))"
        }

        [void]$servicios.Add((D ([ordered]@{
            id = $c.id; grupo = $c.grupo; nombre = $c.nombre; url = $c.url
            ok = $r.ok; caido = $caido; codigo = $r.codigo; ms = $r.ms; motivo = $r.motivo
            comprobado = $t; desde = $desde; fallos_seguidos = $fallosSeguidos
            historial = $hist
        })))
    }
    # Incidencias abiertas de comprobaciones que ya no existen: se cierran
    $vigentes = @($comprobaciones | ForEach-Object { $_.id })
    foreach ($i in $incidencias) { if (-not $i['fin'] -and $vigentes -notcontains $i['id']) { $i['fin'] = $t } }
    while ($incidencias.Count -gt $INCIDENCIAS_MAX) { $incidencias.RemoveAt($incidencias.Count - 1) }

    # Avisos
    $aviso = $null
    if ($caidas.Count -or $vueltas.Count) {
        $lineas = @()
        if ($caidas.Count)  { $lineas += 'CAÍDO:'; $lineas += $caidas | ForEach-Object { "  - $_" } }
        if ($vueltas.Count) { $lineas += 'RECUPERADO:'; $lineas += $vueltas | ForEach-Object { "  - $_" } }
        $lineas += ''; $lineas += "Comprobado desde el servidor el $(Get-Date -Format 'dd/MM/yyyy HH:mm')."
        $lineas += 'Panel: http://150.214.178.23/estado/'
        $texto = $lineas -join "`r`n"
        $asunto = if ($caidas.Count) { "[Estado] Caído: " + (($caidas | ForEach-Object { ($_ -split ' \(')[0] }) -join ', ') }
                  else { "[Estado] Recuperado: " + (($vueltas | ForEach-Object { ($_ -split ' \(')[0] }) -join ', ') }
        Evento $(if ($caidas.Count) { 'Error' } else { 'Information' }) $texto
        $aviso = Manda-Correo $asunto $texto
        Anota "$asunto -> $aviso"
    }

    $salida = D ([ordered]@{
        generado = $t
        intervalo_s = 120
        servicios = $servicios
        incidencias = $incidencias
        aviso_correo = $(if ($SinCorreo) { $false } else { [bool]((Env 'SAVIA_SMTP_USER') -and (Env 'SAVIA_SMTP_PASS')) })
    })
    New-Item -ItemType Directory -Force $Datos | Out-Null
    $tmp = "$JSON.tmp"
    [IO.File]::WriteAllText($tmp, $ser.Serialize([EstadoJson]::Limpia($salida)), (New-Object Text.UTF8Encoding($false)))
    Move-Item $tmp $JSON -Force
    $malos = @($servicios | Where-Object { -not $_.ok }).Count
    if ($malos) { Anota "comprobado: $malos de $($servicios.Count) con fallo" }
    exit 0
} catch {
    Anota "ERROR: $($_.Exception.Message) (línea $($_.InvocationInfo.ScriptLineNumber))"
    exit 1
}
