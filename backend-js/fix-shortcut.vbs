' Script VBScript pour créer un raccourci "Dev Environment" corrigé
Option Explicit

Dim objShell, objShortcut, strDesktop, strScriptPath, strShortcutPath

' Obtenir le chemin du bureau
Set objShell = CreateObject("WScript.Shell")
strDesktop = objShell.SpecialFolders("Desktop")

' Chemin vers le script PowerShell (dans le même répertoire que ce script)
strScriptPath = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName) & "\auto-start-dev.ps1"

' Chemin complet du raccourci
strShortcutPath = strDesktop & "\Dev Environment.lnk"

' Supprimer l'ancien raccourci s'il existe
If CreateObject("Scripting.FileSystemObject").FileExists(strShortcutPath) Then
    CreateObject("Scripting.FileSystemObject").DeleteFile(strShortcutPath)
End If

' Créer le raccourci
Set objShortcut = objShell.CreateShortcut(strShortcutPath)

' Configurer le raccourci avec une meilleure configuration PowerShell
objShortcut.TargetPath = "powershell.exe"
objShortcut.Arguments = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Normal -File """ & strScriptPath & """"
objShortcut.WorkingDirectory = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
objShortcut.Description = "Lance l'environnement de développement avec disposition automatique des fenêtres"
objShortcut.IconLocation = "C:\Windows\System32\SHELL32.dll,21"
objShortcut.WindowStyle = 1 ' Normal window

' Sauvegarder le raccourci
objShortcut.Save

' Afficher le résultat
WScript.Echo "Raccourci corrigé créé avec succès sur le bureau!"
WScript.Echo "Chemin: " & strShortcutPath
WScript.Echo "Arguments: " & objShortcut.Arguments
WScript.Echo ""
WScript.Echo "Test du raccourci..."
WScript.Echo "Double-cliquez sur 'Dev Environment' pour lancer votre environnement."

' Nettoyer
Set objShortcut = Nothing
Set objShell = Nothing 