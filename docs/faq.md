---
sidebar_position: 10
---

# FAQ - Questions Fréquentes

Retrouvez les réponses aux questions les plus fréquentes sur l'utilisation de l'API ZimSend.

## Général

### Qu'est-ce que ZimSend ?

ZimSend est une API SMS qui vous permet d'envoyer des SMS depuis vos applications en utilisant votre propre téléphone Android comme passerelle. Contrairement aux services traditionnels comme Twilio, vous ne payez pas par SMS - vous utilisez simplement votre forfait mobile existant.

### Ai-je besoin d'un abonnement pour utiliser ZimSend ?

Oui, vous devez créer un compte sur [app.zimsend.com](https://app.zimsend.com). L'abonnement vous donne accès à l'API, au dashboard et aux fonctionnalités de gestion.

### Combien coûte l'envoi d'un SMS ?

ZimSend ne facture pas au SMS. Vous utilisez votre propre forfait mobile. Si vous avez un forfait illimité, vos SMS sont gratuits. Sinon, vous payez le tarif de votre opérateur mobile.

### Puis-je utiliser ZimSend sans téléphone Android ?

Non, vous devez avoir au moins un téléphone Android pour envoyer des SMS. Le téléphone agit comme passerelle entre l'API et le réseau mobile.

## Configuration

### Comment obtenir mes identifiants API ?

1. Connectez-vous à [app.zimsend.com](https://app.zimsend.com)
2. Allez dans **API Keys** pour créer une clé API
3. Allez dans **Paramètres** pour obtenir votre Client ID
4. Allez dans **Devices** pour obtenir votre Device ID

### Comment connecter mon téléphone Android ?

1. Dans le dashboard, allez dans **Devices** → **Ajouter un device**
2. Téléchargez l'APK ZimSend sur votre téléphone
3. Installez l'application (autorisez les sources inconnues si nécessaire)
4. Scannez le QR code ou entrez manuellement Client ID + Device Password
5. Autorisez les permissions SMS quand l'application le demande

### Mon téléphone doit-il rester allumé en permanence ?

Oui, pour envoyer des SMS, votre téléphone doit être :
- Allumé
- Connecté à Internet (WiFi ou données mobiles)
- L'application ZimSend active en arrière-plan

Nous recommandons de laisser le téléphone branché sur secteur.

### Puis-je utiliser plusieurs téléphones ?

Oui ! Vous pouvez connecter plusieurs téléphones Android à votre compte. Vous pouvez :
- Spécifier quel device utiliser avec le header `X-Device-ID`
- Laisser ZimSend choisir automatiquement un device disponible
- Configurer du load balancing entre vos devices

## Envoi de SMS

### Quelle est la longueur maximale d'un SMS ?

Un SMS standard fait 160 caractères. ZimSend supporte jusqu'à 1600 caractères (environ 10 SMS concaténés). Au-delà de 160 caractères, le message sera envoyé en plusieurs parties.

### Combien de SMS puis-je envoyer ?

Il n'y a pas de limite stricte côté ZimSend, mais :
- Votre opérateur mobile peut avoir des limites journalières
- Nous recommandons environ 1 SMS toutes les 2-3 secondes pour éviter les blocages
- En masse, maximum 100 destinataires par requête API

### Puis-je programmer l'envoi d'un SMS ?

Oui, utilisez le paramètre `scheduled_at` avec une date ISO 8601 :

```json
{
  "to": "+33612345678",
  "message": "Rappel de rendez-vous demain",
  "scheduled_at": "2025-01-16T09:00:00Z"
}
```

Vous pouvez programmer jusqu'à 30 jours à l'avance.

### Comment annuler un SMS programmé ?

Utilisez l'endpoint DELETE avec le message_id :

```bash
curl -X DELETE https://api.zimsend.com/v1/sms/msg_1234567890abcdef \
  -H "X-API-Key: votre_cle" \
  -H "X-Client-ID: votre_client_id"
```

Vous ne pouvez annuler que les SMS avec le statut `queued`.

### Puis-je envoyer des SMS internationaux ?

Oui, si votre forfait mobile le permet. Utilisez toujours le format international avec le code pays :
- France : +33
- Belgique : +32
- Suisse : +41
- etc.

### Les SMS sont-ils envoyés immédiatement ?

Les SMS sont généralement envoyés dans les 2-5 secondes. Le délai dépend de :
- La connexion Internet de votre device
- La file d'attente (si vous envoyez en masse)
- La priorité du message (`low`, `normal`, `high`)

## Authentification et Sécurité

### Comment sécuriser ma clé API ?

- Ne la commitez **jamais** dans votre code source
- Utilisez des variables d'environnement
- Créez des clés différentes pour dev/prod
- Révoquez immédiatement toute clé compromise

```javascript
// ❌ MAUVAIS
const API_KEY = 'zs_live_abc123...';

// ✅ BON
const API_KEY = process.env.ZIMSEND_API_KEY;
```

### Que faire si ma clé API est compromise ?

1. Allez immédiatement dans le dashboard
2. Section **API Keys**
3. Cliquez sur **Révoquer** pour la clé compromise
4. Créez une nouvelle clé
5. Mettez à jour vos applications avec la nouvelle clé

### Comment vérifier que mes webhooks proviennent bien de ZimSend ?

Vérifiez toujours la signature HMAC dans le header `X-Webhook-Signature` :

```javascript
const crypto = require('crypto');

const signature = req.headers['x-webhook-signature'];
const body = req.body; // Corps brut

const expectedSignature = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(body)
  .digest('hex');

if (signature !== expectedSignature) {
  return res.status(401).send('Unauthorized');
}
```

## OTP et 2FA

### Combien de temps un code OTP est-il valide ?

Par défaut, 5 minutes (300 secondes). Vous pouvez personnaliser avec le paramètre `expiry` :

```json
{
  "to": "+33612345678",
  "expiry": 600  // 10 minutes
}
```

### Combien de tentatives de vérification sont autorisées ?

Un utilisateur a **3 tentatives** pour saisir le bon code OTP. Après 3 échecs, l'OTP est invalidé et un nouveau doit être généré.

### Puis-je personnaliser le message OTP ?

Oui, utilisez le paramètre `template` avec le placeholder `{{code}}` :

```json
{
  "to": "+33612345678",
  "template": "Votre code MonApp : {{code}}. Ne le partagez jamais."
}
```

### Comment éviter les abus d'OTP ?

ZimSend limite automatiquement à **10 OTP par heure** pour un même numéro. Vous pouvez ajouter vos propres limitations côté application.

## Webhooks

### Pourquoi mes webhooks ne sont pas reçus ?

Vérifiez que :
- Votre URL utilise **HTTPS** (HTTP est rejeté)
- Votre serveur est accessible publiquement
- Vous répondez avec un code HTTP 200 en moins de 5 secondes
- Votre firewall n'bloque pas les requêtes de ZimSend

### Les webhooks sont-ils envoyés plusieurs fois ?

Oui, si votre endpoint échoue, ZimSend réessaie :
- 1ère tentative : immédiate
- 2ème tentative : après 1 minute
- 3ème tentative : après 5 minutes

Implémentez l'idempotence en vérifiant `event_id`.

### Comment tester mes webhooks en local ?

Utilisez un tunnel comme ngrok :

```bash
ngrok http 3000
# Utilisez l'URL fournie : https://abc123.ngrok.io/webhooks/zimsend
```

## Tracking et Historique

### Combien de temps l'historique est-il conservé ?

Nous conservons l'historique complet pendant **90 jours**. Après cette période, seules les statistiques agrégées sont conservées.

### Puis-je exporter mon historique ?

Oui, utilisez l'API avec des filtres de date :

```bash
curl "https://api.zimsend.com/v1/sms/history?from_date=2025-01-01&to_date=2025-01-31&limit=100" \
  -H "X-API-Key: votre_cle" \
  -H "X-Client-ID: votre_client_id"
```

### Que signifient les différents statuts ?

- `queued` : SMS en file d'attente
- `sent` : SMS envoyé au réseau mobile
- `delivered` : SMS délivré au destinataire
- `failed` : Échec de l'envoi
- `cancelled` : SMS annulé avant l'envoi

## Performances et Limites

### Combien de requêtes API puis-je faire ?

- **Rate limit global :** 100 requêtes par minute
- **Rate limit par endpoint :** varie selon l'endpoint
- Si vous dépassez, vous recevrez un code HTTP 429

### Combien de destinataires en masse ?

- **Maximum par requête :** 100 destinataires
- Pour plus, faites plusieurs requêtes
- Les messages sont envoyés séquentiellement (~1 SMS toutes les 2-3s)

### Quelle est la vitesse d'envoi ?

Environ **1 SMS toutes les 2-3 secondes** pour éviter les blocages opérateur. Pour 1000 SMS, comptez environ 30-50 minutes.

### Puis-je augmenter la vitesse d'envoi ?

Oui, en connectant plusieurs téléphones Android :
- 1 device : ~1 SMS/2-3s
- 2 devices : ~2 SMS/2-3s
- 3 devices : ~3 SMS/2-3s

## Problèmes Courants

### Erreur "Device offline"

Votre téléphone Android n'est pas connecté. Vérifiez :
- Le téléphone est allumé
- L'application ZimSend est active
- La connexion Internet fonctionne
- Le device apparaît "online" dans le dashboard

### Erreur "Invalid API Key"

- Vérifiez que vous utilisez la bonne clé API
- Vérifiez qu'elle n'a pas été révoquée
- Vérifiez qu'il n'y a pas d'espaces avant/après

### SMS non délivré

Plusieurs raisons possibles :
- Numéro de téléphone invalide
- Destinataire hors réseau
- Crédit téléphone insuffisant
- Numéro blacklisté par l'opérateur

Vérifiez le champ `error` dans le webhook `sms.failed`.

### Erreur "Rate limit exceeded"

Vous envoyez trop de requêtes. Attendez 1 minute ou :
- Réduisez la fréquence de vos requêtes
- Utilisez l'envoi en masse pour grouper les SMS
- Contactez le support pour augmenter votre limite

## Support

### Comment contacter le support ?

- Email : support@zimsend.com
- Dashboard : Bouton "Support" en bas à droite
- Documentation : [docs.zimsend.com](https://docs.zimsend.com)

### Temps de réponse du support ?

- Demandes urgentes : < 2 heures (jours ouvrés)
- Demandes générales : < 24 heures
- Questions techniques : < 48 heures

### Y a-t-il une communauté ZimSend ?

Nous travaillons sur :
- Forum communautaire
- Discord/Slack pour les développeurs
- Exemples de code sur GitHub

Restez informé via notre newsletter !

## Prochaines étapes

- [Démarrage rapide](/guides/quickstart) - Envoyez votre premier SMS
- [Codes d'erreur](/errors) - Comprendre et gérer les erreurs
- [SDKs](/sdks/nodejs) - Utilisez nos wrappers
