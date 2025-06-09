Localtunnel 
-----------
lt --port 1338
donne un nelle adresse local tunnel
derniere adresse Localtunnel https://aifb-backend-dev.loca.lt
pour exposer votre backend (qui tourne sur le port 1338)
lt --port 1338 --subdomain aifb-backend-dev
si 'adrees n est plus valide
aller à l'adresse suivante : https://loca.lt/mytunnelpassword
et http://localhost:1338/admin s'affiche

Nelle adress Local tunnel a changer dans si lt --port 1338 est relancé
frontend/src/App.jsx
config/middlewares.js
config/server.js

GitHub
-------
Local :
------
C:\Users\AIFinesHerbes\AIFB\backend-js  ← ai-recipe-backend (Git repo avec remote ai-recipe-backend)
C:\Users\AIFinesHerbes\AIFB\frontend    ← ai-recipe-frontend (Git repo avec remote ai-recipe-frontend)
GitHub :

https://github.com/Daniel-Le-Petit/ai-recipe-backend
https://github.com/Daniel-Le-Petit/ai-recipe-frontend

Your database will expire on July 9, 2025. The database will be deleted unless you upgrade to a paid instance type.
dans database.js
---------------
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'strapi'),
      user: env('DATABASE_USERNAME', 'strapi'),
      password: env('DATABASE_PASSWORD', 'strapi'),
      ssl: env.bool('DATABASE_SSL', false),

dans .env
----------
	# --- Configuration de la base de données PostgreSQL locale ---
	DATABASE_CLIENT=pg
	DATABASE_HOST=localhost            # Ou l'adresse IP de votre serveur PostgreSQL local (ex: 127.0.0.1)
	DATABASE_PORT=5432                 # Le port par défaut de PostgreSQL
	DATABASE_NAME=aifinesherbes        # Le nom de votre base de données PostgreSQL locale
	DATABASE_USERNAME=postgres         # Votre nom d'utilisateur PostgreSQL
	DATABASE_PASSWORD=AliceNinon2025!  # Votre mot de passe PostgreSQL
	DATABASE_SSL=false                 # Généralement 'false' pour une connexion PostgreSQL locale sans SSL
	DATABASE_SSL_REJECT_UNAUTHORIZED=false # Souvent 'false' en local même si SSL est activé, pour accepter les certificats auto-signés

Render
------
	Hostname	dpg-d13af43uibrs7380cfl0-a
	Port		5432
	Database 	aifb_a2h0
	Username	aifb
	Password	YD73qk3D1tRwEwNGcn6L3hXyEHxex00a

// avant
	https://dashboard.render.com/d/dpg-d11ivqs9c44c73fctus0-a
	dlepetit@hotmail.fr
	Oriane64?!
	$env:DB_HOST = "dpg-d11ivqs9c44c73fctus0-a.frankfurt-postgres.render.com"
	$env:DB_PORT = "5432" # Généralement 5432 pour PostgreSQL
	$env:DB_USER = "aifb"
	$env:DB_NAME = "aifb"
	// pas besoin d'avoir PGPASSWORD dans les variables d'environnement de Render pour Strapi
	$env:PGPASSWORD = postgresql://aifb:3hY10AHiJtmltVXRSQ3EKTJv0AC5bJQv@dpg-d11ivqs9c44c73fctus0-a/aifb
	Internal Database URL = postgresql://aifb:3hY10AHiJtmltVXRSQ3EKTJv0AC5bJQv@dpg-d11ivqs9c44c73fctus0-a/aifb
	External Database URL = postgresql://aifb:3hY10AHiJtmltVXRSQ3EKTJv0AC5bJQv@dpg-d11ivqs9c44c73fctus0-a.frankfurt-postgres.render.com/aifb	
	PSQL Command = PGPASSWORD=3hY10AHiJtmltVXRSQ3EKTJv0AC5bJQv psql -h dpg-d11ivqs9c44c73fctus0-a.frankfurt-postgres.render.com -U aifb aifb
//

npm:  signifie Node package manager
---
npm install : Installe  les dépendances
npm install [nom_du_paquet] : Installe un paquet spécifique et l'ajoute à votre package.json
npm run dev : Démarre le serveur de développement pour votre frontend React (Vite).
npm run develop : Démarre votre backend Strapi en mode développement.
npm run build : Construit votre application pour la production (frontend Vite ou admin de Strapi).
npm run start / npm start : Démarre votre backend Strapi en mode production.
npm cache clean --force : Vide le cache de npm



Keys
----
	APP_KEYS=d7domdx1z557sefvm4z4w0llwsp48nk1
	API_TOKEN_SALT=l6wo9j3soup0q1ssmm24hlquoikiq4of
	ADMIN_JWT_SECRET=yr3mltpcc6lhl35ir1m97v1nnglaw78r
	STRAPI_API_TOKEN=fd3da1879ebc2df2a6a23a4ae4723d2f2b6677d0dac1ea3bb4f2d9f803edc6f93427d1017c6fcccae3ca58826fc082ea7714240be89cb48f0225cfdc03e8db3560af62d29518fa568109863ed64627c94304e5d1318f054171ec245e7ddc07800216150a1c1e35e0777b229239a274200e94e9b7a73c4acfe9f4652597fd3f4a
	REACT_APP_STRAPI_API_TOKEN=fd3da1879ebc2df2a6a23a4ae4723d2f2b6677d0dac1ea3bb4f2d9f803edc6f93427d1017c6fcccae3ca58826fc082ea7714240be89cb48f0225cfdc03e8db3560af62d29518fa568109863ed64627c94304e5d1318f054171ec245e7ddc07800216150a1c1e35e0777b229239a274200e94e9b7a73c4acfe9f4652597fd3f4a
	REACT_APP_STRAPI_API_URL=http://localhost:1337/api


Provess bloquant
----------------
 C:\Users\AIFinesHerbes\AIFB\backend-js> netstat -aon | findstr :1337
 le killer --> Ctrl + Shift + esc
 
Compte email pour strapi/admin
-------------------------------------------
	http://localhost:1338/admin/
	dlepetit@hotmail.fr
	Oriane64?!

PLSQL
-----	
	cd "C:\Program Files\PostgreSQL\17\bin"
	.\psql -U postgres -d aifinesherbes
	Mot de passe db : AliceNinon2025!
	

Delete / remove on windows powershell pour relancer le frontend
-------------------------------------
	Remove-Item -Path "node_modules" -Recurse -Force
	Remove-Item -Path ".cache" -Recurse -Force
	Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue # -ErrorAction SilentlyContinue prevents error if file doesn't exist
	Remove-Item -Path "yarn.lock" -Force -ErrorAction SilentlyContinue # -ErrorAction SilentlyContinue prevents error if file doesn't exist
	npm cache clean --force
	npm install

tester Recette frontend
-------------------------
PS C:\Users\AIFinesHerbes\AIFB\frontend> Invoke-RestMethod -Uri "http://localhost:1338/api/recipies" `
>>   -Headers @{ Authorization = "Bearer fd3da1879ebc2df2a6a23a4ae4723d2f2b6677d0dac1ea3bb4f2d9f803edc6f93427d1017c6fcccae3ca58826fc082ea7714240be89cb48f0225cfdc03e8db3560af62d29518fa568109863ed64627c94304e5d1318f054171ec245e7ddc07800216150a1c1e35e0777b229239a274200e94e9b7a73c4acfe9f4652597fd3f4a" }
{@{id=2; documentId=nthukqj74xvwhk91pyde0yg5; title=Tomato Basil Pasta; description=System.Object[]; ingredients=; p...

