---
sidebar_position: 2
---

# Authentification API

Pour utiliser l'API ZimSend, vous devez vous authentifier à chaque requête en utilisant des headers HTTP spécifiques.

## Headers d'authentification requis

Toutes les requêtes API doivent inclure les headers suivants :

| Header | Description | Exemple |
|--------|-------------|---------|
| `X-API-Key` | Votre clé API secrète | `zs_live_abc123def456...` |
| `X-Client-ID` | Votre identifiant client unique | `client_1234567890` |
| `X-Device-ID` | L'ID du device Android à utiliser | `device_abcdef123456` |

### X-API-Key

Votre clé API secrète qui authentifie vos requêtes. Ne la partagez jamais publiquement.

**Où la trouver :**
1. Connectez-vous à [app.zimsend.com](https://app.zimsend.com)
2. Allez dans la section **API Keys**
3. Créez une nouvelle clé ou utilisez une clé existante

**Format :** `zs_live_` ou `zs_test_` suivi d'une chaîne alphanumérique

**Important :** Conservez votre clé API en sécurité. Ne la commitez jamais dans votre code source. Utilisez des variables d'environnement.

### X-Client-ID

Votre identifiant client unique qui identifie votre compte ZimSend.

**Où le trouver :**
1. Connectez-vous à [app.zimsend.com](https://app.zimsend.com)
2. Allez dans **Paramètres du compte**
3. Copiez votre Client ID

**Format :** `client_` suivi d'une chaîne numérique

### X-Device-ID

L'identifiant du device Android que vous souhaitez utiliser pour envoyer le SMS.

**Où le trouver :**
1. Connectez-vous à [app.zimsend.com](https://app.zimsend.com)
2. Allez dans la section **Devices**
3. Copiez l'ID du device souhaité

**Format :** `device_` suivi d'une chaîne alphanumérique

**Note :** Si vous avez plusieurs téléphones connectés, vous pouvez choisir lequel utiliser en changeant ce header. Si vous ne spécifiez pas de Device ID, le premier device disponible sera utilisé.

## Exemple de requête complète

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="programming-language">
  <TabItem value="curl" label="cURL">
    ```bash
    curl -X POST https://api.zimsend.com/v1/sms/send \
      -H "Content-Type: application/json" \
      -H "X-API-Key: zs_live_abc123def456ghi789jkl012mno345" \
      -H "X-Client-ID: client_1234567890" \
      -H "X-Device-ID: device_abcdef123456" \
      -d '{
        "to": "+33612345678",
        "message": "Test d'\''authentification"
      }'
    ```
  </TabItem>
  <TabItem value="nodejs" label="Node.js">
    ```javascript
    const axios = require('axios');

    const API_KEY = process.env.ZIMSEND_API_KEY;
    const CLIENT_ID = process.env.ZIMSEND_CLIENT_ID;
    const DEVICE_ID = process.env.ZIMSEND_DEVICE_ID;

    async function sendSMS(to, message) {
      try {
        const response = await axios.post(
          'https://api.zimsend.com/v1/sms/send',
          { to, message },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': API_KEY,
              'X-Client-ID': CLIENT_ID,
              'X-Device-ID': DEVICE_ID
            }
          }
        );
        return response.data;
      } catch (error) {
        console.error('Erreur d\'authentification:', error.response.data);
        throw error;
      }
    }
    ```
  </TabItem>
  <TabItem value="python" label="Python">
    ```python
    import os
    import requests

    API_KEY = os.getenv('ZIMSEND_API_KEY')
    CLIENT_ID = os.getenv('ZIMSEND_CLIENT_ID')
    DEVICE_ID = os.getenv('ZIMSEND_DEVICE_ID')

    def send_sms(to, message):
        url = 'https://api.zimsend.com/v1/sms/send'
        headers = {
            'Content-Type': 'application/json',
            'X-API-Key': API_KEY,
            'X-Client-ID': CLIENT_ID,
            'X-Device-ID': DEVICE_ID
        }
        data = {
            'to': to,
            'message': message
        }

        response = requests.post(url, json=data, headers=headers)
        return response.json()
    ```
  </TabItem>
  <TabItem value="php" label="PHP">
    ```php
    <?php
    $apiKey = getenv('ZIMSEND_API_KEY');
    $clientId = getenv('ZIMSEND_CLIENT_ID');
    $deviceId = getenv('ZIMSEND_DEVICE_ID');

    function sendSMS($to, $message) {
        global $apiKey, $clientId, $deviceId;

        $url = 'https://api.zimsend.com/v1/sms/send';
        $headers = [
            'Content-Type: application/json',
            'X-API-Key: ' . $apiKey,
            'X-Client-ID: ' . $clientId,
            'X-Device-ID: ' . $deviceId
        ];
        $data = [
            'to' => $to,
            'message' => $message
        ];

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response, true);
    }
    ?>
    ```
  </TabItem>
</Tabs>

## Gestion des erreurs d'authentification

Si l'authentification échoue, vous recevrez une réponse d'erreur :

### Clé API invalide

```json
{
  "success": false,
  "error": {
    "code": "INVALID_API_KEY",
    "message": "La clé API fournie est invalide ou a expiré"
  }
}
```

**Code HTTP :** 401 Unauthorized

**Solution :** Vérifiez que votre clé API est correcte et n'a pas été révoquée.

### Client ID invalide

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CLIENT_ID",
    "message": "Le Client ID fourni n'existe pas"
  }
}
```

**Code HTTP :** 401 Unauthorized

**Solution :** Vérifiez votre Client ID dans le dashboard.

### Device ID invalide

```json
{
  "success": false,
  "error": {
    "code": "INVALID_DEVICE_ID",
    "message": "Le Device ID fourni n'existe pas ou n'appartient pas à ce client"
  }
}
```

**Code HTTP :** 404 Not Found

**Solution :** Vérifiez que le Device ID existe et appartient bien à votre compte.

### Device déconnecté

```json
{
  "success": false,
  "error": {
    "code": "DEVICE_OFFLINE",
    "message": "Le device spécifié est actuellement hors ligne"
  }
}
```

**Code HTTP :** 503 Service Unavailable

**Solution :** Assurez-vous que votre téléphone Android est connecté à Internet et que l'application ZimSend est active.

### Headers manquants

```json
{
  "success": false,
  "error": {
    "code": "MISSING_AUTH_HEADERS",
    "message": "Les headers d'authentification requis sont manquants"
  }
}
```

**Code HTTP :** 400 Bad Request

**Solution :** Vérifiez que vous envoyez bien tous les headers requis (`X-API-Key`, `X-Client-ID`, `X-Device-ID`).

## Bonnes pratiques de sécurité

### Utilisez des variables d'environnement

Ne hardcodez jamais vos credentials dans votre code source :

```javascript
// ❌ MAUVAIS
const API_KEY = 'zs_live_abc123def456...';

// ✅ BON
const API_KEY = process.env.ZIMSEND_API_KEY;
```

### Créez des clés API dédiées

Créez différentes clés API pour différents environnements :
- Une clé pour le développement
- Une clé pour la production
- Une clé par application si vous avez plusieurs projets

Cela vous permet de révoquer une clé sans affecter les autres services.

### Révocation de clés

Si vous pensez qu'une clé API a été compromise :

1. Allez dans le dashboard
2. Section **API Keys**
3. Cliquez sur **Révoquer** pour la clé concernée
4. Créez une nouvelle clé immédiatement
5. Mettez à jour vos applications avec la nouvelle clé

### Utilisez HTTPS uniquement

L'API ZimSend n'accepte que les connexions HTTPS. Les requêtes HTTP seront automatiquement rejetées pour garantir la sécurité de vos credentials.

## Tester votre authentification

Pour vérifier que votre authentification fonctionne correctement, utilisez l'endpoint de test :

```bash
curl -X GET https://api.zimsend.com/v1/auth/test \
  -H "X-API-Key: votre_cle_api" \
  -H "X-Client-ID: votre_client_id" \
  -H "X-Device-ID: votre_device_id"
```

Réponse si tout est correct :

```json
{
  "success": true,
  "message": "Authentification réussie",
  "client_id": "client_1234567890",
  "device_id": "device_abcdef123456",
  "device_status": "online"
}
```

## Prochaines étapes

Maintenant que vous savez comment vous authentifier, découvrez comment :

- [Envoyer des SMS](/guides/sending-sms)
- [Utiliser le système OTP](/guides/otp)
- [Suivre vos SMS](/guides/tracking)
