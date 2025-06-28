' Script VBScript pour créer le raccourci "Dev Environment"
Option Explicit

Dim objShell, objShortcut, strDesktop, strScriptPath, strShortcutPath

' Obtenir le chemin du bureau
Set objShell = CreateObject("WScript.Shell")
strDesktop = objShell.SpecialFolders("Desktop")

' Chemin vers le script PowerShell (dans le même répertoire que ce script)
strScriptPath = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName) & "\auto-start-dev.ps1"

' Chemin complet du raccourci
strShortcutPath = strDesktop & "\Dev Environment.lnk"

' Créer le raccourci
Set objShortcut = objShell.CreateShortcut(strShortcutPath)

' Configurer le raccourci
objShortcut.TargetPath = "powershell.exe"
objShortcut.Arguments = "-ExecutionPolicy Bypass -File """ & strScriptPath & """"
objShortcut.WorkingDirectory = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
objShortcut.Description = "Lance l'environnement de développement avec disposition automatique des fenêtres"
objShortcut.IconLocation = "C:\Windows\System32\SHELL32.dll,21"

' Sauvegarder le raccourci
objShortcut.Save

' Afficher le résultat
WScript.Echo "Raccourci créé avec succès sur le bureau!"
WScript.Echo "Chemin: " & strShortcutPath
WScript.Echo "Vous pouvez maintenant double-cliquer sur 'Dev Environment' pour lancer votre environnement."

' Nettoyer
Set objShortcut = Nothing
Set objShell = Nothing 