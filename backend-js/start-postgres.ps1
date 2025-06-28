# Script pour démarrer Strapi avec PostgreSQL
Write-Host "Démarrage de Strapi avec PostgreSQL..." -ForegroundColor Green

# Vérifier si PostgreSQL est installé
try {
    $pgVersion = & psql --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PostgreSQL détecté: $pgVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ PostgreSQL non trouvé. Veuillez l'installer ou le démarrer." -ForegroundColor Red
        Write-Host "Vous pouvez télécharger PostgreSQL depuis: https://www.postgresql.org/download/" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ PostgreSQL non trouvé. Veuillez l'installer ou le démarrer." -ForegroundColor Red
    exit 1
}

# Définir les variables d'environnement pour PostgreSQL
$env:DATABASE_CLIENT = "postgres"
$env:DATABASE_HOST = "localhost"
$env:DATABASE_PORT = "5432"
$env:DATABASE_NAME = "strapi"
$env:DATABASE_USERNAME = "postgres"
$env:DATABASE_PASSWORD = ""

# Démarrer Strapi
Write-Host "🚀 Démarrage de Strapi..." -ForegroundColor Yellow
npm run develop 