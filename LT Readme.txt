#1 Assurez-vous que le tunnel 
lt --port 1338 --subdomain aifb-backend-dev

#2 frontend/.env.local
Option 1 : Tester  en local 
--------
VITE_APP_STRAPI_API_URL=https://aifb-backend-dev.loca.lt
# VITE_APP_STRAPI_API_URL=https://aifb-backend.onrender.com

Option 2 : Tester avec Render
--------
pas besoin de lancer votre backend Strapi local , ni de lancer localtunnel.
# VITE_APP_STRAPI_API_URL=https://aifb-backend-dev.loca.lt
VITE_APP_STRAPI_API_URL=https://aifb-backend.onrender.com


#3 frontend/src/App.jsx (ou votre fichier de requête API)const STRAPI_BACKEND_URL = import.meta.env.VITE_APP_STRAPI_API_URL;// ... puis utilisez STRAPI_BACKEND_URL dans vos requêtes fetch/axiosasync function generateRecipe() {
const response = await fetch(`${STRAPI_BACKEND_URL}/api/recipe-generator/generate`, {

#4 backend-js/.env
STRAPI_ADMIN_BACKEND_URL="https://aifb-backend-dev.loca.lt"

#5 middlewares.js
origin: ['http://localhost:1338', 'https://aifb-backend-dev.loca.lt'],

#6 backend 
npm run develop

#7 frontend 
npm run dev

#8 Ouvrez l'URL du tunnel : 
https://aifb-backend-dev.loca.lt/admin

#9 Ouvrez l'URL frontend local : 
http://localhost:5173/