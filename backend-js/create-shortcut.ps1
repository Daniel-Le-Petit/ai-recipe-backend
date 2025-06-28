# Script pour créer un raccourci de bureau pour le lancement automatique

$DesktopPath = [Environment]::GetFolderPath("Desktop")
$ShortcutPath = "$DesktopPath\Dev Environment.lnk"
$ScriptPath = "$PSScriptRoot\auto-start-dev.ps1"

Write-Host "📋 Création du raccourci de bureau..." -ForegroundColor Green

# Créer l'objet WScript.Shell
$WScriptShell = New-Object -ComObject WScript.Shell

# Créer le raccourci
$Shortcut = $WScriptShell.CreateShortcut($ShortcutPath)

# Configurer le raccourci
$Shortcut.TargetPath = "powershell.exe"
$Shortcut.Arguments = "-ExecutionPolicy Bypass -File `"$ScriptPath`""
$Shortcut.WorkingDirectory = $PSScriptRoot
$Shortcut.Description = "Lance l'environnement de développement avec disposition automatique des fenêtres"
$Shortcut.IconLocation = "C:\Windows\System32\SHELL32.dll,21"  # Icône de développement

# Sauvegarder le raccourci
$Shortcut.Save()

Write-Host "✅ Raccourci créé sur le bureau: $ShortcutPath" -ForegroundColor Green
Write-Host "🚀 Double-cliquez sur le raccourci pour lancer votre environnement de développement!" -ForegroundColor Cyan 