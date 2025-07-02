# Script PowerShell pour démarrer le backend Strapi et le frontend Next.js

Write-Host "`n[START] Démarrage du backend Strapi et du frontend Next.js..." -ForegroundColor Green

# Variables globales pour les jobs
$backendJob = $null
$frontendJob = $null

# Fonction pour arrêter les processus proprement
function Stop-Services {
    Write-Host "`n[STOP] Arrêt des services..." -ForegroundColor Yellow

    if ($backendJob -and (Get-Job -Id $backendJob.Id -ErrorAction SilentlyContinue)) {
        Stop-Job -Job $backendJob -Force
        Remove-Job -Job $backendJob
        Write-Host "[INFO] Backend arrêté." -ForegroundColor Cyan
    }

    if ($frontendJob -and (Get-Job -Id $frontendJob.Id -ErrorAction SilentlyContinue)) {
        Stop-Job -Job $frontendJob -Force
        Remove-Job -Job $frontendJob
        Write-Host "[INFO] Frontend arrêté." -ForegroundColor Cyan
    }

    exit 0
}

# Capturer Ctrl+C pour arrêter les services proprement
$null = Register-EngineEvent -SourceIdentifier ConsoleCancelEvent `
    -Action { Stop-Services } `
    -SupportEvent

try {
    # Lancer le backend Strapi
    Write-Host "[INFO] Lancement du backend Strapi sur http://localhost:1338..." -ForegroundColor Cyan
    $backendJob = Start-Job -ScriptBlock {
        Set-Location "backend-js"
        npm run develop
    }

    # Attente pour laisser Strapi démarrer
    Start-Sleep -Seconds 5

    # Lancer le frontend Next.js
    Write-Host "[INFO] Lancement du frontend Next.js sur http://localhost:3000..." -ForegroundColor Cyan
    $frontendJob = Start-Job -ScriptBlock {
        Set-Location "frontend-m"
        npm run dev
    }

    Write-Host "`n[SERVICES LANCÉS]" -ForegroundColor Green
    Write-Host "   Backend  -> http://localhost:1338" -ForegroundColor White
    Write-Host "   Frontend -> http://localhost:3000" -ForegroundColor White
    Write-Host "   Admin    -> http://localhost:1338/admin" -ForegroundColor White
    Write-Host "`nAppuyez sur Ctrl+C pour arrêter les services." -ForegroundColor Yellow

    # Boucle pour afficher les logs
    while ($true) {
        Receive-Job -Job $backendJob -OutVariable backendOutput -ErrorAction SilentlyContinue | ForEach-Object {
            Write-Host "[BACKEND] $_" -ForegroundColor Blue
        }

        Receive-Job -Job $frontendJob -OutVariable frontendOutput -ErrorAction SilentlyContinue | ForEach-Object {
            Write-Host "[FRONTEND] $_" -ForegroundColor Magenta
        }

        Start-Sleep -Milliseconds 300
    }
}
catch {
    Write-Host "[ERREUR] Une erreur inattendue s'est produite : $_" -ForegroundColor Red
    Stop-Services
}
finally {
    Stop-Services
}
