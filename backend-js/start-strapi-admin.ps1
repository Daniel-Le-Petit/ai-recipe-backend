# Script pour démarrer Strapi avec des privilèges administrateur
Write-Host "🚀 Démarrage de Strapi avec privilèges administrateur..." -ForegroundColor Green

# Vérifier si on est dans le bon répertoire
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erreur: package.json non trouvé. Assurez-vous d'être dans le répertoire backend-js" -ForegroundColor Red
    exit 1
}

# Vérifier si node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
    npm install
}

# Démarrer Strapi
Write-Host "🔧 Démarrage de Strapi en mode développement..." -ForegroundColor Cyan
Write-Host "📍 URL: http://localhost:1338" -ForegroundColor Cyan
Write-Host "🔑 Admin: http://localhost:1338/admin" -ForegroundColor Cyan
Write-Host ""

try {
    npm run develop
} catch {
    Write-Host "❌ Erreur lors du démarrage de Strapi: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Essayez de redémarrer PowerShell en tant qu'administrateur" -ForegroundColor Yellow
} 