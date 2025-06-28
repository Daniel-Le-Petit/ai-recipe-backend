# Script PowerShell minimal pour créer 3 recettes associées à 3 catégories existantes

$API_URL = 'http://localhost:1338/api'

# 3 recettes simples, sans caractères spéciaux
$recipes = @(
    @{ title = "Poulet roti"; description = "Poulet roti et legumes"; duration = 60; difficulty = "Facile"; servings = 4; recipeState = "saved"; instructions = "Cuire au four"; ingredients = "Poulet, pommes de terre, carottes"; rating = 4.5; tags = @("poulet", "plat") },
    @{ title = "Salade verte"; description = "Salade fraiche"; duration = 10; difficulty = "Facile"; servings = 2; recipeState = "saved"; instructions = "Melanger les ingredients"; ingredients = "Salade, tomate, concombre"; rating = 4.0; tags = @("salade", "entree") },
    @{ title = "Gateau au chocolat"; description = "Dessert simple"; duration = 45; difficulty = "Facile"; servings = 6; recipeState = "saved"; instructions = "Cuire au four"; ingredients = "Chocolat, farine, oeufs, sucre"; rating = 4.8; tags = @("dessert", "chocolat") }
)

function Get-ExistingCategories {
    $response = Invoke-RestMethod -Uri "$API_URL/recipie-categories" -Method Get
    return $response.data
}

function Create-Recipes($categories) {
    for ($i = 0; $i -lt $recipes.Count; $i++) {
        $recipe = $recipes[$i]
        $categoryIndex = $i % $categories.Count
        $recipeData = $recipe.Clone()
        $recipeData.recipieCategory = $categories[$categoryIndex].id
        $body = @{ data = $recipeData } | ConvertTo-Json -Depth 3
        try {
            $response = Invoke-RestMethod -Uri "$API_URL/recipies" -Method Post -Body $body -ContentType "application/json"
            Write-Host "✅ Recette creee : $($recipe.title) (Categorie : $($categories[$categoryIndex].attributes.categoryName))"
        } catch {
            Write-Host "❌ Erreur creation recette $($recipe.title) : $($_.Exception.Message)"
        }
    }
}

# Execution principale
$categories = Get-ExistingCategories
if ($categories.Count -eq 0) {
    Write-Host "Aucune categorie trouvee. Creez d'abord des categories dans Strapi."
    exit
}
Create-Recipes $categories
Write-Host "Termine !"