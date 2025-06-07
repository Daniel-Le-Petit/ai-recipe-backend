# Fichier: C:\Users\AIFinesHerbes\AIFB\scripts-db\config.ps1

# --- Variables de Connexion à la Base de Données ---
# IMPORTANT: Remplacez ces valeurs par les détails réels de votre base de données PostgreSQL sur Render.
# Vous les trouverez dans l' "Internal Database URL" (ou External pour accès externe) de votre DB Render.
# Exemple de format d'URL: postgresql://utilisateur:mot_de_passe@hote:port/base_de_donnees

$env:DB_HOST = "dpg-d11ivqs9c44c73fctus0-a.frankfurt-postgres.render.com"
$env:DB_PORT = "5432" # Généralement 5432 pour PostgreSQL
$env:DB_USER = "aifb"
$env:DB_NAME = "aifb"
$env:PGPASSWORD = "3hY10AHiJtmltVXRSQ3EKTJv0AC5bJQv" 
# --- Paramètres SSL pour la connexion PostgreSQL ---
# Render requiert SSL/TLS pour les connexions.
$env:PGSSLMODE = "require"

# Optional: Vous pouvez ajouter des messages ici pour le débogage si nécessaire
# Write-Host "Configuration de la base de données chargée."