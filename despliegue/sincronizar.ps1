# ============================================================================
#  DIGIAGRO - actualiza el sitio IIS "DIGIAGRO" desde GitHub
#  ----------------------------------------------------------------------------
#  Independiente de SAVIA: carpeta propia (F:\digiagro), tarea propia
#  ("DIGIAGRO autoupdate", cada 5 min, como SYSTEM) y registro propio.
#  separar-de-savia.ps1 copia este script a F:\digiagro\sincronizar.ps1: la tarea
#  ejecuta esa copia, no la del repo, para que un push no cambie lo que corre
#  como SYSTEM. Si se cambia este fichero, volver a ejecutar separar-de-savia.ps1.
#
#  Flujo: push a main -> en <= 5 min el repo se trae a F:\digiagro\repo, se
#  empaqueta con despliegue\empaquetar.ps1 y se copia en espejo a F:\digiagro\web.
# ============================================================================
$ErrorActionPreference = 'Stop'

$BASE    = 'F:\digiagro'
$REPO    = "$BASE\repo"
$PAQUETE = "$BASE\paquete"
$DST     = "$BASE\web"
$LOG     = "$BASE\logs\sincronizar.log"
$URL     = 'https://github.com/drodriDavid/digiagro.git'
$GIT     = 'C:\Program Files\Git\cmd\git.exe'

function Anota($msg) {
    New-Item -ItemType Directory -Force (Split-Path $LOG) | Out-Null
    Add-Content $LOG "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  $msg" -Encoding utf8
}
# git escribe avisos por stderr y PS 5.1 con 'Stop' los convertiria en error fatal
function Git { $e = $ErrorActionPreference; $ErrorActionPreference = 'Continue'; $o = & $GIT @args 2>$null; $ErrorActionPreference = $e; $o }

try {
    $cambiado = $false
    if (-not (Test-Path "$REPO\.git")) {
        Git clone --depth 1 --quiet $URL $REPO | Out-Null
        if ($LASTEXITCODE -ne 0) { Anota 'ERROR clonando el repo'; exit 1 }
        $cambiado = $true
    } else {
        Git -C $REPO fetch --depth 1 origin main --quiet | Out-Null
        if ($LASTEXITCODE -ne 0) { Anota 'AVISO: fetch fallido (sin red?)'; exit 0 }
        $local  = Git -C $REPO rev-parse HEAD
        $remoto = Git -C $REPO rev-parse origin/main
        if ($local -ne $remoto) {
            Git -C $REPO reset --hard origin/main --quiet | Out-Null
            if ($LASTEXITCODE -ne 0) { Anota 'ERROR actualizando el repo'; exit 1 }
            $cambiado = $true
        }
    }
    if (-not (Test-Path "$DST\index.html")) { $cambiado = $true }
    if (-not $cambiado) { exit 0 }

    & powershell -NoProfile -ExecutionPolicy Bypass -File "$REPO\despliegue\empaquetar.ps1" -Salida $PAQUETE | Out-Null
    if (-not (Test-Path "$PAQUETE\web\index.html")) { Anota 'ERROR: el empaquetado no genero web\index.html'; exit 1 }

    robocopy "$PAQUETE\web" $DST /MIR /R:2 /W:2 /NFL /NDL /NJH /NJS /NP | Out-Null
    if ($LASTEXITCODE -ge 8) { Anota "ERROR robocopy (codigo $LASTEXITCODE)"; exit 1 }
    Anota "desplegada $(Git -C $REPO rev-parse --short HEAD)"
    exit 0
} catch {
    Anota "ERROR: $($_.Exception.Message)"
    exit 1
}
