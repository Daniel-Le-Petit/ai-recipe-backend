# Fichier: C:\Users\AIFinesHerbes\AIFB\scripts-db\display_db_config.ps1

Write-Host "--- Chargement et Affichage de la Configuration de la Base de Données ---"

# Charge la configuration de la base de données
# Assurez-vous que config.ps1 est bien dans le même dossier
. "$PSScriptRoot\config.ps1"

# Vérifie que les variables sont définies (même vérification que dans les scripts de backup/restore)
if (-not $env:DB_HOST -or -not $env:DB_USER -or -not $env:DB_NAME -or -not $env:PGPASSWORD) {
    Write-Host "ATTENTION: Certaines variables de connexion à la base de données ne sont pas définies dans config.ps1." -ForegroundColor Yellow
    # N'exit pas pour quand même afficher ce qui est défini
}

Write-Host "`nInformations de Connexion lues depuis config.ps1 :"
Write-Host "-------------------------------------------"
Write-Host "Hôte (DB_HOST)     : $($env:DB_HOST)"
Write-Host "Port (DB_PORT)     : $($env:DB_PORT)"
Write-Host "Utilisateur (DB_USER): $($env:DB_USER)"
Write-Host "Nom DB (DB_NAME)   : $($env:DB_NAME)"
Write-Host "Mot de passe (PGPASSWORD) : $($env:PGPASSWORD.Substring(0, 3))********" # Affiche les 3 premiers chars, puis masqué pour la sécurité

Write-Host "`n-------------------------------------------"
Write-Host "Si ces informations ne sont pas correctes, veuillez modifier config.ps1."