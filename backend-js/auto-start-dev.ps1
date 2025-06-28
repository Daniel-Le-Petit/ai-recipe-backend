# Script de démarrage automatique pour l'environnement de développement
# Lance tous les projets et organise les fenêtres automatiquement

Write-Host "🚀 Démarrage automatique de l'environnement de développement..." -ForegroundColor Green

# Fonction pour vérifier si un processus est en cours d'exécution
function Test-ProcessRunning {
    param([string]$ProcessName)
    return (Get-Process -Name $ProcessName -ErrorAction SilentlyContinue).Count -gt 0
}

# Fonction pour lancer un projet
function Start-Project {
    param(
        [string]$ProjectPath,
        [string]$ProjectName,
        [string]$StartCommand = "npm run dev"
    )
    
    Write-Host "📁 Lancement de $ProjectName..." -ForegroundColor Yellow
    
    if (Test-Path $ProjectPath) {
        # Changer vers le répertoire du projet
        Push-Location $ProjectPath
        
        # Lancer le projet en arrière-plan
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ProjectPath'; $StartCommand" -WindowStyle Normal
        
        Pop-Location
        Write-Host "✅ $ProjectName lancé" -ForegroundColor Green
    } else {
        Write-Host "❌ Répertoire $ProjectPath introuvable" -ForegroundColor Red
    }
}

# Fonction pour lancer VS Code/Cursor
function Start-Editor {
    param([string]$ProjectPath, [string]$ProjectName)
    
    if (Test-Path $ProjectPath) {
        Write-Host "📝 Ouverture de $ProjectName dans l'éditeur..." -ForegroundColor Cyan
        
        # Essayer Cursor d'abord, puis VS Code
        if (Test-ProcessRunning "cursor") {
            Start-Process cursor -ArgumentList $ProjectPath
        } elseif (Test-ProcessRunning "code") {
            Start-Process code -ArgumentList $ProjectPath
        } else {
            # Lancer Cursor par défaut
            Start-Process cursor -ArgumentList $ProjectPath
        }
    }
}

# Attendre un peu pour que les processus se lancent
function Wait-ForProcesses {
    Write-Host "⏳ Attente du lancement des processus..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
}

# Configuration des projets
$projects = @(
    @{
        Path = "C:\Users\AIFinesHerbes\AIFB\backend-js"
        Name = "Backend JS"
        Command = "npm run develop"
    },
    @{
        Path = "C:\Users\AIFinesHerbes\AIFB\frontend-m"
        Name = "Frontend"
        Command = "npm run dev"
    }
)

# Lancer les projets
foreach ($project in $projects) {
    Start-Project -ProjectPath $project.Path -ProjectName $project.Name -StartCommand $project.Command
}

# Attendre que les processus se lancent
Wait-ForProcesses

# Lancer les éditeurs pour chaque projet
foreach ($project in $projects) {
    Start-Editor -ProjectPath $project.Path -ProjectName $project.Name
}

# Attendre un peu plus pour que les éditeurs s'ouvrent
Start-Sleep -Seconds 3

# Lancer le script d'organisation des fenêtres
Write-Host "🎯 Organisation des fenêtres..." -ForegroundColor Magenta
& "$PSScriptRoot\start-layout.ps1"

Write-Host "🎉 Environnement de développement prêt!" -ForegroundColor Green
Write-Host "Disposition:" -ForegroundColor White
Write-Host "  • Frontend-js et Frontend: Zone gauche (60% de l'écran)" -ForegroundColor White
Write-Host "  • WSL/Terminal: Zone bas gauche (30% de la hauteur)" -ForegroundColor White
Write-Host "  • Prompts/Chat: Zone droite (40% de l'écran)" -ForegroundColor White 