# 🚀 Environnement de Développement Automatisé

Configuration automatique de votre environnement de développement avec disposition optimisée des fenêtres.

## 🎯 Disposition des Fenêtres

Votre environnement sera organisé automatiquement comme suit :

```
┌─────────────────────────────────────────────────────────────┐
│                    ÉCRAN COMPLET                            │
├─────────────────────────────┬───────────────────────────────┤
│                             │                               │
│                             │                               │
│        FRONTEND-JS          │                               │
│        & FRONTEND           │         PROMPTS/CHAT          │
│        (60% largeur)        │        (40% largeur)          │
│        (70% hauteur)        │                               │
│                             │                               │
├─────────────────────────────┤                               │
│                             │                               │
│        WSL/TERMINAL         │                               │
│        (60% largeur)        │                               │
│        (30% hauteur)        │                               │
└─────────────────────────────┴───────────────────────────────┘
```

## 📋 Installation

### 1. Installation automatique (recommandée)

```powershell
# Exécuter le script d'installation complet
.\install-dev-environment.ps1
```

### 2. Installation manuelle

Si vous préférez installer chaque composant séparément :

```powershell
# Configuration Windows Terminal
.\setup-terminal-layout.ps1

# Création du raccourci de bureau
.\create-shortcut.ps1

# Test de l'organisation des fenêtres
.\start-layout.ps1
```

## 🚀 Utilisation

### Démarrage automatique

1. **Raccourci de bureau** : Double-cliquez sur "Dev Environment" sur votre bureau
2. **Commande directe** : `.\auto-start-dev.ps1`

### Réorganisation des fenêtres

Pour réorganiser les fenêtres à tout moment :

```powershell
.\start-layout.ps1
```

## 📁 Fichiers Créés

- `auto-start-dev.ps1` - Script principal de lancement automatique
- `start-layout.ps1` - Organisation des fenêtres
- `setup-terminal-layout.ps1` - Configuration Windows Terminal
- `create-shortcut.ps1` - Création du raccourci de bureau
- `install-dev-environment.ps1` - Installation complète

## ⚙️ Configuration

### Projets configurés

- **Backend JS** : `C:\Users\AIFinesHerbes\AIFB\backend-js`
  - Commande : `npm run develop`
- **Frontend** : `C:\Users\AIFinesHerbes\AIFB\frontend-m`
  - Commande : `npm run dev`

### Éditeurs supportés

- Cursor (priorité)
- VS Code
- Autres éditeurs basés sur Electron

### Terminaux configurés

- WSL avec onglets préconfigurés
- PowerShell
- Répertoires de départ automatiques

## 🔧 Personnalisation

### Modifier les chemins des projets

Éditez `auto-start-dev.ps1` et modifiez la section `$projects` :

```powershell
$projects = @(
    @{
        Path = "VOTRE_CHEMIN_BACKEND"
        Name = "Nom du Backend"
        Command = "votre_commande"
    },
    @{
        Path = "VOTRE_CHEMIN_FRONTEND"
        Name = "Nom du Frontend"
        Command = "votre_commande"
    }
)
```

### Modifier la disposition des fenêtres

Éditez `start-layout.ps1` et modifiez les pourcentages :

```powershell
$leftWidth = [int]($screenWidth * 0.6)  # 60% pour la gauche
$rightWidth = $screenWidth - $leftWidth  # 40% pour la droite
$topHeight = [int]($screenHeight * 0.7)  # 70% pour le haut
$bottomHeight = $screenHeight - $topHeight  # 30% pour le bas
```

## 🐛 Dépannage

### Problèmes courants

1. **Erreur d'exécution de script**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. **Fenêtres non détectées**
   - Assurez-vous que les applications sont ouvertes
   - Vérifiez les noms des processus dans `start-layout.ps1`

3. **Chemins incorrects**
   - Vérifiez les chemins dans `auto-start-dev.ps1`
   - Assurez-vous que les projets existent

### Logs et débogage

Les scripts affichent des messages colorés pour indiquer :
- ✅ Succès (vert)
- ⚠️ Avertissements (jaune)
- ❌ Erreurs (rouge)
- ℹ️ Informations (cyan)

## 📞 Support

Pour toute question ou problème :

1. Vérifiez les messages d'erreur dans la console
2. Consultez la section dépannage
3. Vérifiez que tous les prérequis sont installés

## 🔄 Mise à jour

Pour mettre à jour la configuration :

```powershell
# Réinstaller complètement
.\install-dev-environment.ps1

# Ou mettre à jour individuellement
.\setup-terminal-layout.ps1
.\create-shortcut.ps1
```

---

**🎉 Votre environnement de développement est maintenant configuré pour une productivité maximale !** 