const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Démarrage de l\'environnement de développement...\n');

// Fonction pour démarrer Strapi
function startStrapi() {
  console.log('📦 Démarrage de Strapi...');
  
  const strapiProcess = spawn('npm', ['run', 'strapi', 'develop'], {
    stdio: 'pipe',
    shell: true
  });

  strapiProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(output);
    
    // Détecter quand Strapi est prêt
    if (output.includes('Welcome back!') || output.includes('To manage your project 🚀')) {
      console.log('\n✅ Strapi est prêt!');
      console.log('🌐 Interface admin: http://localhost:1338/admin');
      console.log('🔗 API: http://localhost:1338/api');
      
      // Attendre un peu puis lancer les tests
      setTimeout(() => {
        runTests();
      }, 5000);
    }
  });

  strapiProcess.stderr.on('data', (data) => {
    console.error(`❌ Erreur Strapi: ${data}`);
  });

  strapiProcess.on('close', (code) => {
    console.log(`📦 Strapi s'est arrêté avec le code: ${code}`);
  });

  return strapiProcess;
}

// Fonction pour lancer les tests
function runTests() {
  console.log('\n🧪 Lancement des tests de l\'API...');
  
  const testProcess = spawn('node', ['test-api.js'], {
    stdio: 'inherit',
    shell: true
  });

  testProcess.on('close', (code) => {
    if (code === 0) {
      console.log('\n🎉 Tests terminés avec succès!');
    } else {
      console.log('\n❌ Tests échoués');
    }
  });
}

// Fonction pour afficher les informations utiles
function showInfo() {
  console.log('📋 Informations utiles:');
  console.log('├── Interface admin: http://localhost:1338/admin');
  console.log('├── API Documentation: http://localhost:1338/documentation');
  console.log('├── API Base URL: http://localhost:1338/api');
  console.log('├── Fichier de test: test-api.js');
  console.log('└── Documentation: API_DOCUMENTATION.md');
  console.log('\n🔧 Commandes utiles:');
  console.log('├── npm run strapi develop    # Démarrer Strapi');
  console.log('├── node test-api.js          # Lancer les tests');
  console.log('├── npm run build             # Build pour production');
  console.log('└── npm run start             # Démarrer en production');
  console.log('\n📚 Endpoints principaux:');
  console.log('├── GET    /api/recipies                    # Toutes les recettes');
  console.log('├── POST   /api/recipies                    # Créer une recette');
  console.log('├── GET    /api/recipie-categories          # Toutes les catégories');
  console.log('├── POST   /api/recipie-categories          # Créer une catégorie');
  console.log('├── GET    /api/recipies/category/:id       # Recettes par catégorie');
  console.log('├── GET    /api/recipies/difficulty/:level  # Recettes par difficulté');
  console.log('└── POST   /api/recipies/:id/rate           # Noter une recette');
  console.log('\n' + '='.repeat(60) + '\n');
}

// Afficher les informations
showInfo();

// Démarrer Strapi
const strapiProcess = startStrapi();

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt en cours...');
  strapiProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Arrêt en cours...');
  strapiProcess.kill('SIGTERM');
  process.exit(0); 