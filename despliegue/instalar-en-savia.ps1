# Publica la web de DIGIAGRO en el IIS del servidor de savia, accesible por IP: http://150.214.178.23/
# Ejecutar EN EL SERVIDOR, en PowerShell como administrador, desde la carpeta que contiene web\.
# Volver a ejecutarlo actualiza el contenido (copia en espejo) sin tocar savia.
#
# Cómo convive con savia: es un sitio IIS propio con el enlace http *:80 y nombre de host = la IP.
# IIS prefiere el enlace con nombre de host, así que quien entra por la IP ve DIGIAGRO y quien entra
# por savia.ujaen.es sigue viendo savia. HTTPS por IP sigue yendo a savia (no hay certificado para una IP).
param(
    [string]$Ip      = "150.214.178.23",
    [string]$Carpeta = "C:\inetpub\digiagro",
    [string]$Sitio   = "DIGIAGRO"
)
$ErrorActionPreference = "Stop"

$admin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $admin) { throw "Abre PowerShell como administrador." }

$origen = Join-Path $PSScriptRoot "web"
if (-not (Test-Path (Join-Path $origen "index.html"))) { throw "No encuentro $origen\index.html. Ejecuta el script desde la carpeta del paquete." }

Import-Module WebAdministration

# 1. Copiar la web (espejo: lo que ya no está en el paquete se borra de $Carpeta)
New-Item -ItemType Directory -Force $Carpeta | Out-Null
robocopy $origen $Carpeta /MIR /R:2 /W:2 /NFL /NDL /NJH /NP | Out-Null
if ($LASTEXITCODE -ge 8) { throw "robocopy falló (código $LASTEXITCODE)" }
Write-Host "Contenido copiado en $Carpeta"

# 2. Grupo de aplicaciones propio, sin .NET (la web es estática)
$pool = $Sitio
if (-not (Test-Path "IIS:\AppPools\$pool")) {
    New-WebAppPool -Name $pool | Out-Null
    Set-ItemProperty "IIS:\AppPools\$pool" -Name managedRuntimeVersion -Value ""
    Write-Host "Grupo de aplicaciones $pool creado"
}
icacls $Carpeta /grant "IIS AppPool\$($pool):(OI)(CI)RX" /T /Q | Out-Null

# 3. Sitio con enlace por IP
$enlace = "*:80:$Ip"
if (-not (Test-Path "IIS:\Sites\$Sitio")) {
    $ocupado = Get-WebBinding -Protocol http | Where-Object { $_.bindingInformation -eq $enlace }
    if ($ocupado) { throw "El enlace $enlace ya lo usa otro sitio: $($ocupado.ItemXPath)" }
    New-Website -Name $Sitio -PhysicalPath $Carpeta -ApplicationPool $pool -Port 80 -HostHeader $Ip | Out-Null
    Write-Host "Sitio $Sitio creado con enlace http $enlace"
} else {
    Set-ItemProperty "IIS:\Sites\$Sitio" -Name physicalPath -Value $Carpeta
    Write-Host "Sitio $Sitio ya existía: contenido actualizado"
}
Start-WebAppPool -Name $pool -ErrorAction SilentlyContinue
Start-Website -Name $Sitio -ErrorAction SilentlyContinue

# 4. Comprobaciones
Write-Host ""
Get-WebBinding -Name $Sitio | Format-Table protocol, bindingInformation -AutoSize
try {
    $r = Invoke-WebRequest "http://$Ip/" -UseBasicParsing -TimeoutSec 15
    if ($r.Content -match "DIGIAGRO") { Write-Host "OK: http://$Ip/ sirve DIGIAGRO" -ForegroundColor Green }
    else { Write-Warning "http://$Ip/ responde, pero no parece DIGIAGRO" }
    $v = Invoke-WebRequest "http://$Ip/assets/marca/animacion/digiagro-logo-web.webm" -UseBasicParsing -Method Head -TimeoutSec 15
    Write-Host "Vídeo del logo: $($v.StatusCode) $($v.Headers['Content-Type'])"
} catch { Write-Warning "No pude abrir http://$Ip/ : $($_.Exception.Message)" }
try {
    $s = Invoke-WebRequest "https://savia.ujaen.es/" -UseBasicParsing -TimeoutSec 15
    Write-Host "savia.ujaen.es sigue respondiendo: $($s.StatusCode)" -ForegroundColor Green
} catch { Write-Warning "Revisa savia.ujaen.es: $($_.Exception.Message)" }
