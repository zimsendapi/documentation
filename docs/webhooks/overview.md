---
sidebar_position: 1
---

# Webhooks - Vue d'ensemble

Les webhooks vous permettent de recevoir des notifications HTTP en temps réel lorsque des événements se produisent sur votre compte ZimSend.

## Qu'est-ce qu'un webhook ?

Un webhook est une URL HTTP sur votre serveur que ZimSend appelle automatiquement lorsqu'un événement se produit. Par exemple, lorsqu'un SMS est délivré, nous envoyons une requête POST à votre URL de webhook avec les détails de l'événement.

### Pourquoi utiliser les webhooks ?

Les webhooks sont essentiels pour :

- **Suivre l'état des SMS en temps réel** sans avoir à interroger constamment notre API
- **Mettre à jour votre base de données** automatiquement quand un SMS est délivré
- **Déclencher des actions** basées sur des événements (ex: envoyer un email quand un SMS échoue)
- **Synchroniser vos systèmes** avec l'état réel de vos envois

## Événements disponibles

ZimSend envoie des webhooks pour les événements suivants :

| Événement | Description |
|-----------|-------------|
| `sms.sent` | Un SMS a été envoyé au réseau mobile |
| `sms.delivered` | Un SMS a été délivré au destinataire |
| `sms.failed` | Un SMS n'a pas pu être envoyé |
| `device.connected` | Un device Android s'est connecté |
| `device.disconnected` | Un device Android s'est déconnecté |

Consultez la page [Événements Webhooks](/webhooks/events) pour voir le format détaillé de chaque événement.

## Configuration

### Configurer un webhook global

Dans votre dashboard ZimSend :

1. Allez dans **Paramètres** → **Webhooks**
2. Cliquez sur **Ajouter un webhook**
3. Entrez votre URL de webhook (ex: `https://monapp.com/webhooks/zimsend`)
4. Sélectionnez les événements que vous souhaitez recevoir
5. Copiez le **Secret** généré (nécessaire pour vérifier la signature)
6. Cliquez sur **Enregistrer**

### Configurer un webhook par message

Vous pouvez également spécifier un webhook unique pour un message spécifique :

```bash
curl -X POST https://api.zimsend.com/v1/sms/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: votre_cle_api" \
  -H "X-Client-ID: votre_client_id" \
  -H "X-Device-ID: votre_device_id" \
  -d '{
    "to": "+33612345678",
    "message": "Bonjour !",
    "webhook_url": "https://monapp.com/webhooks/zimsend"
  }'
```

Le webhook par message prend la priorité sur le webhook global.

## Format des requêtes webhook

Toutes les requêtes webhook sont envoyées en **POST** avec :

- **Content-Type:** `application/json`
- **User-Agent:** `ZimSend-Webhook/1.0`
- **X-Webhook-Signature:** Signature HMAC pour vérifier l'authenticité

### Structure générale

```json
{
  "event": "sms.delivered",
  "timestamp": "2025-01-15T10:30:08Z",
  "data": {
    // Données spécifiques à l'événement
  }
}
```

## Vérifier la signature HMAC

Pour garantir que les webhooks proviennent bien de ZimSend, chaque requête inclut une signature HMAC dans le header `X-Webhook-Signature`.

### Calcul de la signature

La signature est calculée avec :

```
HMAC-SHA256(secret, request_body)
```

Où :
- `secret` est le secret de webhook fourni dans votre dashboard
- `request_body` est le corps brut de la requête (JSON)

### Exemples de vérification

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="programming-language">
  <TabItem value="nodejs" label="Node.js">
    ```javascript
    const crypto = require('crypto');
    const express = require('express');

    const WEBHOOK_SECRET = process.env.ZIMSEND_WEBHOOK_SECRET;

    app.post('/webhooks/zimsend', express.raw({type: 'application/json'}), (req, res) => {
      const signature = req.headers['x-webhook-signature'];
      const body = req.body;

      // Calculer la signature attendue
      const expectedSignature = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(body)
        .digest('hex');

      // Vérifier la signature
      if (signature !== expectedSignature) {
        console.error('Signature invalide');
        return res.status(401).send('Unauthorized');
      }

      // Signature valide, traiter l'événement
      const event = JSON.parse(body);
      console.log('Événement reçu:', event.event);

      // Traiter l'événement selon son type
      switch(event.event) {
        case 'sms.delivered':
          handleSMSDelivered(event.data);
          break;
        case 'sms.failed':
          handleSMSFailed(event.data);
          break;
        // ... autres événements
      }

      res.status(200).send('OK');
    });

    function handleSMSDelivered(data) {
      console.log(`SMS ${data.message_id} délivré à ${data.to}`);
      // Mettre à jour votre base de données, etc.
    }

    function handleSMSFailed(data) {
      console.log(`SMS ${data.message_id} échoué: ${data.error}`);
      // Alerter votre équipe, réessayer, etc.
    }
    ```
  </TabItem>
  <TabItem value="python" label="Python">
    ```python
    import hmac
    import hashlib
    from flask import Flask, request, abort

    app = Flask(__name__)

    WEBHOOK_SECRET = os.getenv('ZIMSEND_WEBHOOK_SECRET')

    @app.route('/webhooks/zimsend', methods=['POST'])
    def webhook():
        signature = request.headers.get('X-Webhook-Signature')
        body = request.get_data()

        # Calculer la signature attendue
        expected_signature = hmac.new(
            WEBHOOK_SECRET.encode(),
            body,
            hashlib.sha256
        ).hexdigest()

        # Vérifier la signature
        if signature != expected_signature:
            print('Signature invalide')
            abort(401)

        # Signature valide, traiter l'événement
        event = request.json
        print(f"Événement reçu: {event['event']}")

        # Traiter l'événement selon son type
        if event['event'] == 'sms.delivered':
            handle_sms_delivered(event['data'])
        elif event['event'] == 'sms.failed':
            handle_sms_failed(event['data'])

        return 'OK', 200

    def handle_sms_delivered(data):
        print(f"SMS {data['message_id']} délivré à {data['to']}")
        # Mettre à jour votre base de données, etc.

    def handle_sms_failed(data):
        print(f"SMS {data['message_id']} échoué: {data['error']}")
        # Alerter votre équipe, réessayer, etc.

    if __name__ == '__main__':
        app.run()
    ```
  </TabItem>
  <TabItem value="php" label="PHP">
    ```php
    <?php

    $webhookSecret = getenv('ZIMSEND_WEBHOOK_SECRET');

    // Récupérer le corps brut de la requête
    $body = file_get_contents('php://input');
    $signature = $_SERVER['HTTP_X_WEBHOOK_SIGNATURE'] ?? '';

    // Calculer la signature attendue
    $expectedSignature = hash_hmac('sha256', $body, $webhookSecret);

    // Vérifier la signature
    if ($signature !== $expectedSignature) {
        http_response_code(401);
        exit('Unauthorized');
    }

    // Signature valide, traiter l'événement
    $event = json_decode($body, true);
    error_log("Événement reçu: " . $event['event']);

    // Traiter l'événement selon son type
    switch($event['event']) {
        case 'sms.delivered':
            handleSMSDelivered($event['data']);
            break;
        case 'sms.failed':
            handleSMSFailed($event['data']);
            break;
    }

    http_response_code(200);
    echo 'OK';

    function handleSMSDelivered($data) {
        error_log("SMS {$data['message_id']} délivré à {$data['to']}");
        // Mettre à jour votre base de données, etc.
    }

    function handleSMSFailed($data) {
        error_log("SMS {$data['message_id']} échoué: {$data['error']}");
        // Alerter votre équipe, réessayer, etc.
    }
    ?>
    ```
  </TabItem>
</Tabs>

## Bonnes pratiques

### Répondre rapidement

Votre endpoint webhook doit répondre rapidement (< 5 secondes) avec un code HTTP 200. Si le traitement est long, répondez 200 immédiatement et traitez l'événement de manière asynchrone.

```javascript
// ✅ BON
app.post('/webhooks/zimsend', async (req, res) => {
  // Vérifier la signature
  if (!verifySignature(req)) {
    return res.status(401).send('Unauthorized');
  }

  // Répondre immédiatement
  res.status(200).send('OK');

  // Traiter de manière asynchrone
  processWebhookAsync(req.body);
});

// ❌ MAUVAIS
app.post('/webhooks/zimsend', async (req, res) => {
  // Ne pas faire de traitement long avant de répondre
  await updateDatabase(req.body);
  await sendEmail(req.body);
  res.status(200).send('OK'); // Trop tard !
});
```

### Gérer l'idempotence

Le même événement peut être envoyé plusieurs fois. Stockez les `event_id` déjà traités pour éviter les doublons.

```javascript
const processedEvents = new Set();

function processWebhook(event) {
  // Vérifier si déjà traité
  if (processedEvents.has(event.event_id)) {
    console.log('Événement déjà traité, ignoré');
    return;
  }

  // Traiter l'événement
  handleEvent(event);

  // Marquer comme traité
  processedEvents.add(event.event_id);
}
```

### Utiliser HTTPS

Votre URL de webhook **doit** utiliser HTTPS. Les URL HTTP seront rejetées.

### Logger les événements

Conservez un log des webhooks reçus pour le debugging :

```javascript
app.post('/webhooks/zimsend', (req, res) => {
  // Logger l'événement
  console.log('[Webhook]', {
    event: req.body.event,
    timestamp: req.body.timestamp,
    data: req.body.data
  });

  // Traiter...
});
```

## Retry logic

Si votre endpoint webhook retourne une erreur (code HTTP 4xx ou 5xx) ou ne répond pas dans les 5 secondes, ZimSend réessaiera automatiquement :

- **1ère tentative :** Immédiate
- **2ème tentative :** Après 1 minute
- **3ème tentative :** Après 5 minutes

Après 3 échecs, l'événement est abandonné et vous recevrez une alerte par email.

## Tester vos webhooks

### Utiliser l'outil de test du dashboard

Dans votre dashboard :

1. Allez dans **Webhooks**
2. Cliquez sur **Tester** à côté de votre webhook
3. Sélectionnez un type d'événement
4. Cliquez sur **Envoyer un événement test**

### Utiliser un service de capture

Pour le développement local, utilisez des services comme :

- [ngrok](https://ngrok.com) - Tunneling HTTP local
- [webhook.site](https://webhook.site) - Capture et inspection de webhooks
- [requestbin.com](https://requestbin.com) - Inspection de requêtes HTTP

Exemple avec ngrok :

```bash
# Démarrer ngrok
ngrok http 3000

# Utiliser l'URL fournie comme webhook
https://abc123.ngrok.io/webhooks/zimsend
```

### Envoyer un événement test avec curl

```bash
curl -X POST https://votreapp.com/webhooks/zimsend \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: votre_signature_test" \
  -d '{
    "event": "sms.delivered",
    "event_id": "evt_test123",
    "timestamp": "2025-01-15T10:30:08Z",
    "data": {
      "message_id": "msg_test123",
      "status": "delivered",
      "to": "+33612345678",
      "delivered_at": "2025-01-15T10:30:08Z"
    }
  }'
```

## Debugging

### Webhooks non reçus

Si vous ne recevez pas de webhooks :

1. **Vérifiez l'URL** - Assurez-vous qu'elle est accessible publiquement
2. **Vérifiez HTTPS** - L'URL doit utiliser HTTPS
3. **Vérifiez les logs** - Consultez les logs de webhook dans le dashboard
4. **Testez manuellement** - Utilisez l'outil de test du dashboard

### Signature invalide

Si la vérification de signature échoue :

1. **Vérifiez le secret** - Assurez-vous d'utiliser le bon secret
2. **Utilisez le corps brut** - Ne parsez pas le JSON avant de vérifier
3. **Vérifiez l'encoding** - Utilisez UTF-8

### Exemple de debugging complet

```javascript
app.post('/webhooks/zimsend', express.raw({type: 'application/json'}), (req, res) => {
  console.log('[Webhook Debug]', {
    headers: req.headers,
    body_length: req.body.length,
    signature: req.headers['x-webhook-signature']
  });

  const signature = req.headers['x-webhook-signature'];
  const body = req.body;

  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(body)
    .digest('hex');

  console.log('[Signature Debug]', {
    received: signature,
    expected: expectedSignature,
    match: signature === expectedSignature
  });

  if (signature !== expectedSignature) {
    console.error('[Webhook] Signature invalide');
    return res.status(401).send('Unauthorized');
  }

  const event = JSON.parse(body);
  console.log('[Webhook] Événement valide:', event.event);

  res.status(200).send('OK');
});
```

## Prochaines étapes

- [Événements Webhooks](/webhooks/events) - Format détaillé de chaque événement
- [Suivre vos SMS](/guides/tracking) - Alternative aux webhooks
- [Codes d'erreur](/errors) - Gérer les erreurs de webhook
