# Script pour configurer Windows Terminal avec une disposition optimisée

Write-Host "⚙️ Configuration de Windows Terminal..." -ForegroundColor Green

# Chemin vers le fichier de configuration de Windows Terminal
$TerminalConfigPath = "$env:LOCALAPPDATA\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\LocalState\settings.json"

# Configuration par défaut si le fichier n'existe pas
$DefaultConfig = @{
    "$schema" = "https://aka.ms/terminal-profiles-schema"
    defaultProfile = "{61c54bbd-c2c6-5271-96e7-009a87ff44bf}"
    profiles = @{
        list = @(
            @{
                guid = "{61c54bbd-c2c6-5271-96e7-009a87ff44bf}"
                name = "WSL - Backend"
                source = "Windows.Terminal.Wsl"
                startingDirectory = "C:\Users\AIFinesHerbes\AIFB\backend-js"
                colorScheme = "Campbell"
                fontSize = 12
            },
            @{
                guid = "{b453ae62-4e3d-5e58-b979-0dde5d0c9b4a}"
                name = "WSL - Frontend"
                source = "Windows.Terminal.Wsl"
                startingDirectory = "C:\Users\AIFinesHerbes\AIFB\frontend-m"
                colorScheme = "Campbell"
                fontSize = 12
            },
            @{
                guid = "{0caa0dad-35be-5f56-a8ff-afceeeaa6101}"
                name = "PowerShell"
                source = "Windows.Terminal.PowershellCore"
                colorScheme = "Campbell"
                fontSize = 12
            }
        )
    }
    schemes = @(
        @{
            name = "Campbell"
            background = "#0c0c0c"
            black = "#0c0c0c"
            blue = "#0037da"
            brightBlack = "#767676"
            brightBlue = "#3b78ff"
            brightCyan = "#61d6d6"
            brightGreen = "#16c60c"
            brightPurple = "#b4009e"
            brightRed = "#e74856"
            brightWhite = "#f2f2f2"
            brightYellow = "#f9f1a5"
            cursorColor = "#ffffff"
            cyan = "#3a96dd"
            foreground = "#cccccc"
            green = "#13a10e"
            purple = "#881798"
            red = "#c50f1f"
            white = "#cccccc"
            yellow = "#c19c00"
        }
    )
    keybindings = @(
        @{
            command = "newTab"
            keys = "ctrl+shift+t"
        },
        @{
            command = "newWindow"
            keys = "ctrl+shift+n"
        },
        @{
            command = "closeWindow"
            keys = "ctrl+shift+w"
        },
        @{
            command = "nextTab"
            keys = "ctrl+tab"
        },
        @{
            command = "prevTab"
            keys = "ctrl+shift+tab"
        }
    )
}

# Sauvegarder la configuration
try {
    $ConfigJson = $DefaultConfig | ConvertTo-Json -Depth 10
    $ConfigJson | Out-File -FilePath $TerminalConfigPath -Encoding UTF8
    Write-Host "✅ Configuration Windows Terminal sauvegardée" -ForegroundColor Green
    Write-Host "📁 Fichier: $TerminalConfigPath" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Erreur lors de la sauvegarde: $_" -ForegroundColor Red
}

Write-Host "🔄 Redémarrez Windows Terminal pour appliquer les changements" -ForegroundColor Yellow 