# Deja la web de DIGIAGRO independiente de SAVIA en este servidor. EJECUTAR COMO ADMINISTRADOR, una vez
# (y otra vez si cambia despliegue\sincronizar.ps1). Se puede repetir sin riesgo.
#   - carpeta propia F:\digiagro (web, repo, paquete, logs), fuera de F:\savia
#   - el sitio IIS "DIGIAGRO" pasa a servir F:\digiagro\web
#   - tarea programada propia "DIGIAGRO autoupdate" (SYSTEM, cada 5 min) con F:\digiagro\sincronizar.ps1
#   - borra lo que quedaba dentro de SAVIA (F:\savia\digiagro y F:\savia\webs-src\digiagro*)
param(
    [string]$Base  = 'F:\digiagro',
    [string]$Sitio = 'DIGIAGRO',
    [string]$Ip    = '150.214.178.23'
)
$ErrorActionPreference = 'Stop'
$admin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $admin) { throw 'Abre PowerShell como administrador.' }
Import-Module WebAdministration

# 1. Carpeta propia y copia del sincronizador
foreach ($d in 'web', 'logs') { New-Item -ItemType Directory -Force (Join-Path $Base $d) | Out-Null }
Copy-Item (Join-Path $PSScriptRoot 'sincronizar.ps1') (Join-Path $Base 'sincronizar.ps1') -Force
$viejo = 'F:\savia\digiagro\web'
if ((Test-Path "$viejo\index.html") -and -not (Test-Path "$Base\web\index.html")) {
    robocopy $viejo "$Base\web" /MIR /R:2 /W:2 /NFL /NDL /NJH /NJS /NP | Out-Null
    if ($LASTEXITCODE -ge 8) { throw "robocopy fallo (codigo $LASTEXITCODE)" }
}
icacls "$Base\web" /grant "IIS AppPool\$($Sitio):(OI)(CI)RX" /T /Q | Out-Null
Write-Host "Carpeta $Base lista"

# 2. IIS: el sitio sirve la carpeta nueva
if (-not (Test-Path "IIS:\Sites\$Sitio")) { throw "No existe el sitio $Sitio (ejecuta antes instalar-en-savia.ps1)" }
Set-ItemProperty "IIS:\Sites\$Sitio" -Name physicalPath -Value "$Base\web"
Write-Host "Sitio $Sitio -> $Base\web"

# 3. Tarea programada propia
$tarea  = 'DIGIAGRO autoupdate'
$accion = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$Base\sincronizar.ps1`""
$disparo = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 5)
$ajustes = New-ScheduledTaskSettingsSet -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Minutes 30) -StartWhenAvailable
$quien  = New-ScheduledTaskPrincipal -UserId 'SYSTEM' -LogonType ServiceAccount -RunLevel Highest
Register-ScheduledTask -TaskName $tarea -Action $accion -Trigger $disparo -Settings $ajustes -Principal $quien `
    -Description 'Actualiza la web de DIGIAGRO (sitio IIS DIGIAGRO) desde GitHub drodriDavid/digiagro. Independiente de SAVIA.' -Force | Out-Null
Write-Host "Tarea '$tarea' registrada (cada 5 min, SYSTEM)"
Start-ScheduledTask -TaskName $tarea
$ok = $false
for ($i = 0; $i -lt 60; $i++) {
    Start-Sleep 3
    if ((Get-ScheduledTask -TaskName $tarea).State -ne 'Running') { $ok = $true; break }
}
$info = Get-ScheduledTaskInfo -TaskName $tarea
Write-Host "Primera ejecucion: resultado $($info.LastTaskResult) $(if (-not $ok) { '(sigue en marcha)' })"
if (Test-Path "$Base\logs\sincronizar.log") { Get-Content "$Base\logs\sincronizar.log" -Tail 3 }

# 4. Limpiar lo que quedaba dentro de SAVIA
foreach ($p in 'F:\savia\digiagro', 'F:\savia\webs-src\digiagro', 'F:\savia\webs-src\digiagro-paquete', 'F:\savia\webs-src\digiagro-paquete.zip') {
    if (Test-Path $p) { cmd /c "rmdir /s /q `"$p`" 2>nul & del /f /q `"$p`" 2>nul" | Out-Null; Write-Host "Borrado $p" }
}
if ((Test-Path 'F:\savia\webs-src') -and -not (Get-ChildItem 'F:\savia\webs-src' -Force)) { Remove-Item 'F:\savia\webs-src' -Force }

# 5. Comprobaciones: enlaces de todos los sitios y respuestas
Write-Host ''
Get-ChildItem IIS:\Sites | ForEach-Object {
    $s = $_
    $s.Bindings.Collection | ForEach-Object { '{0,-22} {1,-6} {2,-40} {3}' -f $s.Name, $_.protocol, $_.bindingInformation, $s.physicalPath }
}
Write-Host ''
foreach ($u in "http://$Ip/", 'https://savia.ujaen.es/health', 'https://savia.ujaen.es/cuadernos/livingsoill-cuaderno/') {
    try { $r = Invoke-WebRequest $u -UseBasicParsing -TimeoutSec 20; Write-Host "$u -> $($r.StatusCode) $(if ($r.Content -match 'DIGIAGRO') { '(DIGIAGRO)' })" }
    catch { Write-Warning "$u -> $($_.Exception.Message)" }
}
