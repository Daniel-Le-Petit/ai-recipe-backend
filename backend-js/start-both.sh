#!/bin/bash

# Script pour démarrer le backend Strapi et le frontend Next.js

echo "🚀 Démarrage du backend Strapi et du frontend Next.js..."

# Fonction pour arrêter tous les processus au signal d'interruption
cleanup() {
    echo "🛑 Arrêt des services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Capturer le signal d'interruption (Ctrl+C)
trap cleanup SIGINT

# Démarrer le backend Strapi
echo "📡 Démarrage du backend Strapi sur http://localhost:1338..."
cd backend-js
npm run dev &
BACKEND_PID=$!

# Attendre un peu que le backend démarre
sleep 5

# Démarrer le frontend Next.js
echo "🌐 Démarrage du frontend Next.js sur http://localhost:3000..."
cd ../frontend-m
npm run dev &
FRONTEND_PID=$!

echo "✅ Services démarrés !"
echo "   - Backend: http://localhost:1338"
echo "   - Frontend: http://localhost:3000"
echo "   - Admin Strapi: http://localhost:1338/admin"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter tous les services"

# Attendre que les processus se terminent
wait 