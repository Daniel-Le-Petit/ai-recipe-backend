# Script d'installation complet pour l'environnement de développement
# Configure tout automatiquement selon vos préférences

Write-Host "🔧 Installation de l'environnement de développement..." -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Vérifier les prérequis
Write-Host "📋 Vérification des prérequis..." -ForegroundColor Yellow

$prerequisites = @{
    "Node.js" = "node"
    "npm" = "npm"
    "Git" = "git"
    "WSL" = "wsl"
}

foreach ($prereq in $prerequisites.GetEnumerator()) {
    try {
        $version = & $prereq.Value --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $($prereq.Key): $version" -ForegroundColor Green
        } else {
            Write-Host "❌ $($prereq.Key): Non installé" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ $($prereq.Key): Non installé" -ForegroundColor Red
    }
}

Write-Host ""

# Configuration de Windows Terminal
Write-Host "⚙️ Configuration de Windows Terminal..." -ForegroundColor Yellow
& "$PSScriptRoot\setup-terminal-layout.ps1"

Write-Host ""

# Création du raccourci de bureau
Write-Host "📋 Création du raccourci de bureau..." -ForegroundColor Yellow
& "$PSScriptRoot\create-shortcut.ps1"

Write-Host ""

# Test de l'organisation des fenêtres
Write-Host "🎯 Test de l'organisation des fenêtres..." -ForegroundColor Yellow
& "$PSScriptRoot\start-layout.ps1"

Write-Host ""
Write-Host "🎉 Installation terminée!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Instructions d'utilisation:" -ForegroundColor Cyan
Write-Host "1. Double-cliquez sur le raccourci 'Dev Environment' sur votre bureau" -ForegroundColor White
Write-Host "2. Ou exécutez: .\auto-start-dev.ps1" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Disposition automatique:" -ForegroundColor Cyan
Write-Host "• Frontend-js et Frontend: Zone gauche (60% de l'écran)" -ForegroundColor White
Write-Host "• WSL/Terminal: Zone bas gauche (30% de la hauteur)" -ForegroundColor White
Write-Host "• Prompts/Chat: Zone droite (40% de l'écran)" -ForegroundColor White
Write-Host ""
Write-Host "⚡ Pour réorganiser les fenêtres à tout moment:" -ForegroundColor Cyan
Write-Host "   .\start-layout.ps1" -ForegroundColor White
Write-Host ""
Write-Host "🔄 Redémarrez Windows Terminal pour appliquer la configuration" -ForegroundColor Yellow 