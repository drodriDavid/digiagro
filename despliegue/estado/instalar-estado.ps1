# ============================================================================
#  Panel de estado de SAVIA, los cuadernos y la web de DIGIAGRO
#  http://150.214.178.23/estado/   (sitio IIS "DIGIAGRO"; no toca el sitio de SAVIA)
#  ----------------------------------------------------------------------------
#  EJECUTAR COMO ADMINISTRADOR, una vez y otra vez si cambia comprobar.ps1.
#  Se puede repetir sin riesgo.
#    1. F:\digiagro\estado con permisos cerrados (solo administradores y SYSTEM
#       escriben: el script corre como SYSTEM) y copia de comprobar.ps1
#    2. origen "DIGIAGRO estado" en el registro de eventos (Aplicación)
#    3. directorio virtual /estado/datos -> F:\digiagro\estado\datos. Así el JSON
#       queda fuera de F:\digiagro\web y el robocopy /MIR del despliegue no lo borra.
#       La página (estado\index.html del repo) llega a F:\digiagro\web\estado con
#       el despliegue normal.
#    4. tarea "DIGIAGRO estado" (SYSTEM, cada 2 min) y una primera comprobación
#  -PruebaCorreo manda además un correo de prueba con el SMTP de máquina.
# ============================================================================
param(
    [string]$Base  = 'F:\digiagro\estado',
    [string]$Sitio = 'DIGIAGRO',
    [string]$Ip    = '150.214.178.23',
    [switch]$PruebaCorreo
)
$ErrorActionPreference = 'Stop'
$admin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $admin) { throw 'Abre PowerShell como administrador.' }
$datos = Join-Path $Base 'datos'

# 1. Carpeta y permisos
foreach ($d in $Base, $datos, (Join-Path $Base 'logs')) { New-Item -ItemType Directory -Force $d | Out-Null }
# Administradores (S-1-5-32-544) y SYSTEM (S-1-5-18): todo; Usuarios (S-1-5-32-545): solo leer
icacls $Base /inheritance:r /grant:r '*S-1-5-32-544:(OI)(CI)F' '*S-1-5-18:(OI)(CI)F' '*S-1-5-32-545:(OI)(CI)RX' /Q | Out-Null
icacls $datos /grant "IIS AppPool\$($Sitio):(OI)(CI)RX" /Q | Out-Null
Copy-Item (Join-Path $PSScriptRoot 'comprobar.ps1') (Join-Path $Base 'comprobar.ps1') -Force
icacls "$Base\*" /reset /T /Q | Out-Null   # que todo lo de dentro herede los permisos de arriba
icacls $datos /grant "IIS AppPool\$($Sitio):(OI)(CI)RX" /Q | Out-Null
Write-Host "Carpeta $Base lista"

# 2. Registro de eventos
if (-not [Diagnostics.EventLog]::SourceExists('DIGIAGRO estado')) {
    New-EventLog -LogName Application -Source 'DIGIAGRO estado'
    Write-Host 'Origen de eventos "DIGIAGRO estado" creado'
}

# 3. Directorio virtual /estado/datos en el sitio DIGIAGRO
Import-Module WebAdministration
if (-not (Test-Path "IIS:\Sites\$Sitio")) { throw "No existe el sitio IIS $Sitio" }
if (Get-WebVirtualDirectory -Site $Sitio -Name 'estado/datos') {
    Set-ItemProperty "IIS:\Sites\$Sitio\estado\datos" -Name physicalPath -Value $datos
} else {
    New-WebVirtualDirectory -Site $Sitio -Name 'estado/datos' -PhysicalPath $datos | Out-Null
}
Write-Host "Directorio virtual $Sitio/estado/datos -> $datos"

# 4. Tarea programada
$tarea   = 'DIGIAGRO estado'
$accion  = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$Base\comprobar.ps1`""
$disparo = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 2)
$ajustes = New-ScheduledTaskSettingsSet -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Minutes 10) -StartWhenAvailable
$quien   = New-ScheduledTaskPrincipal -UserId 'SYSTEM' -LogonType ServiceAccount -RunLevel Highest
Register-ScheduledTask -TaskName $tarea -Action $accion -Trigger $disparo -Settings $ajustes -Principal $quien `
    -Description 'Comprueba SAVIA, los cuadernos y la web de DIGIAGRO y alimenta el panel http://150.214.178.23/estado/' -Force | Out-Null
Write-Host "Tarea '$tarea' registrada (cada 2 min, SYSTEM)"
Start-ScheduledTask -TaskName $tarea
for ($i = 0; $i -lt 40; $i++) { Start-Sleep 3; if ((Get-ScheduledTask -TaskName $tarea).State -ne 'Running') { break } }
Write-Host "Primera comprobacion: resultado $((Get-ScheduledTaskInfo -TaskName $tarea).LastTaskResult)"

if ($PruebaCorreo) {
    & powershell -NoProfile -ExecutionPolicy Bypass -File "$Base\comprobar.ps1" -PruebaCorreo
}

# 5. Comprobación
Write-Host ''
foreach ($u in "http://$Ip/estado/", "http://$Ip/estado/datos/estado.json", 'https://savia.ujaen.es/health') {
    try { $r = Invoke-WebRequest $u -UseBasicParsing -TimeoutSec 20; Write-Host "$u -> $($r.StatusCode) ($($r.Content.Length) bytes)" }
    catch { Write-Warning "$u -> $($_.Exception.Message)" }
}
if (Test-Path "$Base\logs\comprobar.log") { Get-Content "$Base\logs\comprobar.log" -Tail 3 }
