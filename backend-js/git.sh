#!/bin/bash

# Vérifiez l'état de votre dépôt (toujours une bonne idée) :
git status

# Passez et mettez à jour votre branche dev :
git checkout dev
git pull origin dev # TRÈS IMPORTANT : Récupère les dernières modifs de la branche distante
git add . # Stager tous les fichiers modifiés et non suivis
git commit -m "feat: Mise à jour du composant RecipeList avec parsing JSON et corrections UX (Correction GA)"
git push origin dev
# Note : Si git pull origin dev cause des conflits, vous devrez les résoudre manuellement (git add . pour marquer comme résolu, puis git commit).
 
# Passez et synchronisez votre branche main :
git checkout main
git pull origin main # TRÈS IMPORTANT : Récupère les dernières modifs de la branche distante
git merge dev --no-ff # Fusionne dev dans main (crée un commit de fusion explicite)
git push origin main
