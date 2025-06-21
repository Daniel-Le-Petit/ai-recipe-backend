# 🍳 API de Recettes - Backend Strapi

Une API complète pour gérer des recettes de cuisine avec catégorisation, notation et compatibilité robot de cuisine.

## 🚀 **Démarrage Rapide**

### Prérequis
- Node.js (v16 ou supérieur)
- npm ou yarn
- Base de données (SQLite par défaut)

### Installation
```bash
# Cloner le projet
git clone <repository-url>
cd backend-js

# Installer les dépendances
npm install

# Démarrer en mode développement
npm run develop
```

### Démarrage Automatique avec Tests
```bash
# Démarrer Strapi et lancer les tests automatiquement
node start-dev.js
```

## 📋 **Fonctionnalités**

### 🍳 **Gestion des Recettes**
- ✅ Création, lecture, mise à jour, suppression (CRUD)
- ✅ Catégorisation automatique
- ✅ Système de notation (0-5 étoiles)
- ✅ Gestion des ingrédients (JSON structuré)
- ✅ Instructions de préparation
- ✅ Durée et difficulté
- ✅ Compatibilité robot de cuisine
- ✅ Tags et métadonnées
- ✅ Images de recettes
- ✅ Attribution d'auteur

### 📂 **Gestion des Catégories**
- ✅ Création et gestion de catégories
- ✅ Slugs automatiques pour URLs
- ✅ Images de catégories
- ✅ Statistiques par catégorie
- ✅ Relations avec les recettes

### 🔍 **Recherche et Filtrage**
- ✅ Recherche par catégorie
- ✅ Filtrage par difficulté
- ✅ Recettes compatibles robot
- ✅ Recherche par tags
- ✅ Tri par popularité/date

### 📊 **Statistiques et Analytics**
- ✅ Statistiques par catégorie
- ✅ Notes moyennes
- ✅ Distribution des difficultés
- ✅ Durées moyennes
- ✅ Recettes populaires

## 🛣️ **Endpoints API**

### 🍳 **Recettes**
```
GET    /api/recipies                    # Toutes les recettes
GET    /api/recipies/:id                # Recette par ID
POST   /api/recipies                    # Créer une recette
PUT    /api/recipies/:id                # Mettre à jour
DELETE /api/recipies/:id                # Supprimer

# Recherches spécialisées
GET    /api/recipies/category/:id       # Par catégorie
GET    /api/recipies/difficulty/:level  # Par difficulté
GET    /api/recipies/robot-compatible   # Compatibles robot
POST   /api/recipies/:id/rate           # Noter une recette
```

### 📂 **Catégories**
```
GET    /api/recipie-categories          # Toutes les catégories
GET    /api/recipie-categories/:id      # Catégorie par ID
POST   /api/recipie-categories          # Créer une catégorie
PUT    /api/recipie-categories/:id      # Mettre à jour
DELETE /api/recipie-categories/:id      # Supprimer

# Recherches spécialisées
GET    /api/recipie-categories/slug/:slug    # Par slug
GET    /api/recipie-categories/:id/stats     # Statistiques
GET    /api/recipie-categories/stats/all     # Toutes les stats
```

## 🧪 **Tests**

### Lancer les Tests
```bash
# Tests complets de l'API
node test-api.js

# Tests avec Strapi automatique
node start-dev.js
```

### Tests Inclus
- ✅ Création et récupération de catégories
- ✅ Création et récupération de recettes
- ✅ Recherches spécialisées
- ✅ Système de notation
- ✅ Validation des données
- ✅ Relations entre entités

## 📚 **Documentation Complète**

Consultez le fichier `API_DOCUMENTATION.md` pour une documentation détaillée de l'API avec exemples d'utilisation.

## 🏗️ **Structure du Projet**

```
backend-js/
├── src/
│   ├── api/
│   │   ├── recipie/                    # API Recettes
│   │   │   ├── controllers/            # Contrôleurs personnalisés
│   │   │   ├── routes/                 # Routes API
│   │   │   ├── services/               # Services métier
│   │   │   └── content-types/          # Schémas de données
│   │   └── recipie-category/           # API Catégories
│   │       ├── controllers/
│   │       ├── routes/
│   │       ├── services/
│   │       └── content-types/
│   └── extensions/                     # Extensions Strapi
├── test-api.js                         # Script de tests
├── start-dev.js                        # Démarrage automatique
├── API_DOCUMENTATION.md                # Documentation API
└── README.md                           # Ce fichier
```

## 🔧 **Configuration**

### Variables d'Environnement
```bash
# .env
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
JWT_SECRET=your-jwt-secret
ADMIN_JWT_SECRET=your-admin-jwt-secret
```

### Base de Données
- **Développement** : SQLite (par défaut)
- **Production** : PostgreSQL, MySQL, ou autre

## 🚀 **Déploiement**

### Build pour Production
```bash
npm run build
npm run start
```

### Déploiement Strapi Cloud
```bash
npm run strapi deploy
```

## 📊 **Exemple d'Utilisation**

### Créer une Recette
```bash
curl -X POST "http://localhost:1337/api/recipies" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "Spaghetti Carbonara",
      "description": "Classic Italian pasta",
      "ingredients": [
        {"name": "Spaghetti", "quantity": 400, "unit": "g"},
        {"name": "Oeufs", "quantity": 4, "unit": "unités"}
      ],
      "instructions": "1. Cuire les pâtes\n2. Mélanger avec les oeufs",
      "duration": 20,
      "difficulty": "Facile",
      "servings": 4,
      "recipieCategory": 1,
      "isRobotCompatible": true,
      "tags": ["italien", "rapide"]
    }
  }'
```

### Noter une Recette
```bash
curl -X POST "http://localhost:1337/api/recipies/1/rate" \
  -H "Content-Type: application/json" \
  -d '{"rating": 4.5}'
```

## 🤝 **Contribution**

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 **Licence**

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 **Support**

- 📧 Email : support@example.com
- 💬 Discord : [Serveur Discord](https://discord.gg/example)
- 📖 Documentation : [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

---

<div align="center">
  <p>Fait avec ❤️ pour la communauté culinaire</p>
  <p>🍳 Bon appétit ! 🍳</p>
</div>
