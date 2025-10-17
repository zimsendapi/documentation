---
sidebar_position: 5
---

# Suivre vos SMS

ZimSend vous permet de suivre en temps réel l'état de vos SMS et de consulter l'historique complet de vos envois.

## Obtenir le statut d'un SMS

Récupérez les informations détaillées sur un SMS spécifique.

### Endpoint

```
GET https://api.zimsend.com/v1/sms/status/:message_id
```

### Paramètres d'URL

| Paramètre | Type | Description |
|-----------|------|-------------|
| `message_id` | string | ID du message retourné lors de l'envoi |

### Exemple de requête

```bash
curl -X GET https://api.zimsend.com/v1/sms/status/msg_1234567890abcdef \
  -H "X-API-Key: votre_cle_api" \
  -H "X-Client-ID: votre_client_id"
```

### Réponse

```json
{
  "success": true,
  "message_id": "msg_1234567890abcdef",
  "status": "delivered",
  "to": "+33612345678",
  "message": "Bonjour, votre commande est en cours de livraison",
  "priority": "normal",
  "created_at": "2025-01-15T10:30:00Z",
  "queued_at": "2025-01-15T10:30:01Z",
  "sent_at": "2025-01-15T10:30:05Z",
  "delivered_at": "2025-01-15T10:30:08Z",
  "metadata": {
    "order_id": "order_12345",
    "user_id": "user_789"
  }
}
```

## Statuts possibles

Un SMS peut avoir les statuts suivants :

| Statut | Description |
|--------|-------------|
| `queued` | Le SMS est en file d'attente |
| `sent` | Le SMS a été envoyé au réseau mobile |
| `delivered` | Le SMS a été délivré au destinataire |
| `failed` | L'envoi du SMS a échoué |
| `cancelled` | Le SMS a été annulé avant l'envoi |

### Cycle de vie d'un SMS

```
queued → sent → delivered
  ↓       ↓
cancelled failed
```

## Consulter l'historique des SMS

Récupérez la liste de tous vos SMS envoyés avec des filtres avancés.

### Endpoint

```
GET https://api.zimsend.com/v1/sms/history
```

### Paramètres de requête

| Paramètre | Type | Description |
|-----------|------|-------------|
| `page` | number | Numéro de page (défaut: 1) |
| `limit` | number | Nombre de résultats par page (défaut: 50, max: 100) |
| `status` | string | Filtrer par statut (`queued`, `sent`, `delivered`, `failed`) |
| `to` | string | Filtrer par numéro de destinataire |
| `from_date` | string | Date de début (format ISO 8601) |
| `to_date` | string | Date de fin (format ISO 8601) |
| `device_id` | string | Filtrer par device |
| `search` | string | Recherche dans le contenu des messages |

### Exemple de requête

```bash
curl -X GET "https://api.zimsend.com/v1/sms/history?status=delivered&limit=20" \
  -H "X-API-Key: votre_cle_api" \
  -H "X-Client-ID: votre_client_id"
```

### Réponse

```json
{
  "success": true,
  "data": [
    {
      "message_id": "msg_1234567890abcdef",
      "status": "delivered",
      "to": "+33612345678",
      "message": "Bonjour, votre commande est en cours de livraison",
      "sent_at": "2025-01-15T10:30:05Z",
      "delivered_at": "2025-01-15T10:30:08Z"
    },
    {
      "message_id": "msg_abcdef1234567890",
      "status": "delivered",
      "to": "+33698765432",
      "message": "Votre colis sera livré demain",
      "sent_at": "2025-01-15T09:15:22Z",
      "delivered_at": "2025-01-15T09:15:25Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total_pages": 5,
    "total_items": 94
  }
}
```

## Exemples de filtres

### Filtrer par période

Récupérez les SMS envoyés durant une période spécifique :

```bash
curl -X GET "https://api.zimsend.com/v1/sms/history?from_date=2025-01-01T00:00:00Z&to_date=2025-01-31T23:59:59Z" \
  -H "X-API-Key: votre_cle_api" \
  -H "X-Client-ID: votre_client_id"
```

### Filtrer par statut

Récupérez uniquement les SMS échoués :

```bash
curl -X GET "https://api.zimsend.com/v1/sms/history?status=failed" \
  -H "X-API-Key: votre_cle_api" \
  -H "X-Client-ID: votre_client_id"
```

### Filtrer par destinataire

Récupérez tous les SMS envoyés à un numéro spécifique :

```bash
curl -X GET "https://api.zimsend.com/v1/sms/history?to=%2B33612345678" \
  -H "X-API-Key: votre_cle_api" \
  -H "X-Client-ID: votre_client_id"
```

### Recherche dans le contenu

Recherchez des SMS contenant un mot-clé :

```bash
curl -X GET "https://api.zimsend.com/v1/sms/history?search=commande" \
  -H "X-API-Key: votre_cle_api" \
  -H "X-Client-ID: votre_client_id"
```

## Annuler un SMS programmé

Si vous avez programmé un SMS pour un envoi futur, vous pouvez l'annuler avant son envoi.

### Endpoint

```
DELETE https://api.zimsend.com/v1/sms/:message_id
```

### Exemple de requête

```bash
curl -X DELETE https://api.zimsend.com/v1/sms/msg_1234567890abcdef \
  -H "X-API-Key: votre_cle_api" \
  -H "X-Client-ID: votre_client_id"
```

### Réponse

```json
{
  "success": true,
  "message": "SMS annulé avec succès",
  "message_id": "msg_1234567890abcdef",
  "status": "cancelled"
}
```

**Note :** Vous ne pouvez annuler que les SMS avec le statut `queued`. Les SMS déjà envoyés ne peuvent pas être annulés.

## Obtenir les statistiques globales

Obtenez un aperçu de vos statistiques d'envoi.

### Endpoint

```
GET https://api.zimsend.com/v1/sms/stats
```

### Paramètres de requête

| Paramètre | Type | Description |
|-----------|------|-------------|
| `from_date` | string | Date de début (format ISO 8601) |
| `to_date` | string | Date de fin (format ISO 8601) |
| `device_id` | string | Filtrer par device |

### Exemple de requête

```bash
curl -X GET "https://api.zimsend.com/v1/sms/stats?from_date=2025-01-01T00:00:00Z&to_date=2025-01-31T23:59:59Z" \
  -H "X-API-Key: votre_cle_api" \
  -H "X-Client-ID: votre_client_id"
```

### Réponse

```json
{
  "success": true,
  "period": {
    "from": "2025-01-01T00:00:00Z",
    "to": "2025-01-31T23:59:59Z"
  },
  "stats": {
    "total_sent": 1250,
    "delivered": 1198,
    "failed": 52,
    "pending": 15,
    "delivery_rate": 95.84,
    "by_day": [
      {
        "date": "2025-01-01",
        "sent": 45,
        "delivered": 43,
        "failed": 2
      },
      {
        "date": "2025-01-02",
        "sent": 52,
        "delivered": 50,
        "failed": 2
      }
    ]
  }
}
```

## Exemples d'intégration

### Node.js / JavaScript

```javascript
const axios = require('axios');

class ZimSendTracking {
  constructor(apiKey, clientId) {
    this.apiKey = apiKey;
    this.clientId = clientId;
    this.baseURL = 'https://api.zimsend.com/v1';
  }

  async getStatus(messageId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/sms/status/${messageId}`,
        {
          headers: {
            'X-API-Key': this.apiKey,
            'X-Client-ID': this.clientId
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async getHistory(filters = {}) {
    try {
      const response = await axios.get(
        `${this.baseURL}/sms/history`,
        {
          params: filters,
          headers: {
            'X-API-Key': this.apiKey,
            'X-Client-ID': this.clientId
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async cancelMessage(messageId) {
    try {
      const response = await axios.delete(
        `${this.baseURL}/sms/${messageId}`,
        {
          headers: {
            'X-API-Key': this.apiKey,
            'X-Client-ID': this.clientId
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async getStats(fromDate, toDate) {
    try {
      const response = await axios.get(
        `${this.baseURL}/sms/stats`,
        {
          params: {
            from_date: fromDate,
            to_date: toDate
          },
          headers: {
            'X-API-Key': this.apiKey,
            'X-Client-ID': this.clientId
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
const tracking = new ZimSendTracking(
  process.env.ZIMSEND_API_KEY,
  process.env.ZIMSEND_CLIENT_ID
);

// Vérifier le statut d'un SMS
tracking.getStatus('msg_1234567890abcdef')
  .then(status => {
    console.log('Statut:', status.status);
    console.log('Délivré à:', status.delivered_at);
  })
  .catch(error => console.error('Erreur:', error));

// Récupérer l'historique
tracking.getHistory({
  status: 'delivered',
  limit: 50,
  page: 1
})
  .then(history => {
    console.log('SMS envoyés:', history.data.length);
    console.log('Total:', history.pagination.total_items);
  })
  .catch(error => console.error('Erreur:', error));

// Annuler un SMS programmé
tracking.cancelMessage('msg_1234567890abcdef')
  .then(result => console.log('SMS annulé:', result))
  .catch(error => console.error('Erreur:', error));

// Obtenir les statistiques
tracking.getStats('2025-01-01T00:00:00Z', '2025-01-31T23:59:59Z')
  .then(stats => {
    console.log('Total envoyés:', stats.stats.total_sent);
    console.log('Taux de délivrance:', stats.stats.delivery_rate + '%');
  })
  .catch(error => console.error('Erreur:', error));
```

### Python

```python
import requests
from typing import Dict, Optional

class ZimSendTracking:
    def __init__(self, api_key: str, client_id: str):
        self.api_key = api_key
        self.client_id = client_id
        self.base_url = 'https://api.zimsend.com/v1'

    def _get_headers(self) -> Dict[str, str]:
        return {
            'X-API-Key': self.api_key,
            'X-Client-ID': self.client_id
        }

    def get_status(self, message_id: str) -> Dict:
        """Obtient le statut d'un SMS"""
        url = f'{self.base_url}/sms/status/{message_id}'
        response = requests.get(url, headers=self._get_headers())
        return response.json()

    def get_history(self, filters: Optional[Dict] = None) -> Dict:
        """Récupère l'historique des SMS"""
        url = f'{self.base_url}/sms/history'
        response = requests.get(url, params=filters, headers=self._get_headers())
        return response.json()

    def cancel_message(self, message_id: str) -> Dict:
        """Annule un SMS programmé"""
        url = f'{self.base_url}/sms/{message_id}'
        response = requests.delete(url, headers=self._get_headers())
        return response.json()

    def get_stats(self, from_date: str, to_date: str) -> Dict:
        """Obtient les statistiques d'envoi"""
        url = f'{self.base_url}/sms/stats'
        params = {
            'from_date': from_date,
            'to_date': to_date
        }
        response = requests.get(url, params=params, headers=self._get_headers())
        return response.json()

# Utilisation
import os

tracking = ZimSendTracking(
    os.getenv('ZIMSEND_API_KEY'),
    os.getenv('ZIMSEND_CLIENT_ID')
)

# Vérifier le statut
status = tracking.get_status('msg_1234567890abcdef')
print(f"Statut: {status['status']}")
print(f"Délivré à: {status.get('delivered_at')}")

# Récupérer l'historique
history = tracking.get_history({
    'status': 'delivered',
    'limit': 50,
    'page': 1
})
print(f"SMS envoyés: {len(history['data'])}")
print(f"Total: {history['pagination']['total_items']}")

# Obtenir les statistiques
stats = tracking.get_stats('2025-01-01T00:00:00Z', '2025-01-31T23:59:59Z')
print(f"Total envoyés: {stats['stats']['total_sent']}")
print(f"Taux de délivrance: {stats['stats']['delivery_rate']}%")
```

### PHP

```php
<?php

class ZimSendTracking {
    private $apiKey;
    private $clientId;
    private $baseURL = 'https://api.zimsend.com/v1';

    public function __construct($apiKey, $clientId) {
        $this->apiKey = $apiKey;
        $this->clientId = $clientId;
    }

    private function getHeaders() {
        return [
            'X-API-Key: ' . $this->apiKey,
            'X-Client-ID: ' . $this->clientId
        ];
    }

    public function getStatus($messageId) {
        $url = $this->baseURL . '/sms/status/' . $messageId;

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $this->getHeaders());
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response, true);
    }

    public function getHistory($filters = []) {
        $url = $this->baseURL . '/sms/history';

        if (!empty($filters)) {
            $url .= '?' . http_build_query($filters);
        }

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $this->getHeaders());
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response, true);
    }

    public function cancelMessage($messageId) {
        $url = $this->baseURL . '/sms/' . $messageId;

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
        curl_setopt($ch, CURLOPT_HTTPHEADER, $this->getHeaders());
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response, true);
    }

    public function getStats($fromDate, $toDate) {
        $url = $this->baseURL . '/sms/stats';
        $url .= '?' . http_build_query([
            'from_date' => $fromDate,
            'to_date' => $toDate
        ]);

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $this->getHeaders());
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response, true);
    }
}

// Utilisation
$tracking = new ZimSendTracking(
    getenv('ZIMSEND_API_KEY'),
    getenv('ZIMSEND_CLIENT_ID')
);

// Vérifier le statut
$status = $tracking->getStatus('msg_1234567890abcdef');
echo "Statut: " . $status['status'] . "\n";

// Récupérer l'historique
$history = $tracking->getHistory([
    'status' => 'delivered',
    'limit' => 50
]);
echo "Total: " . $history['pagination']['total_items'] . "\n";

// Obtenir les statistiques
$stats = $tracking->getStats('2025-01-01T00:00:00Z', '2025-01-31T23:59:59Z');
echo "Total envoyés: " . $stats['stats']['total_sent'] . "\n";
?>
```

## Prochaines étapes

- [Webhooks](/webhooks/overview) - Recevoir des notifications automatiques
- [Codes d'erreur](/errors) - Comprendre les erreurs de tracking
