# start-all.ps1
# Script PowerShell pour ouvrir les fichiers clés dans Notepad++ et lancer les serveurs Strapi, Express, et Vite

# Détecte le dossier racine du projet (AIFB)
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition

# 1) Ouvrir dans Notepad++ les fichiers importants
#    - Config Strapi
Start-Process "notepad++" -ArgumentList "`"$projectRoot\backend\config\server.js`""
#    - Fichier de routage Strapi (si utilisé)
Start-Process "notepad++" -ArgumentList "`"$projectRoot\backend\config\database.js`""
#    - Config Vite
Start-Process "notepad++" -ArgumentList "`"$projectRoot\frontend\vite.config.js`""
#    - Composant React du formulaire
Start-Process "notepad++" -ArgumentList "`"$projectRoot\frontend\src\components\RecetteForm.jsx`""
#    - Fichier .env (frontend)
Start-Process "notepad++" -ArgumentList "`"$projectRoot\frontend\.env`""
#    - Fichier .env (backend)
Start-Process "notepad++" -ArgumentList "`"$projectRoot\backend\.env`""  

# 2) Lancer Strapi (backend)
Start-Process powershell -ArgumentList "-NoExit","-Command","cd `"$projectRoot\backend`"; npm run develop"

# 3) Lancer le serveur Express ChatGPT (backend)
Set-Location -Path "C:\Users\AIFinesHerbes\AIFB\backend"

# Installer les dépendances (cors, express, etc.) si pas déjà installées
Write-Host "Installation des dépendances..."
npm install

# Lancer le serveur Node.js
Write-Host "Démarrage du serveur backend..."
node server.js

# 4) Lancer Vite (frontend)
Start-Process powershell -ArgumentList "-NoExit","-Command","cd `"$projectRoot\frontend`"; npm run dev"
