#1 frontend/.env.local
# desactiver LT
# VITE_APP_STRAPI_API_URL=https://aifb-backend-dev.loca.lt
VITE_APP_STRAPI_API_URL=https://aifb-backend.onrender.com

#2 frontend/src/App.jsx (ou votre fichier de requête API)
const STRAPI_BACKEND_URL = import.meta.env.VITE_APP_STRAPI_API_URL;
async function generateRecipe() {
  const response = await fetch(`${STRAPI_BACKEND_URL}/api/generate-recipe`, {

npm run dev

http://localhost:5173/
Remplissez le champ "Ingrédients" et cliquez sur "Générer la Recette !".
Si cette configuration est correcte, votre frontend local va envoyer la requête à https://aifb-backend.onrender.com, et vous devriez voir la recette mockée s'afficher.