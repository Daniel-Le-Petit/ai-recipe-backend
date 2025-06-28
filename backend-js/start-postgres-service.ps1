# Script pour démarrer le service PostgreSQL
Write-Host "Démarrage du service PostgreSQL..." -ForegroundColor Green

# Vérifier si le service PostgreSQL existe
$serviceName = "postgresql-x64-17"
$service = Get-Service -Name $serviceName -ErrorAction SilentlyContinue

if ($service) {
    Write-Host "✅ Service PostgreSQL trouvé: $serviceName" -ForegroundColor Green
    
    # Vérifier le statut du service
    if ($service.Status -eq "Running") {
        Write-Host "✅ PostgreSQL est déjà démarré!" -ForegroundColor Green
    } else {
        Write-Host "🔄 Démarrage du service PostgreSQL..." -ForegroundColor Yellow
        Start-Service -Name $serviceName
        Start-Sleep -Seconds 3
        
        # Vérifier si le service a démarré
        $service = Get-Service -Name $serviceName
        if ($service.Status -eq "Running") {
            Write-Host "✅ PostgreSQL démarré avec succès!" -ForegroundColor Green
        } else {
            Write-Host "❌ Erreur lors du démarrage de PostgreSQL" -ForegroundColor Red
            exit 1
        }
    }
} else {
    Write-Host "❌ Service PostgreSQL non trouvé" -ForegroundColor Red
    Write-Host "Services PostgreSQL disponibles:" -ForegroundColor Yellow
    Get-Service | Where-Object {$_.Name -like "*postgres*"} | ForEach-Object {
        Write-Host "  - $($_.Name): $($_.Status)" -ForegroundColor Cyan
    }
    exit 1
}

# Tester la connexion
Write-Host "🧪 Test de connexion à PostgreSQL..." -ForegroundColor Yellow
try {
    $env:PGPASSWORD = ""
    & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -h localhost -c "SELECT version();" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Connexion PostgreSQL réussie!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erreur de connexion à PostgreSQL" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erreur lors du test de connexion: $_" -ForegroundColor Red
}

Write-Host "🚀 PostgreSQL est prêt à être utilisé!" -ForegroundColor Green 