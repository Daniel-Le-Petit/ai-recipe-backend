# Script pour initialiser la base de données PostgreSQL
Write-Host "Initialisation de la base de données PostgreSQL..." -ForegroundColor Green

# Variables de configuration
$DB_NAME = "strapi"
$DB_USER = "postgres"
$DB_PASSWORD = ""

# Vérifier si PostgreSQL est démarré
try {
    $pgVersion = & psql --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ PostgreSQL non trouvé. Veuillez l'installer." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ PostgreSQL non trouvé. Veuillez l'installer." -ForegroundColor Red
    exit 1
}

# Créer la base de données si elle n'existe pas
Write-Host "📂 Création de la base de données '$DB_NAME'..." -ForegroundColor Yellow
try {
    & psql -U $DB_USER -h localhost -c "CREATE DATABASE $DB_NAME;" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Base de données '$DB_NAME' créée avec succès!" -ForegroundColor Green
    } else {
        Write-Host "ℹ️ Base de données '$DB_NAME' existe déjà ou erreur de création." -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Erreur lors de la création de la base de données: $_" -ForegroundColor Yellow
}

Write-Host "✅ Initialisation terminée!" -ForegroundColor Green
Write-Host "Vous pouvez maintenant démarrer Strapi avec: .\start-postgres.ps1" -ForegroundColor Cyan 