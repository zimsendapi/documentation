# 🚀 Guide de Déploiement Rapide sur VPS

## Méthode 1 : Script automatique (Le plus simple)

### 1. Préparez votre VPS

```bash
# Connectez-vous à votre VPS
ssh user@votre-vps.com

# Installez Nginx si nécessaire
sudo apt update
sudo apt install nginx

# Créez le dossier de destination
sudo mkdir -p /var/www/docs.zimsend.com
sudo chown -R $USER:$USER /var/www/docs.zimsend.com
```

### 2. Déployez depuis votre machine locale

```bash
# Build et déploiement en une commande
./deploy.sh user@votre-vps.com
```

C'est tout ! Le script va :
- ✅ Builder la documentation
- ✅ Transférer les fichiers
- ✅ Configurer les permissions
- ✅ Recharger Nginx

### 3. Configurez Nginx (première fois seulement)

```bash
# Sur votre VPS
ssh user@votre-vps.com

# Copiez la configuration
sudo nano /etc/nginx/sites-available/docs.zimsend.com
```

Collez cette configuration (remplacez `docs.zimsend.com` par votre domaine) :

```nginx
server {
    listen 80;
    server_name docs.zimsend.com;
    root /var/www/docs.zimsend.com;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Activez le site :

```bash
sudo ln -s /etc/nginx/sites-available/docs.zimsend.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Ajoutez HTTPS (recommandé)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d docs.zimsend.com
```

## Méthode 2 : GitHub Actions (Déploiement automatique)

### 1. Configurez les secrets GitHub

Dans votre repo GitHub : **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Ajoutez :
- `VPS_HOST` : `votre-vps.com` ou `123.45.67.89`
- `VPS_USERNAME` : `votre-user`
- `VPS_SSH_KEY` : Votre clé privée SSH (voir ci-dessous)

### 2. Générez une clé SSH pour GitHub

```bash
# Sur votre machine locale
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/github_deploy

# Copiez la clé publique sur le VPS
ssh-copy-id -i ~/.ssh/github_deploy.pub user@votre-vps.com

# Affichez la clé privée pour la copier dans GitHub Secrets
cat ~/.ssh/github_deploy
```

### 3. Push sur GitHub

```bash
git add .
git commit -m "Setup deployment"
git push origin main
```

Le déploiement se fera automatiquement ! 🎉

## Méthode 3 : Build sur le VPS

### 1. Installez Node.js sur le VPS

```bash
ssh user@votre-vps.com

# Installez Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Clonez et buildez

```bash
cd /var/www
git clone https://github.com/votre-username/zimsend-docs.git docs.zimsend.com
cd docs.zimsend.com
npm install
npm run build
```

### 3. Configurez Nginx pour pointer vers `build/`

```nginx
server {
    listen 80;
    server_name docs.zimsend.com;
    root /var/www/docs.zimsend.com/build;  # Notez le /build
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html /index.html;
    }
}
```

### 4. Script de mise à jour

Créez `/var/www/docs.zimsend.com/update.sh` :

```bash
#!/bin/bash
cd /var/www/docs.zimsend.com
git pull origin main
npm install
npm run build
echo "✅ Mise à jour terminée !"
```

```bash
chmod +x update.sh
```

Pour mettre à jour :

```bash
ssh user@votre-vps.com "/var/www/docs.zimsend.com/update.sh"
```

## Vérification

Après le déploiement, testez :

```bash
# Vérifiez que le site répond
curl -I http://docs.zimsend.com

# Vérifiez les logs Nginx
ssh user@votre-vps.com "sudo tail -f /var/log/nginx/access.log"
```

## Dépannage Rapide

### Erreur 403 Forbidden

```bash
ssh user@votre-vps.com
sudo chown -R www-data:www-data /var/www/docs.zimsend.com
sudo chmod -R 755 /var/www/docs.zimsend.com
```

### Erreur 404 sur les routes

Vérifiez que `try_files` est correct dans Nginx :

```nginx
location / {
    try_files $uri $uri/ $uri.html /index.html;
}
```

### Le site ne se met pas à jour

```bash
# Videz le cache du navigateur (Ctrl+Shift+R)
# Ou videz le cache Nginx
ssh user@votre-vps.com "sudo systemctl reload nginx"
```

### Problème de permissions SSH

```bash
# Sur votre machine locale
chmod 600 ~/.ssh/github_deploy
ssh -i ~/.ssh/github_deploy user@votre-vps.com
```

## Commandes Utiles

```bash
# Voir les logs Nginx en temps réel
ssh user@votre-vps.com "sudo tail -f /var/log/nginx/access.log"

# Tester la configuration Nginx
ssh user@votre-vps.com "sudo nginx -t"

# Recharger Nginx
ssh user@votre-vps.com "sudo systemctl reload nginx"

# Redémarrer Nginx
ssh user@votre-vps.com "sudo systemctl restart nginx"

# Vérifier l'espace disque
ssh user@votre-vps.com "df -h"

# Vérifier les processus Nginx
ssh user@votre-vps.com "ps aux | grep nginx"
```

## Checklist de Déploiement

- [ ] VPS accessible via SSH
- [ ] Nginx installé et fonctionnel
- [ ] Domaine pointant vers le VPS
- [ ] Dossier `/var/www/docs.zimsend.com` créé
- [ ] Configuration Nginx créée et activée
- [ ] Build de la documentation réussi
- [ ] Fichiers transférés sur le VPS
- [ ] Permissions correctes (www-data:www-data)
- [ ] Nginx rechargé
- [ ] Site accessible via HTTP
- [ ] SSL configuré avec Let's Encrypt
- [ ] Site accessible via HTTPS
- [ ] Redirection HTTP → HTTPS active

## Support

Si vous rencontrez des problèmes, consultez [DEPLOYMENT.md](./DEPLOYMENT.md) pour plus de détails.
