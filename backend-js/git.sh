# Assurez-vous d'être dans le bon répertoire du projet backend
# cd /mnt/c/Users/AIFinesHerbes/AIFB/backend-js

echo "--- Étape 1: Synchronisation et commit sur la branche 'dev' ---"
# Passez à la branche dev
git checkout dev

# Affichez l'état actuel pour voir les modifications non stagées/non suivies
git status

# Ajoutez toutes les modifications suivies et non suivies au staging area
# C'est l'étape cruciale qui assure que src/RecipeList.jsx est inclus
git add .

# Créez un commit avec un message descriptif pour vos changements.
# REMPLACEZ CE MESSAGE par un résumé de VOS dernières modifications.
git commit -m "feat: Mise à jour du composant RecipeList avec parsing JSON et corrections UX"

# Poussez la branche dev mise à jour vers GitHub
echo "Poussée de la branche 'dev' vers 'origin'..."
git push origin dev

echo "--- Étape 2: Fusion de 'dev' dans 'main' et push ---"
# Passez à la branche main
git checkout main

# Récupérez les dernières modifications de main pour être sûr d'être à jour
echo "Récupération des dernières modifications de 'main'..."
git pull origin main

# Fusionnez la branche dev dans main. Ceci apportera tous les commits de dev vers main.
echo "Fusion de 'dev' dans 'main'..."
git merge dev

# Poussez la branche main mise à jour vers GitHub
echo "Poussée de la branche 'main' vers 'origin'..."
git push origin main

echo "--- Processus terminé ---"
echo "Vos branches 'dev' et 'main' sont maintenant synchronisées."
