# 🍽️ Intégration Frontend Next.js + Backend Strapi

Ce guide explique comment connecter le frontend Next.js (`frontend-m`) avec le backend Strapi (`backend-js`) pour afficher les recettes depuis la base de données PostgreSQL.

## 📋 Prérequis

- Node.js 18+ installé
- PostgreSQL configuré et accessible
- Les deux projets (`backend-js` et `frontend-m`) clonés

## 🚀 Démarrage rapide

### Option 1: Script automatique (recommandé)

```bash
# Rendre le script exécutable
chmod +x start-both.sh

# Démarrer les deux services
./start-both.sh
```

### Option 2: Démarrage manuel

#### 1. Démarrer le backend Strapi

```bash
cd backend-js
npm install
npm run dev
```

Le backend sera accessible sur : http://localhost:1338
L'admin Strapi sera accessible sur : http://localhost:1338/admin

#### 2. Démarrer le frontend Next.js

```bash
cd frontend-m
npm install
npm run dev
```

Le frontend sera accessible sur : http://localhost:3000

## ⚙️ Configuration

### Variables d'environnement

#### Backend (backend-js)
Créez un fichier `.env` dans le dossier `backend-js` :

```env
HOST=0.0.0.0
PORT=1338
APP_KEYS=your-app-keys-here
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
JWT_SECRET=your-jwt-secret

# Base de données PostgreSQL
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=your-database-name
DATABASE_USERNAME=your-username
DATABASE_PASSWORD=your-password
DATABASE_SSL=false

# URL publique
PUBLIC_URL=http://localhost:1338
```

#### Frontend (frontend-m)
Créez un fichier `.env.local` dans le dossier `frontend-m` :

```env
# Configuration de l'API backend Strapi
NEXT_PUBLIC_API_URL=http://localhost:1338

# Configuration pour le développement
NEXT_PUBLIC_ENVIRONMENT=development
```

## 🔧 Configuration CORS

Le backend Strapi est configuré pour accepter les requêtes du frontend Next.js. La configuration se trouve dans `backend-js/config/middlewares.js` :

```javascript
{
  name: 'strapi::cors',
  config: {
    enabled: true,
    origin: [
      'http://localhost:3000',          // Frontend Next.js
      'http://localhost:5173',          // Autres frontends
      // ... autres URLs
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    headers: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
    credentials: true,
  },
}
```

## 📊 Structure des données

### Modèle de recette (Strapi)

Les recettes dans Strapi ont la structure suivante :

```json
{
  "id": 1,
  "attributes": {
    "title": "Nom de la recette",
    "description": "Description de la recette",
    "ingredients": [...],
    "instructions": "Instructions de préparation",
    "duration": 30,
    "difficulty": "Facile|Intermédiaire|Difficile",
    "servings": 4,
    "rating": 4.5,
    "tags": ["Végétarien", "Rapide"],
    "isRobotCompatible": true,
    "image": {
      "data": {
        "attributes": {
          "url": "/uploads/image.jpg"
        }
      }
    },
    "recipieCategory": {
      "data": {
        "id": 1,
        "attributes": {
          "name": "Plat principal",
          "description": "Description de la catégorie"
        }
      }
    }
  }
}
```

## 🔌 API Service

Le frontend utilise un service API (`frontend-m/src/api.js`) qui gère toutes les communications avec le backend :

### Fonctions disponibles

- `getRecipes(params)` - Récupérer toutes les recettes
- `getRecipeById(id)` - Récupérer une recette par ID
- `getCategories()` - Récupérer les catégories
- `getRecipesByCategory(categoryId)` - Recettes par catégorie
- `getRecipesByDifficulty(difficulty)` - Recettes par difficulté
- `getRobotCompatibleRecipes()` - Recettes compatibles robot
- `rateRecipe(id, rating)` - Noter une recette
- `createRecipe(recipeData)` - Créer une nouvelle recette

## 🎨 Interface utilisateur

### Page des recettes

La page `/recettes` affiche maintenant :

- ✅ **Données dynamiques** depuis la base de données PostgreSQL
- ✅ **Filtrage** par catégorie, difficulté et recherche
- ✅ **Tri** par popularité, temps, ordre alphabétique
- ✅ **Images** avec fallback automatique
- ✅ **États de chargement** et gestion d'erreurs
- ✅ **Responsive design** pour tous les écrans

### Fonctionnalités

- **Recherche en temps réel** dans les titres et descriptions
- **Filtres multiples** combinables
- **Affichage des métadonnées** (durée, portions, difficulté)
- **Badges** pour les recettes compatibles robot
- **Système de notation** avec étoiles
- **Tags** pour catégoriser les recettes

## 🐛 Dépannage

### Problèmes courants

#### 1. Erreur CORS
```
Access to fetch at 'http://localhost:1338/api/recipies' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution :** Vérifiez que l'URL `http://localhost:3000` est bien dans la liste des origines autorisées dans `backend-js/config/middlewares.js`

#### 2. Erreur de connexion à la base de données
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution :** Vérifiez que PostgreSQL est démarré et que les paramètres de connexion dans `.env` sont corrects

#### 3. Images qui ne s'affichent pas
```
Failed to load resource: the server responded with a 404
```

**Solution :** Vérifiez que les images sont bien uploadées dans Strapi et que l'URL de base est correcte

#### 4. Frontend ne se connecte pas au backend
```
Error fetching recipes: HTTP error! status: 404
```

**Solution :** Vérifiez que le backend Strapi est démarré sur le port 1338 et que l'URL dans `NEXT_PUBLIC_API_URL` est correcte

### Logs utiles

#### Backend Strapi
```bash
cd backend-js
npm run dev
# Les logs apparaissent dans la console
```

#### Frontend Next.js
```bash
cd frontend-m
npm run dev
# Les logs apparaissent dans la console et dans le navigateur (F12)
```

## 📝 Ajout de données de test

### Via l'interface admin Strapi

1. Accédez à http://localhost:1338/admin
2. Créez un compte admin si nécessaire
3. Allez dans "Content Manager" > "Recipie"
4. Cliquez sur "Create new entry"
5. Remplissez les champs et publiez

### Via l'API

```bash
# Exemple de création d'une recette via l'API
curl -X POST http://localhost:1338/api/recipies \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "Pasta Carbonara",
      "description": "Un classique italien",
      "difficulty": "Facile",
      "duration": 20,
      "servings": 2,
      "tags": ["Italien", "Rapide"]
    }
  }'
```

## 🔄 Mise à jour

Pour mettre à jour le système :

1. **Backend :**
   ```bash
   cd backend-js
   git pull
   npm install
   npm run build
   ```

2. **Frontend :**
   ```bash
   cd frontend-m
   git pull
   npm install
   npm run build
   ```

## 📞 Support

En cas de problème :

1. Vérifiez les logs dans les consoles
2. Vérifiez la configuration des variables d'environnement
3. Vérifiez que tous les services sont démarrés
4. Vérifiez la connectivité réseau entre les services

## 🎯 Prochaines étapes

- [ ] Ajouter l'authentification utilisateur
- [ ] Implémenter la création de recettes via l'interface
- [ ] Ajouter la fonctionnalité de favoris
- [ ] Implémenter la cuisson guidée
- [ ] Ajouter des tests automatisés 