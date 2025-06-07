# Fichier: C:\Users\AIFinesHerbes\AIFB\scripts-db\restore_data.ps1

# Charge la configuration de la base de données
. "$PSScriptRoot\config.ps1"

# Vérifie que les variables sont définies
if (-not $env:DB_HOST -or -not $env:DB_USER -or -not $env:DB_NAME -or -not $env:PGPASSWORD) {
    Write-Host "Erreur: Les variables de connexion à la base de données ne sont pas définies. Vérifiez config.ps1."
    exit 1
}

$dataFile = Read-Host "Entrez le chemin complet du fichier SQL des données (ex: C:\path\to\my_db_data_20240101_120000.sql)"

if (-not (Test-Path $dataFile)) {
    Write-Host "Erreur: Le fichier '$dataFile' n'existe pas."
    exit 1
}

Write-Host "Restauration des données de la base de données '$env:DB_NAME' sur '$env:DB_HOST' depuis '$dataFile'..."
C:\"Program Files"\PostgreSQL\17\bin\psql.exe -h $env:DB_HOST -p $env:DB_PORT -U $env:DB_USER -d $env:DB_NAME -f $dataFile


if ($LASTEXITCODE -eq 0) {
    Write-Host "Restauration des données terminée avec succès."
} else {
    Write-Host "Erreur lors de la restauration des données. Code d'erreur: $LASTEXITCODE"
}