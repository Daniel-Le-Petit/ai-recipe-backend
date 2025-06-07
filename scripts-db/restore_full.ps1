# Fichier: C:\Users\AIFinesHerbes\AIFB\scripts-db\restore_full.ps1

# Charge la configuration de la base de données
. "$PSScriptRoot\config.ps1"

# Vérifie que les variables sont définies
if (-not $env:DB_HOST -or -not $env:DB_USER -or -not $env:DB_NAME -or -not $env:PGPASSWORD) {
    Write-Host "Erreur: Les variables de connexion à la base de données ne sont pas définies. Vérifiez config.ps1."
    exit 1
}

$fullDumpFile = Read-Host "Entrez le chemin complet du fichier SQL de la sauvegarde complète (ex: C:\path\to\my_db_full_20240101_120000.sql)"

if (-not (Test-Path $fullDumpFile)) {
    Write-Host "Erreur: Le fichier '$fullDumpFile' n'existe pas."
    exit 1
}

Write-Host "Restauration complète de la base de données '$env:DB_NAME' sur '$env:DB_HOST' depuis '$fullDumpFile'..."
# N'oubliez pas que pour la restauration complète, vous devrez souvent recréer une base de données vide
# sur Render (et mettre à jour les variables d'environnement de connexion si l'URL change)
# avant d'exécuter ce script.
C:\"Program Files"\PostgreSQL\17\bin\psql.exe -h $env:DB_HOST -p $env:DB_PORT -U $env:DB_USER -d $env:DB_NAME -f $fullDumpFile



if ($LASTEXITCODE -eq 0) {
    Write-Host "Restauration complète terminée avec succès."
} else {
    Write-Host "Erreur lors de la restauration complète. Code d'erreur: $LASTEXITCODE"
}