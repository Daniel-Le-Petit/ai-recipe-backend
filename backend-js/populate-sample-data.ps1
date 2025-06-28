# PowerShell script to populate database with sample data
$API_URL = 'http://localhost:1338/api'

Write-Host "🚀 Starting database population..." -ForegroundColor Green

# Sample categories
$categories = @(
    @{
        categoryName = "Plats principaux"
        categoryDescription = "Recettes de plats principaux pour le déjeuner ou le dîner"
    },
    @{
        categoryName = "Entrées"
        categoryDescription = "Entrées et apéritifs"
    },
    @{
        categoryName = "Desserts"
        categoryDescription = "Desserts et pâtisseries"
    },
    @{
        categoryName = "Petit-déjeuner"
        categoryDescription = "Recettes pour le petit-déjeuner"
    },
    @{
        categoryName = "Soupes"
        categoryDescription = "Soupes et potages"
    }
)

# Sample recipes
$recipes = @(
    @{
        title = "Poulet rôti aux herbes"
        description = "Un délicieux poulet rôti avec des herbes fraîches et des légumes"
        duration = 60
        difficulty = "Facile"
        servings = 4
        recipeState = "saved"
        instructions = "1. Préchauffer le four à 180°C`n2. Assaisonner le poulet avec sel, poivre et herbes`n3. Placer dans un plat avec des légumes`n4. Cuire 45-50 minutes"
        ingredients = "Poulet entier, herbes de Provence, huile d'olive, sel, poivre, carottes, oignons"
        rating = 4.5
        tags = @("poulet", "herbes", "rôti")
    },
    @{
        title = "Salade César"
        description = "Une salade César classique avec une vinaigrette crémeuse"
        duration = 20
        difficulty = "Facile"
        servings = 2
        recipeState = "saved"
        instructions = "1. Laver et couper la laitue`n2. Préparer la vinaigrette`n3. Ajouter les croûtons et le parmesan`n4. Mélanger délicatement"
        ingredients = "Laitue romaine, parmesan, croûtons, anchois, huile d'olive, citron, ail"
        rating = 4.2
        tags = @("salade", "végétarien", "rapide")
    },
    @{
        title = "Tiramisu classique"
        description = "Le dessert italien par excellence avec café et mascarpone"
        duration = 30
        difficulty = "Intermédiaire"
        servings = 6
        recipeState = "saved"
        instructions = "1. Préparer le café fort`n2. Battre les jaunes avec le sucre`n3. Incorporer le mascarpone`n4. Monter les blancs en neige`n5. Alterner couches de biscuits et crème"
        ingredients = "Mascarpone, œufs, sucre, café fort, biscuits à la cuillère, cacao"
        rating = 4.8
        tags = @("dessert", "italien", "café")
    },
    @{
        title = "Omelette aux champignons"
        description = "Une omelette moelleuse garnie de champignons sautés"
        duration = 15
        difficulty = "Facile"
        servings = 1
        recipeState = "saved"
        instructions = "1. Battre les œufs avec sel et poivre`n2. Sauter les champignons`n3. Verser les œufs dans la poêle`n4. Plier l'omelette"
        ingredients = "Œufs, champignons, beurre, sel, poivre, persil"
        rating = 4.0
        tags = @("petit-déjeuner", "rapide", "végétarien")
    },
    @{
        title = "Soupe à l'oignon gratinée"
        description = "Une soupe traditionnelle française avec du fromage gratiné"
        duration = 90
        difficulty = "Intermédiaire"
        servings = 4
        recipeState = "saved"
        instructions = "1. Émincer les oignons finement`n2. Les faire caraméliser à feu doux`n3. Ajouter le bouillon et laisser mijoter`n4. Gratiner au four avec du fromage"
        ingredients = "Oignons, bouillon de bœuf, beurre, pain, gruyère, vin blanc"
        rating = 4.6
        tags = @("soupe", "français", "réconfortant")
    }
)

function Create-Categories {
    Write-Host "Creating categories..." -ForegroundColor Yellow
    $createdCategories = @()
    
    foreach ($category in $categories) {
        try {
            $body = @{
                data = $category
            } | ConvertTo-Json -Depth 3
            
            $response = Invoke-RestMethod -Uri "$API_URL/recipie-categories" -Method Post -Body $body -ContentType "application/json"
            $createdCategories += $response.data
            Write-Host "✅ Created category: $($category.categoryName)" -ForegroundColor Green
        }
        catch {
            Write-Host "❌ Error creating category $($category.categoryName): $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    return $createdCategories
}

function Create-Recipes($categories) {
    Write-Host "Creating recipes..." -ForegroundColor Yellow
    
    for ($i = 0; $i -lt $recipes.Count; $i++) {
        $recipe = $recipes[$i]
        $categoryIndex = $i % $categories.Count
        
        try {
            $recipeData = $recipe.Clone()
            $recipeData.recipieCategory = $categories[$categoryIndex].id
            
            $body = @{
                data = $recipeData
            } | ConvertTo-Json -Depth 3
            
            $response = Invoke-RestMethod -Uri "$API_URL/recipies" -Method Post -Body $body -ContentType "application/json"
            Write-Host "✅ Created recipe: $($recipe.title)" -ForegroundColor Green
        }
        catch {
            Write-Host "❌ Error creating recipe $($recipe.title): $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Main execution
try {
    # Create categories first
    $createdCategories = Create-Categories
    
    if ($createdCategories.Count -eq 0) {
        Write-Host "❌ No categories were created. Stopping." -ForegroundColor Red
        exit
    }
    
    # Create recipes with category associations
    Create-Recipes $createdCategories
    
    Write-Host "🎉 Database population completed!" -ForegroundColor Green
    Write-Host "📊 Created $($createdCategories.Count) categories and $($recipes.Count) recipes" -ForegroundColor Cyan
    
}
catch {
    Write-Host "❌ Error populating database: $($_.Exception.Message)" -ForegroundColor Red
} 