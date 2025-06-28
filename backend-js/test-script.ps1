# Script de test pour verifier que l'environnement fonctionne
Write-Host "Test de l'environnement de developpement..." -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Test 1: Verifier que nous sommes dans le bon repertoire
Write-Host "Repertoire actuel: $PWD" -ForegroundColor Cyan

# Test 2: Verifier que les fichiers existent
$requiredFiles = @("auto-start-dev.ps1", "start-layout.ps1")
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "OK $file trouve" -ForegroundColor Green
    } else {
        Write-Host "ERREUR $file manquant" -ForegroundColor Red
    }
}

# Test 3: Verifier les chemins des projets
$projects = @(
    "C:\Users\AIFinesHerbes\AIFB\backend-js",
    "C:\Users\AIFinesHerbes\AIFB\frontend-m"
)

foreach ($project in $projects) {
    if (Test-Path $project) {
        Write-Host "OK Projet trouve: $project" -ForegroundColor Green
    } else {
        Write-Host "ERREUR Projet manquant: $project" -ForegroundColor Red
    }
}

# Test 4: Verifier PowerShell
Write-Host "Version PowerShell: $($PSVersionTable.PSVersion)" -ForegroundColor Cyan

# Test 5: Verifier la politique d'execution
$executionPolicy = Get-ExecutionPolicy
Write-Host "Politique d'execution: $executionPolicy" -ForegroundColor Cyan

if ($executionPolicy -eq "Restricted") {
    Write-Host "ATTENTION: Politique d'execution restrictive" -ForegroundColor Yellow
    Write-Host "   Executez: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Test termine!" -ForegroundColor Green
Write-Host "Si tous les tests sont verts, votre environnement est pret." -ForegroundColor White

# Pause pour voir les resultats
Read-Host "Appuyez sur Entree pour continuer..." 