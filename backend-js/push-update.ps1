# Script pour pousser les mises à jour du backend sur GitHub

Write-Host "🔄 Vérification de l'état du dépôt..." -ForegroundColor Yellow
git status

Write-Host "📥 Récupération des dernières modifications..." -ForegroundColor Blue
git pull origin main

Write-Host "📁 Ajout des fichiers modifiés..." -ForegroundColor Green
git add .

Write-Host "💾 Création du commit..." -ForegroundColor Cyan
git commit -m "feat: Ajout du log de mise à jour et améliorations système - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"

Write-Host "🚀 Push vers GitHub..." -ForegroundColor Magenta
git push origin main

Write-Host "✅ Mise à jour terminée avec succès!" -ForegroundColor Green 