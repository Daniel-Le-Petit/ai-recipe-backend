# Assurez-vous d'être sur la branche dev et qu'elle est à jour
git checkout dev
git pull origin dev

# Passez à la branche main
git checkout main
# Récupérez les dernières modifications de main (si d'autres personnes ont poussé)
git pull origin main
# Fusionnez les changements de dev dans main
git merge dev
# Poussez la branche main mise à jour vers GitHub
git push origin main
