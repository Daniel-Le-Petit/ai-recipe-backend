# Test de l'API Strapi avec PowerShell
$API_URL = "http://localhost:1338"

Write-Host "🧪 Test de l'API Strapi avec PowerShell..." -ForegroundColor Green
Write-Host ""

try {
    # 1. Test de récupération de toutes les recettes
    Write-Host "1️⃣ Récupération de toutes les recettes..." -ForegroundColor Cyan
    $allRecipesResponse = Invoke-RestMethod -Uri "$API_URL/api/recipies?populate=*" -Method Get
    Write-Host "✅ $($allRecipesResponse.data.Count) recettes trouvées" -ForegroundColor Green

    # Afficher les champs disponibles pour la première recette
    if ($allRecipesResponse.data.Count -gt 0) {
        $firstRecipe = $allRecipesResponse.data[0]
        Write-Host ""
        Write-Host "🔍 Champs disponibles dans la première recette:" -ForegroundColor Yellow
        Write-Host "Attributs: $($firstRecipe.attributes.PSObject.Properties.Name -join ', ')" -ForegroundColor Gray
        
        if ($firstRecipe.attributes.recipeState) {
            Write-Host "✅ recipeState: $($firstRecipe.attributes.recipeState)" -ForegroundColor Green
        } elseif ($firstRecipe.attributes.status) {
            Write-Host "⚠️ status (ancien): $($firstRecipe.attributes.status)" -ForegroundColor Yellow
        } else {
            Write-Host "❌ Aucun champ de statut trouvé" -ForegroundColor Red
        }
    }

    # 2. Test de filtrage par recipeState
    Write-Host ""
    Write-Host "2️⃣ Test de filtrage par recipeState..." -ForegroundColor Cyan
    $filterResponse = Invoke-RestMethod -Uri "$API_URL/api/recipies?filters[recipeState][`$eq]=submitted&populate=*" -Method Get
    Write-Host "✅ Recettes avec recipeState 'submitted': $($filterResponse.data.Count)" -ForegroundColor Green

    # 3. Test de filtrage par status (ancien)
    Write-Host ""
    Write-Host "3️⃣ Test de filtrage par status (ancien)..." -ForegroundColor Cyan
    try {
        $oldFilterResponse = Invoke-RestMethod -Uri "$API_URL/api/recipies?filters[status][`$eq]=submitted&populate=*" -Method Get
        Write-Host "⚠️ Recettes avec status 'submitted': $($oldFilterResponse.data.Count)" -ForegroundColor Yellow
    } catch {
        Write-Host "❌ Filtrage par status échoue: $($_.Exception.Message)" -ForegroundColor Red
    }

    Write-Host ""
    Write-Host "🎉 Test de l'API terminé avec succès !" -ForegroundColor Green

} catch {
    Write-Host ""
    Write-Host "❌ Erreur lors du test: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Détails: $($_.Exception)" -ForegroundColor Gray
} 