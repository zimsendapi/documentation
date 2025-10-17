---
sidebar_position: 2
---

# Événements Webhooks

Cette page détaille le format de chaque type d'événement webhook envoyé par ZimSend.

## Structure générale

Tous les webhooks suivent cette structure de base :

```json
{
  "event": "nom_de_levenement",
  "event_id": "evt_unique_identifier",
  "timestamp": "2025-01-15T10:30:08Z",
  "data": {
    // Données spécifiques à l'événement
  }
}
```

| Champ | Type | Description |
|-------|------|-------------|
| `event` | string | Type d'événement |
| `event_id` | string | Identifiant unique de l'événement (pour éviter les doublons) |
| `timestamp` | string | Date/heure de l'événement (ISO 8601) |
| `data` | object | Données spécifiques à l'événement |

## Événements SMS

### sms.sent

Déclenché lorsqu'un SMS est envoyé au réseau mobile.

```json
{
  "event": "sms.sent",
  "event_id": "evt_abc123def456",
  "timestamp": "2025-01-15T10:30:05Z",
  "data": {
    "message_id": "msg_1234567890abcdef",
    "status": "sent",
    "to": "+33612345678",
    "message": "Bonjour, votre commande a été expédiée",
    "device_id": "device_xyz123",
    "sent_at": "2025-01-15T10:30:05Z",
    "metadata": {
      "order_id": "order_12345",
      "user_id": "user_789"
    }
  }
}
```

**Champs du data :**

| Champ | Type | Description |
|-------|------|-------------|
| `message_id` | string | Identifiant unique du SMS |
| `status` | string | Statut actuel (`sent`) |
| `to` | string | Numéro du destinataire |
| `message` | string | Contenu du SMS |
| `device_id` | string | Device utilisé pour l'envoi |
| `sent_at` | string | Date/heure d'envoi |
| `metadata` | object | Métadonnées personnalisées (si fournies) |

### sms.delivered

Déclenché lorsqu'un SMS est délivré au destinataire.

```json
{
  "event": "sms.delivered",
  "event_id": "evt_def456ghi789",
  "timestamp": "2025-01-15T10:30:08Z",
  "data": {
    "message_id": "msg_1234567890abcdef",
    "status": "delivered",
    "to": "+33612345678",
    "message": "Bonjour, votre commande a été expédiée",
    "device_id": "device_xyz123",
    "sent_at": "2025-01-15T10:30:05Z",
    "delivered_at": "2025-01-15T10:30:08Z",
    "metadata": {
      "order_id": "order_12345",
      "user_id": "user_789"
    }
  }
}
```

**Champs du data :**

| Champ | Type | Description |
|-------|------|-------------|
| `message_id` | string | Identifiant unique du SMS |
| `status` | string | Statut actuel (`delivered`) |
| `to` | string | Numéro du destinataire |
| `message` | string | Contenu du SMS |
| `device_id` | string | Device utilisé pour l'envoi |
| `sent_at` | string | Date/heure d'envoi |
| `delivered_at` | string | Date/heure de délivrance |
| `metadata` | object | Métadonnées personnalisées (si fournies) |

### sms.failed

Déclenché lorsqu'un SMS n'a pas pu être envoyé.

```json
{
  "event": "sms.failed",
  "event_id": "evt_ghi789jkl012",
  "timestamp": "2025-01-15T10:30:10Z",
  "data": {
    "message_id": "msg_1234567890abcdef",
    "status": "failed",
    "to": "+33612345678",
    "message": "Bonjour, votre commande a été expédiée",
    "device_id": "device_xyz123",
    "error": {
      "code": "NETWORK_ERROR",
      "message": "Impossible de joindre le réseau mobile"
    },
    "failed_at": "2025-01-15T10:30:10Z",
    "metadata": {
      "order_id": "order_12345",
      "user_id": "user_789"
    }
  }
}
```

**Champs du data :**

| Champ | Type | Description |
|-------|------|-------------|
| `message_id` | string | Identifiant unique du SMS |
| `status` | string | Statut actuel (`failed`) |
| `to` | string | Numéro du destinataire |
| `message` | string | Contenu du SMS |
| `device_id` | string | Device utilisé pour l'envoi |
| `error` | object | Détails de l'erreur |
| `error.code` | string | Code d'erreur |
| `error.message` | string | Message d'erreur |
| `failed_at` | string | Date/heure de l'échec |
| `metadata` | object | Métadonnées personnalisées (si fournies) |

**Codes d'erreur possibles :**

| Code | Description |
|------|-------------|
| `NETWORK_ERROR` | Erreur réseau mobile |
| `INVALID_NUMBER` | Numéro de téléphone invalide |
| `NO_CREDIT` | Crédit téléphone insuffisant |
| `BLOCKED_NUMBER` | Numéro bloqué ou blacklisté |
| `DEVICE_ERROR` | Erreur sur le device Android |
| `TIMEOUT` | Timeout lors de l'envoi |

## Événements Device

### device.connected

Déclenché lorsqu'un device Android se connecte.

```json
{
  "event": "device.connected",
  "event_id": "evt_jkl012mno345",
  "timestamp": "2025-01-15T09:00:00Z",
  "data": {
    "device_id": "device_xyz123",
    "device_name": "Samsung Galaxy S21",
    "phone_number": "+33612345678",
    "android_version": "12",
    "app_version": "1.2.3",
    "connected_at": "2025-01-15T09:00:00Z",
    "ip_address": "192.168.1.100"
  }
}
```

**Champs du data :**

| Champ | Type | Description |
|-------|------|-------------|
| `device_id` | string | Identifiant unique du device |
| `device_name` | string | Nom du device (modèle) |
| `phone_number` | string | Numéro de téléphone de la SIM |
| `android_version` | string | Version Android |
| `app_version` | string | Version de l'app ZimSend |
| `connected_at` | string | Date/heure de connexion |
| `ip_address` | string | Adresse IP du device |

### device.disconnected

Déclenché lorsqu'un device Android se déconnecte.

```json
{
  "event": "device.disconnected",
  "event_id": "evt_mno345pqr678",
  "timestamp": "2025-01-15T18:30:00Z",
  "data": {
    "device_id": "device_xyz123",
    "device_name": "Samsung Galaxy S21",
    "phone_number": "+33612345678",
    "disconnected_at": "2025-01-15T18:30:00Z",
    "reason": "CONNECTION_LOST",
    "last_seen": "2025-01-15T18:29:55Z"
  }
}
```

**Champs du data :**

| Champ | Type | Description |
|-------|------|-------------|
| `device_id` | string | Identifiant unique du device |
| `device_name` | string | Nom du device (modèle) |
| `phone_number` | string | Numéro de téléphone de la SIM |
| `disconnected_at` | string | Date/heure de déconnexion |
| `reason` | string | Raison de la déconnexion |
| `last_seen` | string | Dernière activité du device |

**Raisons de déconnexion possibles :**

| Raison | Description |
|--------|-------------|
| `CONNECTION_LOST` | Perte de connexion Internet |
| `USER_LOGOUT` | Déconnexion manuelle par l'utilisateur |
| `APP_CLOSED` | Application fermée |
| `BATTERY_SAVER` | Mode économie d'énergie activé |
| `UNKNOWN` | Raison inconnue |

## Exemples d'implémentation

### Node.js - Traiter tous les événements

```javascript
const express = require('express');
const crypto = require('crypto');

const app = express();
const WEBHOOK_SECRET = process.env.ZIMSEND_WEBHOOK_SECRET;

app.post('/webhooks/zimsend', express.raw({type: 'application/json'}), (req, res) => {
  // Vérifier la signature
  const signature = req.headers['x-webhook-signature'];
  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(req.body)
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(401).send('Unauthorized');
  }

  // Parser l'événement
  const event = JSON.parse(req.body);

  // Répondre immédiatement
  res.status(200).send('OK');

  // Traiter selon le type d'événement
  switch(event.event) {
    case 'sms.sent':
      handleSMSSent(event.data);
      break;

    case 'sms.delivered':
      handleSMSDelivered(event.data);
      break;

    case 'sms.failed':
      handleSMSFailed(event.data);
      break;

    case 'device.connected':
      handleDeviceConnected(event.data);
      break;

    case 'device.disconnected':
      handleDeviceDisconnected(event.data);
      break;

    default:
      console.log('Événement inconnu:', event.event);
  }
});

function handleSMSSent(data) {
  console.log(`SMS ${data.message_id} envoyé à ${data.to}`);

  // Mettre à jour la base de données
  db.updateSMS(data.message_id, {
    status: 'sent',
    sent_at: data.sent_at
  });
}

function handleSMSDelivered(data) {
  console.log(`SMS ${data.message_id} délivré à ${data.to}`);

  // Mettre à jour la base de données
  db.updateSMS(data.message_id, {
    status: 'delivered',
    delivered_at: data.delivered_at
  });

  // Notifier l'utilisateur
  if (data.metadata?.user_id) {
    notifyUser(data.metadata.user_id, 'Votre message a été délivré');
  }
}

function handleSMSFailed(data) {
  console.error(`SMS ${data.message_id} échoué:`, data.error);

  // Mettre à jour la base de données
  db.updateSMS(data.message_id, {
    status: 'failed',
    error: data.error,
    failed_at: data.failed_at
  });

  // Alerter l'équipe
  alertTeam(`SMS échoué: ${data.error.message}`);

  // Réessayer avec un autre device si possible
  if (data.error.code === 'DEVICE_ERROR') {
    retryWithDifferentDevice(data);
  }
}

function handleDeviceConnected(data) {
  console.log(`Device ${data.device_name} connecté`);

  // Mettre à jour le statut du device
  db.updateDevice(data.device_id, {
    status: 'online',
    connected_at: data.connected_at,
    ip_address: data.ip_address
  });

  // Notifier l'équipe
  notifyTeam(`Device ${data.device_name} est maintenant en ligne`);
}

function handleDeviceDisconnected(data) {
  console.warn(`Device ${data.device_name} déconnecté: ${data.reason}`);

  // Mettre à jour le statut du device
  db.updateDevice(data.device_id, {
    status: 'offline',
    disconnected_at: data.disconnected_at,
    disconnect_reason: data.reason
  });

  // Alerter si déconnexion inattendue
  if (data.reason === 'CONNECTION_LOST') {
    alertTeam(`Device ${data.device_name} a perdu la connexion`);
  }
}

app.listen(3000, () => {
  console.log('Webhook server listening on port 3000');
});
```

### Python - Traiter avec une queue asynchrone

```python
from flask import Flask, request, abort
import hmac
import hashlib
import json
from celery import Celery

app = Flask(__name__)
celery = Celery('tasks', broker='redis://localhost:6379')

WEBHOOK_SECRET = os.getenv('ZIMSEND_WEBHOOK_SECRET')

@app.route('/webhooks/zimsend', methods=['POST'])
def webhook():
    # Vérifier la signature
    signature = request.headers.get('X-Webhook-Signature')
    body = request.get_data()

    expected_signature = hmac.new(
        WEBHOOK_SECRET.encode(),
        body,
        hashlib.sha256
    ).hexdigest()

    if signature != expected_signature:
        abort(401)

    # Parser l'événement
    event = request.json

    # Répondre immédiatement
    response = ('OK', 200)

    # Traiter de manière asynchrone avec Celery
    process_webhook.delay(event)

    return response

@celery.task
def process_webhook(event):
    """Traiter l'événement de manière asynchrone"""
    event_type = event['event']
    data = event['data']

    handlers = {
        'sms.sent': handle_sms_sent,
        'sms.delivered': handle_sms_delivered,
        'sms.failed': handle_sms_failed,
        'device.connected': handle_device_connected,
        'device.disconnected': handle_device_disconnected
    }

    handler = handlers.get(event_type)
    if handler:
        handler(data)
    else:
        print(f"Événement inconnu: {event_type}")

def handle_sms_sent(data):
    print(f"SMS {data['message_id']} envoyé à {data['to']}")
    # Mettre à jour la base de données
    db.update_sms(data['message_id'], {
        'status': 'sent',
        'sent_at': data['sent_at']
    })

def handle_sms_delivered(data):
    print(f"SMS {data['message_id']} délivré à {data['to']}")
    # Mettre à jour la base de données
    db.update_sms(data['message_id'], {
        'status': 'delivered',
        'delivered_at': data['delivered_at']
    })

def handle_sms_failed(data):
    print(f"SMS {data['message_id']} échoué: {data['error']}")
    # Alerter l'équipe
    alert_team(f"SMS échoué: {data['error']['message']}")

def handle_device_connected(data):
    print(f"Device {data['device_name']} connecté")
    db.update_device(data['device_id'], {'status': 'online'})

def handle_device_disconnected(data):
    print(f"Device {data['device_name']} déconnecté: {data['reason']}")
    db.update_device(data['device_id'], {'status': 'offline'})

if __name__ == '__main__':
    app.run()
```

### PHP - Traiter avec une queue Redis

```php
<?php

require 'vendor/autoload.php';

use Predis\Client as RedisClient;

$webhookSecret = getenv('ZIMSEND_WEBHOOK_SECRET');
$redis = new RedisClient();

// Vérifier la signature
$body = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_WEBHOOK_SIGNATURE'] ?? '';

$expectedSignature = hash_hmac('sha256', $body, $webhookSecret);

if ($signature !== $expectedSignature) {
    http_response_code(401);
    exit('Unauthorized');
}

// Parser l'événement
$event = json_decode($body, true);

// Répondre immédiatement
http_response_code(200);
echo 'OK';

// Ajouter à la queue Redis pour traitement asynchrone
$redis->rpush('zimsend_webhooks', json_encode($event));

// Le worker Redis traitera les événements
// worker.php:
/*
while (true) {
    $eventJson = $redis->blpop('zimsend_webhooks', 0)[1];
    $event = json_decode($eventJson, true);

    switch($event['event']) {
        case 'sms.sent':
            handleSMSSent($event['data']);
            break;
        case 'sms.delivered':
            handleSMSDelivered($event['data']);
            break;
        case 'sms.failed':
            handleSMSFailed($event['data']);
            break;
        case 'device.connected':
            handleDeviceConnected($event['data']);
            break;
        case 'device.disconnected':
            handleDeviceDisconnected($event['data']);
            break;
    }
}
*/
?>
```

## Retry Logic

Si votre endpoint webhook échoue, ZimSend réessaiera automatiquement :

- **1ère tentative :** Immédiate
- **2ème tentative :** Après 1 minute
- **3ème tentative :** Après 5 minutes

Après 3 échecs, l'événement est abandonné.

**Important :** Implémentez l'idempotence en vérifiant `event_id` pour éviter de traiter deux fois le même événement.

## Prochaines étapes

- [Vue d'ensemble des Webhooks](/webhooks/overview) - Configuration et bonnes pratiques
- [Codes d'erreur](/errors) - Comprendre les erreurs
