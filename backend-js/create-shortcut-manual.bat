@echo off
echo Creation du raccourci "Dev Environment" sur le bureau...

REM Obtenir le chemin du bureau
set "DESKTOP=%USERPROFILE%\Desktop"

REM Chemin vers le script PowerShell
set "SCRIPT_PATH=%~dp0auto-start-dev.ps1"

REM Créer le raccourci avec PowerShell
powershell -Command "& {$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%DESKTOP%\Dev Environment.lnk'); $Shortcut.TargetPath = 'powershell.exe'; $Shortcut.Arguments = '-ExecutionPolicy Bypass -File \"%SCRIPT_PATH%\"'; $Shortcut.WorkingDirectory = '%~dp0'; $Shortcut.Description = 'Lance l''environnement de developpement avec disposition automatique des fenetres'; $Shortcut.IconLocation = 'C:\Windows\System32\SHELL32.dll,21'; $Shortcut.Save()}"

if %ERRORLEVEL% EQU 0 (
    echo Raccourci cree avec succes sur le bureau!
    echo Vous pouvez maintenant double-cliquer sur "Dev Environment" pour lancer votre environnement.
) else (
    echo Erreur lors de la creation du raccourci.
    echo Code d'erreur: %ERRORLEVEL%
)

pause 