# PowerShell script to create recipes for existing categories
$API_URL = 'http://localhost:1338/api'

Write-Host "🚀 Creating recipes for existing categories..." -ForegroundColor Green

# Sample recipes for different categories
$recipes = @(
    # Plats principaux
    @{
        title = "Poulet rôti aux herbes de Provence"
        description = "Un délicieux poulet rôti avec des herbes fraîches et des légumes de saison"
        duration = 75
        difficulty = "Facile"
        servings = 4
        recipeState = "saved"
        instructions = "1. Préchauffer le four à 180°C`n2. Assaisonner le poulet avec sel, poivre et herbes de Provence`n3. Placer dans un plat avec carottes, oignons et pommes de terre`n4. Cuire 45-50 minutes en arrosant régulièrement"
        ingredients = "Poulet entier (1.5kg), herbes de Provence, huile d'olive, sel, poivre, carottes, oignons, pommes de terre"
        rating = 4.5
        tags = @("poulet", "herbes", "rôti", "plats")
    },
    @{
        title = "Saumon grillé aux légumes"
        description = "Filet de saumon grillé accompagné de légumes vapeur et citron"
        duration = 30
        difficulty = "Facile"
        servings = 2
        recipeState = "saved"
        instructions = "1. Préchauffer le gril à feu moyen`n2. Assaisonner le saumon avec sel, poivre et citron`n3. Cuire les légumes à la vapeur`n4. Griller le saumon 8-10 minutes de chaque côté"
        ingredients = "Filet de saumon, brocoli, carottes, citron, huile d'olive, sel, poivre, herbes fraîches"
        rating = 4.3
        tags = @("poisson", "grillé", "légumes", "sain")
    },
    @{
        title = "Lasagnes bolognaise"
        description = "Lasagnes traditionnelles avec sauce bolognaise et béchamel"
        duration = 120
        difficulty = "Intermédiaire"
        servings = 6
        recipeState = "saved"
        instructions = "1. Préparer la sauce bolognaise (1h)`n2. Préparer la béchamel`n3. Alterner couches de pâtes, sauce et béchamel`n4. Cuire au four 30 minutes"
        ingredients = "Pâtes à lasagnes, viande hachée, tomates, oignons, carottes, béchamel, parmesan, mozzarella"
        rating = 4.7
        tags = @("italien", "pâtes", "fromage", "familial")
    },
    
    # Entrées
    @{
        title = "Salade César authentique"
        description = "Salade César classique avec vinaigrette crémeuse et croûtons maison"
        duration = 25
        difficulty = "Facile"
        servings = 2
        recipeState = "saved"
        instructions = "1. Laver et couper la laitue romaine`n2. Préparer la vinaigrette avec anchois et parmesan`n3. Faire des croûtons à l'ail`n4. Assembler et servir immédiatement"
        ingredients = "Laitue romaine, parmesan, croûtons, anchois, huile d'olive, citron, ail, œuf, moutarde"
        rating = 4.4
        tags = @("salade", "végétarien", "rapide", "classique")
    },
    @{
        title = "Terrine de foie gras maison"
        description = "Terrine de foie gras traditionnelle avec pain de campagne"
        duration = 180
        difficulty = "Difficile"
        servings = 8
        recipeState = "saved"
        instructions = "1. Dénerver le foie gras`n2. Assaisonner avec sel, poivre et épices`n3. Mettre en terrine et cuire au bain-marie`n4. Laisser refroidir 24h"
        ingredients = "Foie gras de canard, sel, poivre, épices, pain de campagne, confiture d'oignons"
        rating = 4.9
        tags = @("foie gras", "terrine", "festif", "traditionnel")
    },
    @{
        title = "Bruschetta tomates-mozzarella"
        description = "Tartines italiennes avec tomates fraîches et mozzarella"
        duration = 15
        difficulty = "Facile"
        servings = 4
        recipeState = "saved"
        instructions = "1. Griller le pain de campagne`n2. Couper tomates et mozzarella`n3. Assaisonner avec basilic et huile d'olive`n4. Servir immédiatement"
        ingredients = "Pain de campagne, tomates cerises, mozzarella, basilic, huile d'olive, sel, poivre"
        rating = 4.1
        tags = @("italien", "végétarien", "rapide", "apéritif")
    },
    
    # Desserts
    @{
        title = "Tiramisu classique"
        description = "Le dessert italien par excellence avec café et mascarpone"
        duration = 45
        difficulty = "Intermédiaire"
        servings = 6
        recipeState = "saved"
        instructions = "1. Préparer le café fort et laisser refroidir`n2. Battre les jaunes avec le sucre`n3. Incorporer le mascarpone`n4. Monter les blancs en neige`n5. Alterner couches de biscuits et crème"
        ingredients = "Mascarpone (500g), œufs (6), sucre (100g), café fort, biscuits à la cuillère, cacao amer"
        rating = 4.8
        tags = @("dessert", "italien", "café", "crémeux")
    },
    @{
        title = "Tarte Tatin aux pommes"
        description = "Tarte renversée aux pommes caramélisées"
        duration = 90
        difficulty = "Intermédiaire"
        servings = 8
        recipeState = "saved"
        instructions = "1. Préparer la pâte brisée`n2. Caraméliser le sucre`n3. Disposer les pommes et la pâte`n4. Cuire 45 minutes au four`n5. Retourner délicatement"
        ingredients = "Pommes Golden, sucre, beurre, pâte brisée, vanille, cannelle"
        rating = 4.6
        tags = @("dessert", "français", "pommes", "caramel")
    },
    @{
        title = "Mousse au chocolat noir"
        description = "Mousse légère et onctueuse au chocolat noir 70%"
        duration = 30
        difficulty = "Facile"
        servings = 4
        recipeState = "saved"
        instructions = "1. Faire fondre le chocolat au bain-marie`n2. Séparer les blancs des jaunes`n3. Monter les blancs en neige`n4. Incorporer délicatement au chocolat`n5. Réfrigérer 2h minimum"
        ingredients = "Chocolat noir 70% (200g), œufs (4), sucre (50g), beurre (50g), vanille"
        rating = 4.7
        tags = @("dessert", "chocolat", "mousse", "classique")
    }
)

function Get-ExistingCategories {
    Write-Host "Fetching existing categories..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "$API_URL/recipie-categories" -Method Get
        Write-Host "✅ Found $($response.data.Count) categories" -ForegroundColor Green
        return $response.data
    }
    catch {
        Write-Host "❌ Error fetching categories: $($_.Exception.Message)" -ForegroundColor Red
        return @()
    }
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
            Write-Host "✅ Created recipe: $($recipe.title) (Category: $($categories[$categoryIndex].attributes.categoryName))" -ForegroundColor Green
        }
        catch {
            Write-Host "❌ Error creating recipe $($recipe.title): $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Main execution
try {
    # Get existing categories
    $existingCategories = Get-ExistingCategories
    
    if ($existingCategories.Count -eq 0) {
        Write-Host "❌ No categories found. Please create categories first." -ForegroundColor Red
        exit
    }
    
    Write-Host "Categories found:" -ForegroundColor Cyan
    foreach ($category in $existingCategories) {
        Write-Host "  - $($category.attributes.categoryName)" -ForegroundColor White
    }
    
    # Create recipes with category associations
    Create-Recipes $existingCategories
    
    Write-Host "🎉 Recipe creation completed!" -ForegroundColor Green
    Write-Host "📊 Created $($recipes.Count) recipes across $($existingCategories.Count) categories" -ForegroundColor Cyan
    
}
catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
} 