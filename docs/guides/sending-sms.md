---
sidebar_position: 3
---

# Envoyer des SMS

ZimSend propose plusieurs méthodes pour envoyer des SMS, de l'envoi simple à l'envoi en masse avec options avancées.

## Envoi SMS simple

L'endpoint le plus basique pour envoyer un SMS à un destinataire.

### Endpoint

```
POST https://api.zimsend.com/v1/sms/send
```

### Paramètres requis

| Paramètre | Type | Description |
|-----------|------|-------------|
| `to` | string | Numéro du destinataire au format international (ex: +33612345678) |
| `message` | string | Contenu du SMS (max 1600 caractères) |

### Paramètres optionnels

| Paramètre | Type | Description |
|-----------|------|-------------|
| `priority` | integer | Priorité d'envoi de 1 à 5 : 1=très haute (urgent), 2=haute, 3=normale (défaut), 4=basse, 5=très basse |
| `webhook_url` | string | URL de callback pour recevoir les mises à jour de statut |
| `metadata` | object | Données personnalisées attachées au message (max 1KB) |
| `scheduled_at` | string | Date/heure d'envoi programmé (format ISO 8601) |

### Exemple de requête

```bash
curl -X POST https://api.zimsend.com/v1/sms/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: votre_cle_api" \
  -H "X-Client-ID: votre_client_id" \
  -H "X-Device-ID: votre_device_id" \
  -d '{
    "to": "+33612345678",
    "message": "Bonjour, votre commande #12345 a été expédiée !"
  }'
```

### Réponse réussie

```json
{
  "success": true,
  "message_id": "msg_1234567890abcdef",
  "status": "queued",
  "to": "+33612345678",
  "queued_at": "2025-01-15T10:30:00Z",
  "estimated_delivery": "2025-01-15T10:30:05Z"
}
```

## Envoi avec options avancées

### Priorité d'envoi

Les messages haute priorité sont traités en premier dans la file d'attente.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="programming-language">
  <TabItem value="curl" label="cURL">
    ```bash
    curl -X POST https://api.zimsend.com/v1/sms/send \
      -H "Content-Type: application/json" \
      -H "X-API-Key: votre_cle_api" \
      -H "X-Client-ID: votre_client_id" \
      -H "X-Device-ID: votre_device_id" \
      -d '{
        "to": "+33612345678",
        "message": "Code de vérification urgent : 123456",
        "priority": 1
      }'
    ```
  </TabItem>
  <TabItem value="nodejs" label="Node.js">
    ```javascript
    await axios.post('https://api.zimsend.com/v1/sms/send', {
      to: '+33612345678',
      message: 'Code de vérification urgent : 123456',
      priority: 1
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'votre_cle_api',
        'X-Client-ID': 'votre_client_id',
        'X-Device-ID': 'votre_device_id'
      }
    });
    ```
  </TabItem>
  <TabItem value="python" label="Python">
    ```python
    import requests

    response = requests.post(
        'https://api.zimsend.com/v1/sms/send',
        json={
            'to': '+33612345678',
            'message': 'Code de vérification urgent : 123456',
            'priority': 1
        },
        headers={
            'Content-Type': 'application/json',
            'X-API-Key': 'votre_cle_api',
            'X-Client-ID': 'votre_client_id',
            'X-Device-ID': 'votre_device_id'
        }
    )
    ```
  </TabItem>
  <TabItem value="php" label="PHP">
    ```php
    <?php
    $ch = curl_init('https://api.zimsend.com/v1/sms/send');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'to' => '+33612345678',
        'message' => 'Code de vérification urgent : 123456',
        'priority' => 1
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'X-API-Key: votre_cle_api',
        'X-Client-ID: votre_client_id',
        'X-Device-ID: votre_device_id'
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);
    ?>
    ```
  </TabItem>
</Tabs>

**Utilisations recommandées :**
- **1 (très haute)** : Codes OTP, alertes de sécurité critiques, urgences
- **2 (haute)** : Notifications importantes, alertes urgentes
- **3 (normale)** : Notifications transactionnelles, confirmations (défaut)
- **4 (basse)** : Rappels non urgents
- **5 (très basse)** : Marketing, newsletters

### Webhook de suivi

Recevez une notification HTTP lorsque votre SMS change de statut :

```bash
curl -X POST https://api.zimsend.com/v1/sms/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: votre_cle_api" \
  -H "X-Client-ID: votre_client_id" \
  -H "X-Device-ID: votre_device_id" \
  -d '{
    "to": "+33612345678",
    "message": "Votre colis sera livré demain",
    "webhook_url": "https://monapp.com/webhooks/sms"
  }'
```

Vous recevrez des notifications pour les événements : `sent`, `delivered`, `failed`.

Voir la section [Webhooks](/webhooks/overview) pour plus de détails.

### Métadonnées personnalisées

Attachez des données personnalisées à vos messages pour les retrouver facilement :

```bash
curl -X POST https://api.zimsend.com/v1/sms/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: votre_cle_api" \
  -H "X-Client-ID: votre_client_id" \
  -H "X-Device-ID: votre_device_id" \
  -d '{
    "to": "+33612345678",
    "message": "Votre rendez-vous est confirmé",
    "metadata": {
      "user_id": "user_123",
      "appointment_id": "apt_456",
      "type": "reminder"
    }
  }'
```

Les métadonnées sont retournées dans les webhooks et l'historique des messages.

### Envoi programmé

Programmez l'envoi d'un SMS à une date et heure précises :

```bash
curl -X POST https://api.zimsend.com/v1/sms/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: votre_cle_api" \
  -H "X-Client-ID: votre_client_id" \
  -H "X-Device-ID: votre_device_id" \
  -d '{
    "to": "+33612345678",
    "message": "Rappel : rendez-vous demain à 14h",
    "scheduled_at": "2025-01-16T12:00:00Z"
  }'
```

**Notes :**
- La date doit être au format ISO 8601 (UTC)
- Vous pouvez programmer jusqu'à 30 jours à l'avance
- Vous pouvez annuler un message programmé avant son envoi

## Envoi en masse

Pour envoyer le même message à plusieurs destinataires, utilisez l'endpoint d'envoi en masse.

### Endpoint

```
POST https://api.zimsend.com/v1/sms/send-bulk
```

### Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `recipients` | array | Tableau de numéros au format international |
| `message` | string | Contenu du SMS (max 1600 caractères) |
| `priority` | integer | Priorité d'envoi de 1 à 5 (optionnel) |
| `webhook_url` | string | URL de callback (optionnel) |
| `metadata` | object | Données personnalisées (optionnel) |

### Exemple

```bash
curl -X POST https://api.zimsend.com/v1/sms/send-bulk \
  -H "Content-Type: application/json" \
  -H "X-API-Key: votre_cle_api" \
  -H "X-Client-ID: votre_client_id" \
  -H "X-Device-ID: votre_device_id" \
  -d '{
    "recipients": [
      "+33612345678",
      "+33698765432",
      "+33687654321"
    ],
    "message": "Offre spéciale : -20% sur tout le site ce week-end !",
    "priority": 5
  }'
```

### Réponse

```json
{
  "success": true,
  "batch_id": "batch_abc123def456",
  "total_recipients": 3,
  "messages": [
    {
      "message_id": "msg_001",
      "to": "+33612345678",
      "status": "queued"
    },
    {
      "message_id": "msg_002",
      "to": "+33698765432",
      "status": "queued"
    },
    {
      "message_id": "msg_003",
      "to": "+33687654321",
      "status": "queued"
    }
  ],
  "queued_at": "2025-01-15T10:30:00Z"
}
```

### Limites d'envoi en masse

- Maximum 100 destinataires par requête
- Pour envoyer à plus de destinataires, effectuez plusieurs requêtes
- Les messages sont mis en file d'attente et envoyés séquentiellement
- Vitesse d'envoi : environ 1 SMS toutes les 2-3 secondes

## Envoi personnalisé en masse

Pour envoyer des messages personnalisés à plusieurs destinataires :

### Endpoint

```
POST https://api.zimsend.com/v1/sms/send-bulk-personalized
```

### Exemple

```bash
curl -X POST https://api.zimsend.com/v1/sms/send-bulk-personalized \
  -H "Content-Type: application/json" \
  -H "X-API-Key: votre_cle_api" \
  -H "X-Client-ID: votre_client_id" \
  -H "X-Device-ID: votre_device_id" \
  -d '{
    "messages": [
      {
        "to": "+33612345678",
        "message": "Bonjour Jean, votre commande #12345 est prête",
        "metadata": {"user_id": "user_123"}
      },
      {
        "to": "+33698765432",
        "message": "Bonjour Marie, votre commande #12346 est prête",
        "metadata": {"user_id": "user_124"}
      }
    ]
  }'
```

## Exemples d'intégration

<Tabs groupId="programming-language">
  <TabItem value="nodejs" label="Node.js">
    ```javascript
    const axios = require('axios');

    class ZimSendSMS {
      constructor(apiKey, clientId, deviceId) {
        this.apiKey = apiKey;
        this.clientId = clientId;
        this.deviceId = deviceId;
        this.baseURL = 'https://api.zimsend.com/v1';
      }

      async sendSMS(to, message, options = {}) {
        try {
          const response = await axios.post(
            `${this.baseURL}/sms/send`,
            {
              to,
              message,
              ...options
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'X-API-Key': this.apiKey,
                'X-Client-ID': this.clientId,
                'X-Device-ID': this.deviceId
              }
            }
          );
          return response.data;
        } catch (error) {
          throw error.response.data;
        }
      }

      async sendBulkSMS(recipients, message, options = {}) {
        try {
          const response = await axios.post(
            `${this.baseURL}/sms/send-bulk`,
            {
              recipients,
              message,
              ...options
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'X-API-Key': this.apiKey,
                'X-Client-ID': this.clientId,
                'X-Device-ID': this.deviceId
              }
            }
          );
          return response.data;
        } catch (error) {
          throw error.response.data;
        }
      }
    }

    // Utilisation
    const sms = new ZimSendSMS(
      process.env.ZIMSEND_API_KEY,
      process.env.ZIMSEND_CLIENT_ID,
      process.env.ZIMSEND_DEVICE_ID
    );

    // Envoi simple
    sms.sendSMS('+33612345678', 'Bonjour !')
      .then(result => console.log('SMS envoyé:', result))
      .catch(error => console.error('Erreur:', error));

    // Envoi avec options
    sms.sendSMS('+33612345678', 'Code OTP: 123456', {
      priority: 1,
      webhook_url: 'https://monapp.com/webhooks/sms',
      metadata: { type: 'otp' }
    })
      .then(result => console.log('SMS envoyé:', result))
      .catch(error => console.error('Erreur:', error));

    // Envoi en masse
    sms.sendBulkSMS(
      ['+33612345678', '+33698765432'],
      'Promotion du jour !'
    )
      .then(result => console.log('SMS envoyés:', result))
      .catch(error => console.error('Erreur:', error));
    ```
  </TabItem>
  <TabItem value="python" label="Python">
    ```python
    import requests
    from typing import List, Dict, Optional

    class ZimSendSMS:
        def __init__(self, api_key: str, client_id: str, device_id: str):
            self.api_key = api_key
            self.client_id = client_id
            self.device_id = device_id
            self.base_url = 'https://api.zimsend.com/v1'

        def _get_headers(self) -> Dict[str, str]:
            return {
                'Content-Type': 'application/json',
                'X-API-Key': self.api_key,
                'X-Client-ID': self.client_id,
                'X-Device-ID': self.device_id
            }

        def send_sms(self, to: str, message: str, **options) -> Dict:
            """Envoie un SMS simple"""
            url = f'{self.base_url}/sms/send'
            data = {
                'to': to,
                'message': message,
                **options
            }
            response = requests.post(url, json=data, headers=self._get_headers())
            return response.json()

        def send_bulk_sms(self, recipients: List[str], message: str, **options) -> Dict:
            """Envoie un SMS en masse"""
            url = f'{self.base_url}/sms/send-bulk'
            data = {
                'recipients': recipients,
                'message': message,
                **options
            }
            response = requests.post(url, json=data, headers=self._get_headers())
            return response.json()

    # Utilisation
    import os

    sms = ZimSendSMS(
        os.getenv('ZIMSEND_API_KEY'),
        os.getenv('ZIMSEND_CLIENT_ID'),
        os.getenv('ZIMSEND_DEVICE_ID')
    )

    # Envoi simple
    result = sms.send_sms('+33612345678', 'Bonjour !')
    print(f'SMS envoyé: {result}')

    # Envoi avec options
    result = sms.send_sms(
        '+33612345678',
        'Code OTP: 123456',
        priority=1,
        webhook_url='https://monapp.com/webhooks/sms',
        metadata={'type': 'otp'}
    )
    print(f'SMS envoyé: {result}')

    # Envoi en masse
    result = sms.send_bulk_sms(
        ['+33612345678', '+33698765432'],
        'Promotion du jour !'
    )
    print(f'SMS envoyés: {result}')
    ```
  </TabItem>
  <TabItem value="php" label="PHP">
    ```php
    <?php

    class ZimSendSMS {
        private $apiKey;
        private $clientId;
        private $deviceId;
        private $baseURL = 'https://api.zimsend.com/v1';

        public function __construct($apiKey, $clientId, $deviceId) {
            $this->apiKey = $apiKey;
            $this->clientId = $clientId;
            $this->deviceId = $deviceId;
        }

        private function getHeaders() {
            return [
                'Content-Type: application/json',
                'X-API-Key: ' . $this->apiKey,
                'X-Client-ID: ' . $this->clientId,
                'X-Device-ID: ' . $this->deviceId
            ];
        }

        public function sendSMS($to, $message, $options = []) {
            $url = $this->baseURL . '/sms/send';
            $data = array_merge([
                'to' => $to,
                'message' => $message
            ], $options);

            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($ch, CURLOPT_HTTPHEADER, $this->getHeaders());
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

            $response = curl_exec($ch);
            curl_close($ch);

            return json_decode($response, true);
        }

        public function sendBulkSMS($recipients, $message, $options = []) {
            $url = $this->baseURL . '/sms/send-bulk';
            $data = array_merge([
                'recipients' => $recipients,
                'message' => $message
            ], $options);

            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($ch, CURLOPT_HTTPHEADER, $this->getHeaders());
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

            $response = curl_exec($ch);
            curl_close($ch);

            return json_decode($response, true);
        }
    }

    // Utilisation
    $sms = new ZimSendSMS(
        getenv('ZIMSEND_API_KEY'),
        getenv('ZIMSEND_CLIENT_ID'),
        getenv('ZIMSEND_DEVICE_ID')
    );

    // Envoi simple
    $result = $sms->sendSMS('+33612345678', 'Bonjour !');
    print_r($result);

    // Envoi avec options
    $result = $sms->sendSMS('+33612345678', 'Code OTP: 123456', [
        'priority' => 1,
        'webhook_url' => 'https://monapp.com/webhooks/sms',
        'metadata' => ['type' => 'otp']
    ]);
    print_r($result);

    // Envoi en masse
    $result = $sms->sendBulkSMS(
        ['+33612345678', '+33698765432'],
        'Promotion du jour !'
    );
    print_r($result);
    ?>
    ```
  </TabItem>
</Tabs>

## Limites et quotas

- **Longueur maximale du message :** 1600 caractères (environ 10 SMS standard)
- **Destinataires en masse :** 100 par requête
- **Vitesse d'envoi :** Environ 1 SMS toutes les 2-3 secondes
- **Messages programmés :** Maximum 30 jours à l'avance
- **Métadonnées :** Maximum 1 KB par message

## Prochaines étapes

- [Système OTP](/guides/otp) - Implémenter l'authentification à deux facteurs
- [Suivre vos SMS](/guides/tracking) - Consulter l'historique et le statut
- [Webhooks](/webhooks/overview) - Recevoir des notifications en temps réel
