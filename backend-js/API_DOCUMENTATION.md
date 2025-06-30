# 📚 API Documentation - Recettes et Catégories

## 🏗️ **Structure des Tables**

### 📋 **Table `recipie`**
```json
{
  "title": "string (required, max 255)",
  "description": "text (optional)",
  "ingredients": "json (optional)",
  "instructions": "text (optional)",
  "duration": "integer (optional, min 1)",
  "difficulty": "enum (Facile|Intermédiaire|Difficile)",
  "servings": "integer (optional, min 1)",
  "image": "media (optional, images only)",
  "recipieCategory": "relation (manyToOne)",
  "isRobotCompatible": "boolean (default: false)",
  "tags": "json (optional)",
  "rating": "decimal (optional, 0-5)",
  "author": "relation (manyToOne to user)"
}
```

### 📂 **Table `recipie-category`**
```json
{
  "categoryName": "string (required, unique, max 100)",
  "categorySlug": "string (optional, unique, max 100)",
  "categoryDescription": "text (optional)",
  "categoryImage": "media (optional, multiple images)",
  "recipies": "relation (oneToMany)"
}
```

---

## 🛣️ **Endpoints API**

### 🍳 **Recettes (`/api/recipies`)**

#### **GET** `/api/recipies`
Récupère toutes les recettes avec leurs relations.

**Paramètres de requête :**
- `pagination[page]` : Numéro de page
- `pagination[pageSize]` : Taille de page
- `sort` : Tri (ex: `title:asc`, `rating:desc`)
- `filters` : Filtres (ex: `difficulty:Facile`)

**Réponse :**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Pasta Carbonara",
        "description": "Classic Italian pasta dish",
        "rating": 4.5,
        "difficulty": "Intermédiaire",
        "recipieCategory": {
          "data": {
            "id": 1,
            "attributes": {
              "categoryName": "Pâtes"
            }
          }
        },
        "author": {
          "data": {
            "id": 1,
            "attributes": {
              "username": "chef123"
            }
          }
        }
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

#### **GET** `/api/recipies/:id`
Récupère une recette spécifique par ID.

#### **POST** `/api/recipies`
Crée une nouvelle recette.

**Body :**
```json
{
  "data": {
    "title": "Nouvelle Recette",
    "description": "Description de la recette",
    "ingredients": [
      {
        "name": "Ingrédient 1",
        "quantity": 100,
        "unit": "g"
      }
    ],
    "instructions": "Instructions de préparation",
    "duration": 30,
    "difficulty": "Facile",
    "servings": 4,
    "recipieCategory": 1,
    "isRobotCompatible": true,
    "tags": ["végétarien", "rapide"]
  }
}
```

#### **PUT** `/api/recipies/:id`
Met à jour une recette existante.

#### **DELETE** `/api/recipies/:id`
Supprime une recette.

---

### 🔍 **Recherches Spécialisées**

#### **GET** `/api/recipies/category/:categoryId`
Récupère toutes les recettes d'une catégorie spécifique.

#### **GET** `/api/recipies/difficulty/:difficulty`
Récupère les recettes par niveau de difficulté (Facile, Intermédiaire, Difficile).

#### **GET** `/api/recipies/robot-compatible`
Récupère toutes les recettes compatibles avec les robots de cuisine.

#### **POST** `/api/recipies/:id/rate`
Note une recette (0-5 étoiles).

**Body :**
```json
{
  "rating": 4.5
}
```

### ⭐ **Noter une recette**
```bash
curl -X POST "http://localhost:1338/api/recipies/1/rate" \
  -H "Content-Type: application/json" \
  -d '{"rating": 4.5}'
```

---

### 📂 **Catégories (`/api/recipie-categories`)**

#### **GET** `/api/recipie-categories`
Récupère toutes les catégories avec leurs recettes.

#### **GET** `/api/recipie-categories/:id`
Récupère une catégorie spécifique par ID.

#### **POST** `/api/recipie-categories`
Crée une nouvelle catégorie.

**Body :**
```json
{
  "data": {
    "categoryName": "Nouvelle Catégorie",
    "categoryDescription": "Description de la catégorie"
  }
}
```

#### **PUT** `/api/recipie-categories/:id`
Met à jour une catégorie existante.

#### **DELETE** `/api/recipie-categories/:id`
Supprime une catégorie.

---

### 🔍 **Recherches de Catégories**

#### **GET** `/api/recipie-categories/slug/:slug`
Récupère une catégorie par son slug.

#### **GET** `/api/recipie-categories/:id/stats`
Récupère les statistiques d'une catégorie.

**Réponse :**
```json
{
  "data": {
    "id": 1,
    "categoryName": "Pâtes",
    "stats": {
      "totalRecipes": 15,
      "averageRating": 4.2,
      "difficultyDistribution": {
        "Facile": 8,
        "Intermédiaire": 5,
        "Difficile": 2
      },
      "averageDuration": 25
    }
  }
}
```

#### **GET** `/api/recipie-categories/stats/all`
Récupère les statistiques de toutes les catégories.

---

## 🔧 **Services Disponibles**

### 🍳 **Services Recettes**
- `calculateAverageRating(recipeId)` : Calcule la note moyenne
- `validateIngredients(ingredients)` : Valide le format des ingrédients
- `validateInstructions(instructions)` : Valide le format des instructions
- `findSimilarRecipes(recipeId, limit)` : Trouve des recettes similaires
- `getPopularRecipes(limit)` : Récupère les recettes populaires
- `getRecentRecipes(limit)` : Récupère les recettes récentes
- `searchByTags(tags, limit)` : Recherche par tags
- `getRecipeStats()` : Statistiques globales des recettes

### 📂 **Services Catégories**
- `generateUniqueSlug(name)` : Génère un slug unique
- `validateCategoryName(name)` : Valide le nom de catégorie
- `getCategoriesWithRecipeCount()` : Catégories avec nombre de recettes
- `getPopularCategories(limit)` : Catégories populaires
- `searchCategories(searchTerm, limit)` : Recherche de catégories
- `getGlobalCategoryStats()` : Statistiques globales des catégories

---

## 📊 **Exemples d'Utilisation**

### 🔍 **Recherche de recettes par difficulté**
```bash
curl -X GET "http://localhost:1338/api/recipies/difficulty/Facile"
```

### 📈 **Obtenir les statistiques d'une catégorie**
```bash
curl -X GET "http://localhost:1338/api/recipie-categories/1/stats"
```

### 🍝 **Créer une nouvelle recette**
```bash
curl -X POST "http://localhost:1338/api/recipies" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "Spaghetti Carbonara",
      "description": "Classic Italian pasta with eggs and cheese",
      "ingredients": [
        {"name": "Spaghetti", "quantity": 400, "unit": "g"},
        {"name": "Oeufs", "quantity": 4, "unit": "unités"},
        {"name": "Parmesan", "quantity": 100, "unit": "g"}
      ],
      "instructions": "1. Cuire les pâtes\n2. Mélanger avec les oeufs\n3. Ajouter le parmesan",
      "duration": 20,
      "difficulty": "Facile",
      "servings": 4,
      "recipieCategory": 1,
      "isRobotCompatible": true,
      "tags": ["italien", "rapide", "végétarien"]
    }
  }'
```

---

## 🚀 **Prochaines Étapes**

1. **Tester les endpoints** avec Postman ou curl
2. **Créer des données de test** pour valider les fonctionnalités
3. **Implémenter l'authentification** pour les opérations sensibles
4. **Ajouter des validations** côté client
5. **Optimiser les performances** avec la pagination et les index

---

## 📝 **Notes Importantes**

- Toutes les dates sont au format ISO 8601
- Les images doivent être uploadées via l'API Media de Strapi
- Les relations sont automatiquement populées selon les endpoints
- La pagination est activée par défaut (25 éléments par page)
- Les filtres supportent les opérateurs Strapi ($eq, $gt, $lt, $containsi, etc.)