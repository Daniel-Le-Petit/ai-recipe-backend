# Script pour organiser automatiquement les fenêtres de développement
# Disposition : frontend-js et frontend à gauche, WSL en bas à gauche, prompts à droite

# Fonction pour déplacer une fenêtre
function Move-Window {
    param(
        [string]$ProcessName,
        [int]$X,
        [int]$Y,
        [int]$Width,
        [int]$Height
    )
    
    $processes = Get-Process -Name $ProcessName -ErrorAction SilentlyContinue
    foreach ($process in $processes) {
        try {
            $hwnd = $process.MainWindowHandle
            if ($hwnd -ne [IntPtr]::Zero) {
                # Déplacer et redimensionner la fenêtre
                $rect = New-Object System.Drawing.Rectangle($X, $Y, $Width, $Height)
                [System.Windows.Forms.User32]::SetWindowPos($hwnd, 0, $rect.X, $rect.Y, $rect.Width, $rect.Height, 0x0040)
            }
        }
        catch {
            Write-Host "Erreur lors du déplacement de $ProcessName : $_"
        }
    }
}

# Fonction pour organiser les fenêtres
function Organize-Windows {
    # Obtenir la résolution de l'écran
    $screen = [System.Windows.Forms.Screen]::PrimaryScreen
    $screenWidth = $screen.Bounds.Width
    $screenHeight = $screen.Bounds.Height
    
    # Calculer les dimensions des zones
    $leftWidth = [int]($screenWidth * 0.6)  # 60% pour la gauche
    $rightWidth = $screenWidth - $leftWidth  # 40% pour la droite
    $topHeight = [int]($screenHeight * 0.7)  # 70% pour le haut
    $bottomHeight = $screenHeight - $topHeight  # 30% pour le bas
    
    Write-Host "Organisation des fenêtres..."
    Write-Host "Résolution: ${screenWidth}x${screenHeight}"
    Write-Host "Zone gauche: ${leftWidth}x${screenHeight}"
    Write-Host "Zone droite: ${rightWidth}x${screenHeight}"
    
    # Zone gauche (frontend-js et frontend)
    # Chercher les fenêtres VS Code ou éditeurs
    $codeProcesses = @("code", "cursor", "vscode")
    foreach ($proc in $codeProcesses) {
        Move-Window -ProcessName $proc -X 0 -Y 0 -Width $leftWidth -Height $topHeight
    }
    
    # Zone bas gauche (WSL)
    # Chercher les fenêtres de terminal
    $terminalProcesses = @("wsl", "ubuntu", "debian", "terminal", "powershell", "cmd")
    foreach ($proc in $terminalProcesses) {
        Move-Window -ProcessName $proc -X 0 -Y $topHeight -Width $leftWidth -Height $bottomHeight
    }
    
    # Zone droite (prompts/chat)
    # Chercher les fenêtres de navigateur ou applications de chat
    $browserProcesses = @("chrome", "firefox", "edge", "msedge")
    foreach ($proc in $browserProcesses) {
        Move-Window -ProcessName $proc -X $leftWidth -Y 0 -Width $rightWidth -Height $screenHeight
    }
    
    Write-Host "Organisation terminée!"
}

# Ajouter les types nécessaires pour les API Windows
Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
using System.Drawing;

public class User32 {
    [DllImport("user32.dll")]
    public static extern bool SetWindowPos(IntPtr hWnd, int hWndInsertAfter, int X, int Y, int cx, int cy, uint uFlags);
}
"@

# Exécuter l'organisation
Organize-Windows 