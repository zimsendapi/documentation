# 📚 SMS Gateway - Documentation

Documentation professionnelle et complète pour la plateforme SMS Gateway, construite avec [Docusaurus](https://docusaurus.io/) et intégrant Swagger UI pour l'API Reference.

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 20+
- npm 10+

### Installation

```bash
# Installer les dépendances
npm install

# Générer la documentation API depuis OpenAPI
npm run docusaurus gen-api-docs all

# Démarrer le serveur de développement
npm start
```

Le site de documentation sera accessible sur [http://localhost:3000](http://localhost:3000)

### Build Production

```bash
# Build pour la production
npm run build

# Servir le build localement
npm run serve
```

## 📁 Structure du Projet

```
documentation/
├── docs/                       # Fichiers de documentation
│   ├── intro.md               # Page d'introduction
│   ├── guides/                # Guides utilisateur
│   │   ├── quick-start.md
│   │   ├── installation.md
│   │   ├── first-sms.md
│   │   ├── authentication.md
│   │   └── webhooks.md
│   ├── architecture/          # Documentation architecture
│   │   ├── overview.md
│   │   ├── data-flow.md
│   │   ├── queue-system.md
│   │   ├── mqtt-broker.md
│   │   └── security.md
│   ├── android/               # Configuration Android
│   │   └── setup.md
│   ├── sdk/                   # SDKs et exemples
│   │   ├── overview.md
│   │   ├── nodejs/            # Node.js SDK
│   │   ├── python/            # Python SDK
│   │   └── php/               # PHP SDK
│   ├── webhooks/              # Documentation webhooks
│   │   └── events.md
│   ├── deployment/            # Guides de déploiement
│   │   └── docker.md
│   ├── billing/               # Plans et tarification
│   │   ├── plans.md
│   │   └── rate-limits.md
│   ├── api/                   # API Reference (généré automatiquement)
│   ├── troubleshooting.md     # Guide de dépannage
│   └── faq.md                 # FAQ
├── src/                       # Composants React personnalisés
│   ├── components/            # Composants Docusaurus
│   ├── css/                   # Styles personnalisés
│   └── pages/                 # Pages personnalisées
├── static/                    # Assets statiques
│   └── img/                   # Images et icônes
├── openapi.yaml              # Spécification OpenAPI 3.0
├── docusaurus.config.ts      # Configuration Docusaurus
├── sidebars.ts               # Configuration des sidebars
└── package.json              # Dépendances npm
```

## 🎨 Fonctionnalités

### ✅ Documentation Complète
- **31+ fichiers** de documentation en français
- **Architecture détaillée** avec diagrammes ASCII
- **Guides pas à pas** pour tous les cas d'usage
- **Exemples de code** en JavaScript, Python, PHP
- **Troubleshooting** complet avec solutions

### ✅ API Reference Interactive
- **Généré automatiquement** depuis `openapi.yaml`
- **Interface Swagger UI** intégrée
- **Essayer l'API** directement depuis la doc
- **33+ endpoints** documentés
- **Schémas et modèles** complets

### ✅ Support Multi-Langages
- **Français** (par défaut)
- **Anglais** (configuré)
- Facilement extensible pour d'autres langues

### ✅ Recherche Performante
- Configuration Algolia DocSearch prête
- Recherche dans toute la documentation
- Résultats contextuels

### ✅ Thème Moderne
- **Mode sombre/clair** avec switch automatique
- **Responsive** pour mobile, tablette, desktop
- **Navigation intuitive** avec sidebar
- **Syntax highlighting** pour 12+ langages

## 🛠️ Scripts Disponibles

```bash
# Développement
npm start                           # Serveur de dev sur http://localhost:3000
npm run docusaurus gen-api-docs all # Générer l'API reference

# Production
npm run build                       # Build pour production
npm run serve                       # Servir le build localement
npm run clear                       # Nettoyer le cache

# Maintenance
npm run swizzle                     # Personnaliser les composants
npm run deploy                      # Déployer (configure selon plateforme)
```

## 📝 Éditer la Documentation

### Ajouter une nouvelle page

1. Créer un fichier `.md` ou `.mdx` dans `docs/`
2. Ajouter le frontmatter:
   ```md
   ---
   sidebar_position: 1
   title: Mon Titre
   ---

   # Mon Contenu
   ```
3. Référencer dans `sidebars.ts` si nécessaire

### Mettre à jour l'API Reference

1. Modifier `openapi.yaml`
2. Regénérer la documentation API:
   ```bash
   npm run docusaurus gen-api-docs all
   ```
3. Les fichiers dans `docs/api/` seront mis à jour automatiquement

### Syntaxe Markdown Avancée

```md
# Titre de niveau 1
## Titre de niveau 2

**Texte en gras**
*Texte en italique*

\```javascript
// Bloc de code avec syntax highlighting
const api = 'https://api.smsgateway.com';
\```

:::tip Conseil
Utilisez des admonitions pour les notes importantes
:::

:::warning Attention
Messages d'avertissement
:::

:::danger Danger
Erreurs critiques
:::

:::info Information
Informations complémentaires
:::
```

## 🌐 Internationalisation

La documentation supporte le multi-langues. Pour ajouter une traduction:

```bash
# Créer les fichiers de traduction
npm run write-translations -- --locale en

# Traduire dans i18n/en/
# Démarrer avec la locale
npm run start -- --locale en
```

## 🚀 Déploiement

### GitHub Pages

```bash
# Configurer dans docusaurus.config.ts
organizationName: 'votre-org'
projectName: 'sms-gateway-docs'

# Déployer
GIT_USER=<votre-username> npm run deploy
```

### Netlify / Vercel

```bash
# Build command
npm run build

# Publish directory
build
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "serve", "--", "--host", "0.0.0.0"]
```

```bash
docker build -t sms-gateway-docs .
docker run -p 3000:3000 sms-gateway-docs
```

## 📊 Statistiques de la Documentation

- **31 fichiers** de documentation
- **33+ endpoints** API documentés
- **100+ exemples** de code
- **6 langages** de programmation couverts (JS, TS, Python, PHP, Ruby, Go, Java)
- **12 langages** avec syntax highlighting
- **5 sections** principales
- **Support** en Français et Anglais

## 🤝 Contribution

Pour contribuer à la documentation:

1. Fork le repository
2. Créer une branche (`git checkout -b feature/ma-doc`)
3. Éditer les fichiers dans `docs/`
4. Tester localement (`npm start`)
5. Commit (`git commit -m 'Add: documentation xyz'`)
6. Push (`git push origin feature/ma-doc`)
7. Créer une Pull Request

## 📚 Ressources

- [Docusaurus Documentation](https://docusaurus.io/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Markdown Guide](https://www.markdownguide.org/)
- [MDX Documentation](https://mdxjs.com/)

## 📄 Licence

Cette documentation est sous licence MIT - voir [LICENSE](../LICENSE)

## 🆘 Support

- **Email**: support@smsgateway.com
- **Discord**: [Rejoindre](https://discord.gg/smsgateway)
- **Issues**: [GitHub Issues](https://github.com/sms-gateway/sms-gateway/issues)

---

**Construit avec ❤️ par l'équipe SMS Gateway**
