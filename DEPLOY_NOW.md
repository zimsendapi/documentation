# 🚀 Déployer MAINTENANT sur votre VPS

## Méthode la plus simple (5 minutes)

### 1️⃣ Testez le build localement

```bash
./test-build.sh
```

Cela va :
- ✅ Nettoyer les anciens builds
- ✅ Installer les dépendances
- ✅ Builder la documentation
- ✅ Vérifier que tout est OK
- ✅ Vous proposer de tester localement

### 2️⃣ Préparez votre VPS (première fois seulement)

```bash
# Connectez-vous à votre VPS
ssh user@votre-vps.com

# Installez Nginx si pas déjà fait
sudo apt update && sudo apt install nginx -y

# Créez le dossier
sudo mkdir -p /var/www/docs.zimsend.com
sudo chown -R $USER:$USER /var/www/docs.zimsend.com

# Déconnectez-vous
exit
```

### 3️⃣ Déployez !

```bash
# Remplacez par vos vraies infos
./deploy.sh user@votre-vps.com
```

Le script va tout faire automatiquement ! ⚡

### 4️⃣ Configurez Nginx (première fois seulement)

```bash
# Connectez-vous au VPS
ssh user@votre-vps.com

# Créez la config Nginx
sudo nano /etc/nginx/sites-available/docs.zimsend.com
```

**Collez cette configuration** (remplacez `docs.zimsend.com` par votre domaine) :

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

**Activez le site :**

```bash
sudo ln -s /etc/nginx/sites-available/docs.zimsend.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5️⃣ Ajoutez HTTPS (recommandé)

```bash
# Toujours sur le VPS
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d docs.zimsend.com
```

Suivez les instructions, c'est automatique ! 🔐

### 6️⃣ Vérifiez que ça marche

```bash
# Testez depuis votre machine locale
curl -I https://docs.zimsend.com
```

Vous devriez voir `HTTP/2 200` ✅

## 🎉 C'est fait !

Votre documentation est en ligne sur **https://docs.zimsend.com**

## 🔄 Pour les prochaines mises à jour

C'est encore plus simple :

```bash
./deploy.sh user@votre-vps.com
```

C'est tout ! Le script met à jour automatiquement.

## 🤖 Automatiser avec GitHub Actions (Bonus)

Pour que le déploiement se fasse automatiquement à chaque push :

### 1. Générez une clé SSH

```bash
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/github_deploy
ssh-copy-id -i ~/.ssh/github_deploy.pub user@votre-vps.com
cat ~/.ssh/github_deploy  # Copiez le contenu
```

### 2. Ajoutez les secrets dans GitHub

Allez sur GitHub : **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Ajoutez :
- **VPS_HOST** : `votre-vps.com` (ou l'IP)
- **VPS_USERNAME** : `votre-user`
- **VPS_SSH_KEY** : Collez le contenu de la clé privée

### 3. Push sur GitHub

```bash
git add .
git commit -m "Setup auto-deploy"
git push origin main
```

Maintenant, chaque fois que vous push sur `main`, le site se met à jour automatiquement ! 🎉

## 📋 Checklist

- [ ] Build testé localement (`./test-build.sh`)
- [ ] VPS accessible via SSH
- [ ] Nginx installé sur le VPS
- [ ] Dossier `/var/www/docs.zimsend.com` créé
- [ ] Premier déploiement fait (`./deploy.sh`)
- [ ] Configuration Nginx créée et activée
- [ ] Site accessible via HTTP
- [ ] SSL configuré avec Let's Encrypt
- [ ] Site accessible via HTTPS
- [ ] GitHub Actions configuré (optionnel)

## 🆘 Problèmes ?

### Le script deploy.sh ne fonctionne pas

```bash
chmod +x deploy.sh
./deploy.sh user@votre-vps.com
```

### Erreur de connexion SSH

```bash
# Testez la connexion
ssh user@votre-vps.com

# Si ça ne marche pas, vérifiez vos identifiants
```

### Erreur 403 Forbidden

```bash
ssh user@votre-vps.com
sudo chown -R www-data:www-data /var/www/docs.zimsend.com
sudo chmod -R 755 /var/www/docs.zimsend.com
sudo systemctl reload nginx
```

### Erreur 404 sur les pages

Vérifiez que `try_files` est dans votre config Nginx :

```nginx
location / {
    try_files $uri $uri/ $uri.html /index.html;
}
```

### Le site ne se met pas à jour

```bash
# Videz le cache Nginx
ssh user@votre-vps.com "sudo systemctl reload nginx"

# Videz le cache du navigateur
# Ctrl+Shift+R (Windows/Linux) ou Cmd+Shift+R (Mac)
```

## 📚 Plus d'infos

- **QUICK_DEPLOY.md** - Guide rapide détaillé
- **DEPLOYMENT.md** - Guide complet avec toutes les options
- **DEPLOYMENT_SUMMARY.md** - Résumé des options de déploiement

## 💡 Conseils Pro

1. **Testez toujours localement** avant de déployer
2. **Utilisez HTTPS** en production (Let's Encrypt est gratuit)
3. **Automatisez** avec GitHub Actions pour gagner du temps
4. **Sauvegardez** votre config Nginx
5. **Surveillez** les logs : `ssh user@vps "sudo tail -f /var/log/nginx/access.log"`

---

**Prêt ? Lancez `./deploy.sh user@votre-vps.com` et c'est parti ! 🚀**
