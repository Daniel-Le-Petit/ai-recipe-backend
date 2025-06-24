#!/bin/bash

# Vérifiez l'état de votre dépôt (toujours une bonne idée) :
git status

# Passez et mettez à jour votre branche main :
git checkout main
git pull origin main # TRÈS IMPORTANT : Récupère les dernières modifs de la branche distante
git add . # Stager tous les fichiers modifiés et non suivis
git commit -m "feat: $1"
git push origin main
# Note : Si git pull origin main cause des conflits, vous devrez les résoudre manuellement (git add . pour marquer comme résolu, puis git commit).
