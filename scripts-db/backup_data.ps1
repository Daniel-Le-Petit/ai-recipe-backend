# Fichier: C:\Users\AIFinesHerbes\AIFB\scripts-db\backup_data.ps1

# Charge la configuration de la base de données
. "$PSScriptRoot\config.ps1"

# Vérifie que les variables sont définies
if (-not $env:DB_HOST -or -not $env:DB_USER -or -not $env:DB_NAME -or -not $env:PGPASSWORD) {
    Write-Host "Erreur: Les variables de connexion à la base de données ne sont pas définies. Vérifiez config.ps1."
    exit 1
}

Write-Host "Sauvegarde des données de la base de données '$env:DB_NAME' sur '$env:DB_HOST'..."
C:\"Program Files"\PostgreSQL\17\bin\pg_dump.exe -h $env:DB_HOST -p $env:DB_PORT -U $env:DB_USER -a -F p -f "$($env:DB_NAME)_data_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql" $env:DB_NAME

if ($LASTEXITCODE -eq 0) {
    Write-Host "Sauvegarde des données terminée avec succès."
} else {
    Write-Host "Erreur lors de la sauvegarde des données. Code d'erreur: $LASTEXITCODE"
}