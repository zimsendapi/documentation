# Guide de déploiement sur VPS

## Prérequis
- Un VPS avec Nginx installé
- Node.js 20+ installé sur votre machine locale
- Accès SSH à votre VPS
- Un nom de domaine pointant vers votre VPS (ex: docs.zimsend.com)

## Option 1 : Déploiement manuel

### 1. Build en local

```bash
# Installer les dépendances
npm install

# Build de production
npm run build
```

Cela créera un dossier `build/` avec tous les fichiers statiques.

### 2. Transférer les fichiers vers le VPS

```bash
# Créer le dossier sur le VPS
ssh user@votre-vps.com "mkdir -p /var/www/docs.zimsend.com"

# Transférer les fichiers
rsync -avz --delete build/ user@votre-vps.com:/var/www/docs.zimsend.com/
```

### 3. Configuration Nginx

Créez un fichier de configuration Nginx sur votre VPS :

```bash
ssh user@votre-vps.com
sudo nano /etc/nginx/sites-available/docs.zimsend.com
```

Ajoutez cette configuration :

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name docs.zimsend.com;

    root /var/www/docs.zimsend.com;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Main location
    location / {
        try_files $uri $uri/ $uri.html /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### 4. Activer le site

```bash
# Créer le lien symbolique
sudo ln -s /etc/nginx/sites-available/docs.zimsend.com /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx
```

### 5. SSL avec Let's Encrypt (Recommandé)

```bash
# Installer certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Obtenir le certificat SSL
sudo certbot --nginx -d docs.zimsend.com

# Le renouvellement automatique est configuré par défaut
```

## Option 2 : Déploiement automatique avec GitHub Actions

### 1. Créer un script de déploiement

Créez `.github/workflows/deploy.yml` :

```yaml
name: Deploy to VPS

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to VPS
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          key: ${{ secrets.VPS_SSH_KEY }}
          source: "build/*"
          target: "/var/www/docs.zimsend.com"
          strip_components: 1
          rm: true
```

### 2. Configurer les secrets GitHub

Dans votre repo GitHub, allez dans Settings > Secrets and variables > Actions, et ajoutez :

- `VPS_HOST` : L'adresse IP ou le domaine de votre VPS
- `VPS_USERNAME` : Votre nom d'utilisateur SSH
- `VPS_SSH_KEY` : Votre clé privée SSH (le contenu de `~/.ssh/id_rsa`)

### 3. Générer une clé SSH pour le déploiement (si nécessaire)

```bash
# Sur votre machine locale
ssh-keygen -t rsa -b 4096 -C "github-deploy" -f ~/.ssh/github_deploy

# Copier la clé publique sur le VPS
ssh-copy-id -i ~/.ssh/github_deploy.pub user@votre-vps.com

# Copier le contenu de la clé privée pour GitHub Secrets
cat ~/.ssh/github_deploy
```

## Option 3 : Build directement sur le VPS

### 1. Cloner le repo sur le VPS

```bash
ssh user@votre-vps.com

# Installer Node.js si nécessaire
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Cloner le repo
cd /var/www
sudo git clone https://github.com/votre-username/zimsend-docs.git docs.zimsend.com
cd docs.zimsend.com

# Installer les dépendances
npm install

# Build
npm run build

# Configurer Nginx pour pointer vers le dossier build
```

### 2. Script de mise à jour

Créez un script `deploy.sh` sur le VPS :

```bash
#!/bin/bash
cd /var/www/docs.zimsend.com
git pull origin main
npm install
npm run build
echo "Déploiement terminé !"
```

Rendez-le exécutable :

```bash
chmod +x deploy.sh
```

Pour mettre à jour :

```bash
ssh user@votre-vps.com "/var/www/docs.zimsend.com/deploy.sh"
```

## Vérification

Après le déploiement, vérifiez que tout fonctionne :

```bash
# Vérifier les logs Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Tester le site
curl -I https://docs.zimsend.com
```

## Dépannage

### Erreur 404 sur les routes

Si vous avez des erreurs 404 sur les routes, vérifiez que la directive `try_files` est correcte dans Nginx.

### Problèmes de permissions

```bash
# Donner les bonnes permissions
sudo chown -R www-data:www-data /var/www/docs.zimsend.com
sudo chmod -R 755 /var/www/docs.zimsend.com
```

### Cache du navigateur

Si les changements ne s'affichent pas, videz le cache :

```bash
# Vider le cache Nginx (si activé)
sudo rm -rf /var/cache/nginx/*
sudo systemctl reload nginx
```

## Recommandations

1. **Utilisez HTTPS** : Toujours activer SSL avec Let's Encrypt
2. **Automatisez** : Utilisez GitHub Actions pour un déploiement automatique
3. **Monitoring** : Configurez des alertes pour surveiller votre site
4. **Backup** : Sauvegardez régulièrement votre configuration Nginx
5. **CDN** : Envisagez d'utiliser Cloudflare pour améliorer les performances
