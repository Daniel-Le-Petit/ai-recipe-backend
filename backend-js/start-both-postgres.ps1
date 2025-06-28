# Script pour démarrer le frontend et le backend avec PostgreSQL
Write-Host "Démarrage du frontend et backend avec PostgreSQL..." -ForegroundColor Green

# Fonction pour démarrer le backend
function Start-Backend {
    Write-Host "Démarrage du backend..." -ForegroundColor Yellow
    Set-Location "backend-js"
    
    # Vérifier si PostgreSQL est disponible
    try {
        $pgVersion = & psql --version 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ PostgreSQL non trouvé. Veuillez l'installer." -ForegroundColor Red
            Write-Host "Téléchargez PostgreSQL depuis: https://www.postgresql.org/download/" -ForegroundColor Yellow
            exit 1
        }
    } catch {
        Write-Host "❌ PostgreSQL non trouvé. Veuillez l'installer." -ForegroundColor Red
        exit 1
    }
    
    # Définir les variables d'environnement pour PostgreSQL
    $env:DATABASE_CLIENT = "postgres"
    $env:DATABASE_HOST = "localhost"
    $env:DATABASE_PORT = "5432"
    $env:DATABASE_NAME = "strapi"
    $env:DATABASE_USERNAME = "postgres"
    $env:DATABASE_PASSWORD = ""
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run develop"
    Set-Location ".."
}

# Fonction pour démarrer le frontend
function Start-Frontend {
    Write-Host "Démarrage du frontend..." -ForegroundColor Yellow
    Set-Location "frontend-m"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
    Set-Location ".."
}

# Démarrer les deux services
Start-Backend
Start-Sleep -Seconds 5
Start-Frontend

Write-Host "Services démarrés !" -ForegroundColor Green
Write-Host "Backend: http://localhost:1338" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "Pour peupler la base de données:" -ForegroundColor Yellow
Write-Host "cd backend-js && node populate-postgres.js" -ForegroundColor Cyan 