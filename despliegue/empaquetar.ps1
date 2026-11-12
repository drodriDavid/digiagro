# Prepara la carpeta para subir al servidor de savia (se ejecuta en el PC de trabajo).
# Resultado: C:\ProyectosUJA\subir-savia\digiagro\ con web\, los scripts del servidor y un .zip con todo.
param(
    [string]$Salida = "C:\ProyectosUJA\subir-savia\digiagro"
)
$ErrorActionPreference = "Stop"
$repo = Split-Path $PSScriptRoot -Parent
$web  = Join-Path $Salida "web"

if (Test-Path $Salida) { Remove-Item $Salida -Recurse -Force }
New-Item -ItemType Directory -Force $web | Out-Null

# Ficheros de la web. Fuera: git, scripts, documentación y los vídeos de marca que la web no usa
# (de assets\marca\animacion solo se publica digiagro-logo-web.webm).
$fuera = '\\\.git(\\|$)|\\despliegue\\|\\README\.md$|\.nojekyll$|\.py$|\.sh$|\\assets\\marca\\animacion\\(?!digiagro-logo-web\.webm$)'
Get-ChildItem $repo -Recurse -File -Force | Where-Object { $_.FullName -notmatch $fuera } | ForEach-Object {
    $rel = $_.FullName.Substring($repo.Length + 1)
    $dst = Join-Path $web $rel
    New-Item -ItemType Directory -Force (Split-Path $dst) | Out-Null
    Copy-Item $_.FullName $dst
}
Copy-Item (Join-Path $PSScriptRoot "web.config") $web
foreach ($f in "instalar-en-savia.ps1", "pasar-a-dominio.ps1", "LEEME.txt") { Copy-Item (Join-Path $PSScriptRoot $f) $Salida }

$zip = "$Salida.zip"
if (Test-Path $zip) { Remove-Item $zip -Force }
Compress-Archive -Path "$Salida\*" -DestinationPath $zip

$n  = (Get-ChildItem $web -Recurse -File).Count
$mb = [math]::Round((Get-ChildItem $web -Recurse -File | Measure-Object Length -Sum).Sum / 1MB, 1)
Write-Host "Paquete listo: $Salida ($n ficheros, $mb MB) y $zip"
