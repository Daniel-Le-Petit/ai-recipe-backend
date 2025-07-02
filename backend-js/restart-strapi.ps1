# Script pour redémarrer Strapi avec les bonnes variables d'environnement
Write-Host "Redémarrage de Strapi avec les bonnes variables d'environnement..." -ForegroundColor Green

# Définir les variables d'environnement
$env:DATABASE_CLIENT = "postgres"
$env:DATABASE_HOST = "localhost"
$env:DATABASE_PORT = "5432"
$env:DATABASE_NAME = "aifinesherbes"
$env:DATABASE_USERNAME = "postgres"
$env:DATABASE_PASSWORD = "AliceNinon2025!"
$env:DATABASE_SSL = "false"

Write-Host "Variables d'environnement définies:" -ForegroundColor Yellow
Write-Host "  DATABASE_HOST: $env:DATABASE_HOST" -ForegroundColor White
Write-Host "  DATABASE_PORT: $env:DATABASE_PORT" -ForegroundColor White
Write-Host "  DATABASE_NAME: $env:DATABASE_NAME" -ForegroundColor White
Write-Host "  DATABASE_USERNAME: $env:DATABASE_USERNAME" -ForegroundColor White
Write-Host "  DATABASE_PASSWORD: $env:DATABASE_PASSWORD" -ForegroundColor White

Write-Host "`nRedémarrage de Strapi..." -ForegroundColor Cyan
npm run develop 