# Pasa el sitio DIGIAGRO de la IP al dominio, con HTTPS. Ejecutar EN EL SERVIDOR como administrador
# cuando digiagro.ujaen.es ya resuelva a este equipo y tengas el certificado.
#
# Certificado (elige una):
#   -Pfx  C:\certs\digiagro.pfx        (pide la contraseña del .pfx)
#   -Huella <thumbprint>               (si ya está importado en Equipo local > Personal)
# Si Informática te da .pem + .key como con savia, crea el .pfx antes (openssl viene con Git para Windows):
#   openssl pkcs12 -export -in digiagro_ujaen_es_completo.pem -inkey digiagro.ujaen.es.key -out digiagro.pfx
param(
    [string]$Dominio = "digiagro.ujaen.es",
    [string]$Ip      = "150.214.178.23",
    [string]$Sitio   = "DIGIAGRO",
    [string]$Pfx,
    [string]$Huella,
    [switch]$MantenerIp   # deja también el acceso por IP (por defecto se quita)
)
$ErrorActionPreference = "Stop"
Import-Module WebAdministration
if (-not (Test-Path "IIS:\Sites\$Sitio")) { throw "No existe el sitio $Sitio. Ejecuta antes instalar-en-savia.ps1." }

# 1. Certificado
if ($Pfx) {
    $clave = Read-Host "Contraseña del .pfx" -AsSecureString
    $cert  = Import-PfxCertificate -FilePath $Pfx -CertStoreLocation Cert:\LocalMachine\My -Password $clave
    $Huella = $cert.Thumbprint
}
if (-not $Huella) { throw "Indica -Pfx o -Huella." }
$cert = Get-Item "Cert:\LocalMachine\My\$Huella" -ErrorAction SilentlyContinue
if (-not $cert) { throw "No encuentro el certificado $Huella en Equipo local > Personal." }
if ($cert.DnsNameList.Unicode -notcontains $Dominio) { Write-Warning "El certificado no incluye $Dominio (incluye: $($cert.DnsNameList.Unicode -join ', '))" }
if ($cert.NotAfter -lt (Get-Date).AddDays(30)) { Write-Warning "El certificado caduca el $($cert.NotAfter)" }

# 2. Enlaces del dominio: http 80 y https 443 con SNI (convive con el 443 de savia)
if (-not (Get-WebBinding -Name $Sitio -Protocol http -HostHeader $Dominio)) {
    New-WebBinding -Name $Sitio -Protocol http -Port 80 -HostHeader $Dominio
}
if (-not (Get-WebBinding -Name $Sitio -Protocol https -HostHeader $Dominio)) {
    New-WebBinding -Name $Sitio -Protocol https -Port 443 -HostHeader $Dominio -SslFlags 1
}
(Get-WebBinding -Name $Sitio -Protocol https -HostHeader $Dominio).AddSslCertificate($Huella, "My")
Write-Host "HTTPS de $Dominio enlazado con el certificado $Huella"

# 3. Redirigir http -> https (necesita el módulo URL Rewrite, el mismo que suele usar savia)
$rewrite = Get-WebGlobalModule | Where-Object Name -eq "RewriteModule"
if ($rewrite) {
    $psPath = "IIS:\Sites\$Sitio"
    $filtro = "system.webServer/rewrite/rules"
    if (-not (Get-WebConfigurationProperty -PSPath $psPath -Filter "$filtro/rule[@name='A HTTPS']" -Name name -ErrorAction SilentlyContinue)) {
        Add-WebConfigurationProperty -PSPath $psPath -Filter $filtro -Name "." -Value @{ name = "A HTTPS"; stopProcessing = "True" }
        Set-WebConfigurationProperty -PSPath $psPath -Filter "$filtro/rule[@name='A HTTPS']/match" -Name url -Value "(.*)"
        Add-WebConfigurationProperty -PSPath $psPath -Filter "$filtro/rule[@name='A HTTPS']/conditions" -Name "." -Value @{ input = "{HTTPS}"; pattern = "^OFF$" }
        Set-WebConfigurationProperty -PSPath $psPath -Filter "$filtro/rule[@name='A HTTPS']/action" -Name type -Value "Redirect"
        Set-WebConfigurationProperty -PSPath $psPath -Filter "$filtro/rule[@name='A HTTPS']/action" -Name url -Value "https://{HTTP_HOST}/{R:1}"
        Set-WebConfigurationProperty -PSPath $psPath -Filter "$filtro/rule[@name='A HTTPS']/action" -Name redirectType -Value "Permanent"
        Write-Host "Redirección http -> https activada"
    }
} else {
    Write-Warning "URL Rewrite no está instalado: http://$Dominio no redirigirá a https."
}

# 4. Quitar el acceso por IP
if (-not $MantenerIp) {
    Remove-WebBinding -Name $Sitio -Protocol http -Port 80 -HostHeader $Ip -ErrorAction SilentlyContinue
    Write-Host "Acceso por http://$Ip/ retirado (vuelve a ir a savia)"
}

Write-Host ""
Get-WebBinding -Name $Sitio | Format-Table protocol, bindingInformation, sslFlags -AutoSize
try {
    $r = Invoke-WebRequest "https://$Dominio/" -UseBasicParsing -TimeoutSec 15
    Write-Host "OK: https://$Dominio/ -> $($r.StatusCode)" -ForegroundColor Green
} catch { Write-Warning "https://$Dominio/ aún no responde: $($_.Exception.Message) (¿resuelve ya el DNS?)" }
