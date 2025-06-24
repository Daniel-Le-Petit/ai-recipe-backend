# Script PowerShell pour démarrer le backend Strapi et le frontend Next.js

Write-Host "🚀 Démarrage du backend Strapi et du frontend Next.js..." -ForegroundColor Green

# Fonction pour arrêter tous les processus
function Stop-Services {
    Write-Host "🛑 Arrêt des services..." -ForegroundColor Yellow
    if ($backendJob) { Stop-Job $backendJob; Remove-Job $backendJob }
    if ($frontendJob) { Stop-Job $frontendJob; Remove-Job $frontendJob }
    exit 0
}

# Capturer Ctrl+C
Register-EngineEvent PowerShell.Exiting -Action { Stop-Services }

try {
    # Démarrer le backend Strapi
    Write-Host "📡 Démarrage du backend Strapi sur http://localhost:1338..." -ForegroundColor Cyan
    $backendJob = Start-Job -ScriptBlock {
        Set-Location "backend-js"
        npm run dev
    }

    # Attendre un peu que le backend démarre
    Start-Sleep -Seconds 5

    # Démarrer le frontend Next.js
    Write-Host "🌐 Démarrage du frontend Next.js sur http://localhost:3000..." -ForegroundColor Cyan
    $frontendJob = Start-Job -ScriptBlock {
        Set-Location "frontend-m"
        npm run dev
    }

    Write-Host "✅ Services démarrés !" -ForegroundColor Green
    Write-Host "   - Backend: http://localhost:1338" -ForegroundColor White
    Write-Host "   - Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "   - Admin Strapi: http://localhost:1338/admin" -ForegroundColor White
    Write-Host ""
    Write-Host "Appuyez sur Ctrl+C pour arrêter tous les services" -ForegroundColor Yellow

    # Afficher les logs en temps réel
    while ($true) {
        $backendOutput = Receive-Job $backendJob -ErrorAction SilentlyContinue
        $frontendOutput = Receive-Job $frontendJob -ErrorAction SilentlyContinue
        
        if ($backendOutput) {
            Write-Host "[BACKEND] $backendOutput" -ForegroundColor Blue
        }
        if ($frontendOutput) {
            Write-Host "[FRONTEND] $frontendOutput" -ForegroundColor Magenta
        }
        
        Start-Sleep -Milliseconds 100
    }
}
catch {
    Write-Host "❌ Erreur: $_" -ForegroundColor Red
    Stop-Services
}
finally {
    Stop-Services
} 