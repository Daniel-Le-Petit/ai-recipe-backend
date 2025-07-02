# Script pour tester la connexion a la base de donnees PostgreSQL
Write-Host "Test de connexion a la base de donnees PostgreSQL..." -ForegroundColor Green

# Variables d'environnement pour la base aifinesherbes
$env:DATABASE_CLIENT = "postgres"
$env:DATABASE_HOST = "localhost"
$env:DATABASE_PORT = "5432"
$env:DATABASE_NAME = "aifinesherbes"
$env:DATABASE_USERNAME = "postgres"
$env:DATABASE_PASSWORD = "AliceNinon2025!"

Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  Host: $env:DATABASE_HOST" -ForegroundColor White
Write-Host "  Port: $env:DATABASE_PORT" -ForegroundColor White
Write-Host "  Database: $env:DATABASE_NAME" -ForegroundColor White
Write-Host "  User: $env:DATABASE_USERNAME" -ForegroundColor White

# Test 1: Verifier si PostgreSQL repond
Write-Host "`nTest 1: Verification du port PostgreSQL..." -ForegroundColor Cyan
try {
    $connection = New-Object System.Net.Sockets.TcpClient
    $connection.Connect("localhost", 5432)
    if ($connection.Connected) {
        Write-Host "OK - PostgreSQL repond sur le port 5432" -ForegroundColor Green
        $connection.Close()
    }
} catch {
    Write-Host "ERREUR - PostgreSQL ne repond pas sur le port 5432" -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Verifier si psql est disponible
Write-Host "`nTest 2: Verification de psql..." -ForegroundColor Cyan
try {
    $pgVersion = & psql --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK - psql disponible: $pgVersion" -ForegroundColor Green
    } else {
        Write-Host "ATTENTION - psql non trouve, mais on continue..." -ForegroundColor Yellow
    }
} catch {
    Write-Host "ATTENTION - psql non trouve, mais on continue..." -ForegroundColor Yellow
}

# Test 3: Tester la connexion avec les credentials
Write-Host "`nTest 3: Test de connexion avec les credentials..." -ForegroundColor Cyan

# Trouver le chemin de psql
$psqlPaths = Get-ChildItem -Path "C:\Program Files\PostgreSQL\*\bin\psql.exe" -ErrorAction SilentlyContinue
if ($psqlPaths) {
    $psqlPath = $psqlPaths[0].FullName
    Write-Host "  Utilisation de psql: $psqlPath" -ForegroundColor White
    
    try {
        $testQuery = "SELECT COUNT(*) as count FROM recipies;"
        $result = & $psqlPath -h localhost -p 5432 -U postgres -d aifinesherbes -c $testQuery 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "OK - Connexion reussie a la base aifinesherbes" -ForegroundColor Green
            Write-Host "   Resultat: $result" -ForegroundColor White
        } else {
            Write-Host "ERREUR - Echec de connexion a la base aifinesherbes" -ForegroundColor Red
            Write-Host "   Erreur: $result" -ForegroundColor Red
        }
    } catch {
        Write-Host "ERREUR - Erreur lors du test de connexion" -ForegroundColor Red
        Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "ERREUR - psql non trouve dans C:\Program Files\PostgreSQL" -ForegroundColor Red
}

# Test 4: Verifier les tables
Write-Host "`nTest 4: Verification des tables..." -ForegroundColor Cyan
if ($psqlPaths) {
    try {
        $tablesQuery = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%recipie%';"
        $tables = & $psqlPath -h localhost -p 5432 -U postgres -d aifinesherbes -c $tablesQuery 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "OK - Tables trouvees:" -ForegroundColor Green
            Write-Host "$tables" -ForegroundColor White
        } else {
            Write-Host "ERREUR - Erreur lors de la verification des tables" -ForegroundColor Red
            Write-Host "   Erreur: $tables" -ForegroundColor Red
        }
    } catch {
        Write-Host "ERREUR - Erreur lors de la verification des tables" -ForegroundColor Red
    }
} else {
    Write-Host "ERREUR - Impossible de verifier les tables (psql non trouve)" -ForegroundColor Red
}

Write-Host "`nDiagnostic termine!" -ForegroundColor Green
Write-Host "Si tous les tests passent, le probleme vient de Strapi." -ForegroundColor Yellow
Write-Host "Si un test echoue, il faut corriger la configuration." -ForegroundColor Yellow 