# Script pour demarrer PostgreSQL et Strapi depuis PowerShell
Write-Host "Demarrage complet depuis PowerShell..." -ForegroundColor Green

# 1. Demarrer PostgreSQL
Write-Host "Demarrage de PostgreSQL..." -ForegroundColor Yellow
$serviceName = "postgresql-x64-17"
$service = Get-Service -Name $serviceName -ErrorAction SilentlyContinue

if ($service) {
    if ($service.Status -ne "Running") {
        Start-Service -Name $serviceName
        Start-Sleep -Seconds 3
    }
    Write-Host "PostgreSQL demarre!" -ForegroundColor Green
} else {
    Write-Host "Service PostgreSQL non trouve. Verifiez l'installation." -ForegroundColor Red
    exit 1
}

# 2. Creer la base de donnees si elle n'existe pas
Write-Host "Verification de la base de donnees..." -ForegroundColor Yellow
try {
    $env:PGPASSWORD = ""
    & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -h localhost -c "CREATE DATABASE strapi;" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Base de donnees 'strapi' creee!" -ForegroundColor Green
    } else {
        Write-Host "Base de donnees 'strapi' existe deja." -ForegroundColor Yellow
    }
} catch {
    Write-Host "Erreur lors de la creation de la base: $_" -ForegroundColor Yellow
}

# 3. Demarrer Strapi
Write-Host "Demarrage de Strapi..." -ForegroundColor Yellow
Set-Location "."

# Definir les variables d'environnement
$env:DATABASE_CLIENT = "postgres"
$env:DATABASE_HOST = "localhost"
$env:DATABASE_PORT = "5432"
$env:DATABASE_NAME = "strapi"
$env:DATABASE_USERNAME = "postgres"
$env:DATABASE_PASSWORD = ""

# Demarrer Strapi dans une nouvelle fenetre PowerShell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run develop"
Set-Location ".."

# 4. Demarrer le frontend
Write-Host "Demarrage du frontend..." -ForegroundColor Yellow
Set-Location "frontend-m"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
Set-Location ".."

Write-Host "Tous les services demarres!" -ForegroundColor Green
Write-Host "PostgreSQL: Service Windows" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:1338" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "Pour peupler la base de donnees:" -ForegroundColor Yellow
Write-Host "cd backend-js; node populate-postgres.js" -ForegroundColor Cyan 