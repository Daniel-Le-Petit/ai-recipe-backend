# Fichier: C:\Users\AIFinesHerbes\AIFB\scripts-db\restore_schema.ps1

# Charge la configuration de la base de données
. "$PSScriptRoot\config.ps1"

# Vérifie que les variables sont définies
if (-not $env:DB_HOST -or -not $env:DB_USER -or -not $env:DB_NAME -or -not $env:PGPASSWORD) {
    Write-Host "Erreur: Les variables de connexion à la base de données ne sont pas définies. Vérifiez config.ps1."
    exit 1
}

$schemaFile = Read-Host "Entrez le chemin complet du fichier SQL de la structure (ex: C:\path\to\my_db_schema_20240101_120000.sql)"

if (-not (Test-Path $schemaFile)) {
    Write-Host "Erreur: Le fichier '$schemaFile' n'existe pas."
    exit 1
}

Write-Host "Restauration de la structure de la base de données '$env:DB_NAME' sur '$env:DB_HOST' depuis '$schemaFile'..."
C:\"Program Files"\PostgreSQL\17\bin\psql.exe -h $env:DB_HOST -p $env:DB_PORT -U $env:DB_USER -d $env:DB_NAME -f $schemaFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "Restauration de la structure terminée avec succès."
} else {
    Write-Host "Erreur lors de la restauration de la structure. Code d'erreur: $LASTEXITCODE"
}