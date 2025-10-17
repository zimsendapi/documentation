#!/bin/bash

# Script de déploiement rapide pour VPS
# Usage: ./deploy.sh user@votre-vps.com

set -e

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Vérifier les arguments
if [ -z "$1" ]; then
    echo -e "${RED}Erreur: Veuillez spécifier l'hôte SSH${NC}"
    echo "Usage: ./deploy.sh user@votre-vps.com [chemin-distant]"
    exit 1
fi

SSH_HOST=$1
REMOTE_PATH=${2:-/var/www/docs.zimsend.com}

echo -e "${BLUE}🚀 Démarrage du déploiement...${NC}"

# 1. Build local
echo -e "${BLUE}📦 Build de la documentation...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors du build${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build réussi${NC}"

# 2. Créer le dossier distant si nécessaire
echo -e "${BLUE}📁 Création du dossier distant...${NC}"
ssh $SSH_HOST "mkdir -p $REMOTE_PATH"

# 3. Transférer les fichiers
echo -e "${BLUE}📤 Transfert des fichiers vers le VPS...${NC}"
rsync -avz --delete \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='.DS_Store' \
    build/ $SSH_HOST:$REMOTE_PATH/

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors du transfert${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Fichiers transférés avec succès${NC}"

# 4. Définir les permissions
echo -e "${BLUE}🔐 Configuration des permissions...${NC}"
ssh $SSH_HOST "sudo chown -R www-data:www-data $REMOTE_PATH && sudo chmod -R 755 $REMOTE_PATH"

# 5. Recharger Nginx
echo -e "${BLUE}🔄 Rechargement de Nginx...${NC}"
ssh $SSH_HOST "sudo nginx -t && sudo systemctl reload nginx"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors du rechargement de Nginx${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Nginx rechargé${NC}"
echo -e "${GREEN}🎉 Déploiement terminé avec succès !${NC}"
echo -e "${BLUE}🌐 Votre site devrait être accessible maintenant${NC}"
