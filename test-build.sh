#!/bin/bash

# Script pour tester le build localement avant déploiement

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🧪 Test du build de la documentation...${NC}"

# 1. Nettoyer les anciens builds
echo -e "${BLUE}🧹 Nettoyage des anciens builds...${NC}"
npm run clear
rm -rf build/

# 2. Installer les dépendances
echo -e "${BLUE}📦 Installation des dépendances...${NC}"
npm install

# 3. Build
echo -e "${BLUE}🔨 Build de la documentation...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors du build${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build réussi !${NC}"

# 4. Vérifier la taille du build
BUILD_SIZE=$(du -sh build | cut -f1)
echo -e "${BLUE}📊 Taille du build: ${BUILD_SIZE}${NC}"

# 5. Vérifier les fichiers critiques
echo -e "${BLUE}🔍 Vérification des fichiers critiques...${NC}"

CRITICAL_FILES=(
    "build/index.html"
    "build/404.html"
    "build/sitemap.xml"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file manquant${NC}"
    fi
done

# 6. Proposer de servir localement
echo ""
echo -e "${BLUE}🌐 Voulez-vous tester le build localement ?${NC}"
echo -e "${BLUE}   Le site sera accessible sur http://localhost:3000${NC}"
read -p "Servir localement ? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${GREEN}🚀 Démarrage du serveur local...${NC}"
    npm run serve
fi

echo -e "${GREEN}✅ Test terminé avec succès !${NC}"
echo -e "${BLUE}💡 Vous pouvez maintenant déployer avec: ./deploy.sh user@votre-vps.com${NC}"
