---
sidebar_position: 1
---

# Démarrage rapide

Envoyez votre premier SMS en moins de 5 minutes avec ZimSend.

## Étape 1 : Créer un compte

Rendez-vous sur [app.zimsend.com](https://app.zimsend.com) et créez votre compte gratuitement.

Une fois inscrit, vous accédez à votre dashboard où vous pourrez gérer vos clés API et vos devices.

## Étape 2 : Créer une clé API

Dans votre dashboard :

1. Allez dans la section **API Keys**
2. Cliquez sur **Créer une nouvelle clé API**
3. Donnez un nom à votre clé (ex: "Production", "Development")
4. Copiez et sauvegardez votre clé API en lieu sûr

**Important :** Votre clé API ne sera affichée qu'une seule fois. Conservez-la précieusement.

Vous aurez également besoin de votre **Client ID** visible dans les paramètres de votre compte.

## Étape 3 : Connecter votre téléphone Android

Pour envoyer des SMS, vous devez connecter au moins un téléphone Android :

### Option A : QR Code (recommandé)

1. Dans le dashboard, allez dans **Devices**
2. Cliquez sur **Ajouter un device**
3. Téléchargez l'application ZimSend APK sur votre téléphone
4. Installez l'APK (autorisez l'installation depuis des sources inconnues)
5. Ouvrez l'application et scannez le QR code affiché dans le dashboard

### Option B : Mot de passe manuel

1. Dans le dashboard, allez dans **Devices**
2. Cliquez sur **Ajouter un device**
3. Notez votre **Client ID** et le **Device Password** généré
4. Téléchargez et installez l'application ZimSend APK
5. Ouvrez l'application et entrez :
   - Votre Client ID
   - Le Device Password

Votre téléphone est maintenant connecté ! Assurez-vous qu'il reste connecté à Internet (WiFi ou données mobiles) pour recevoir les commandes d'envoi.

## Étape 4 : Envoyer votre premier SMS

Une fois votre device connecté, vous pouvez envoyer des SMS via l'API.

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
        "message": "Bonjour ! Ceci est mon premier SMS envoyé avec ZimSend."
      }'
    ```
  </TabItem>
  <TabItem value="nodejs" label="Node.js">
    ```javascript
    const axios = require('axios');

    async function sendSMS() {
      try {
        const response = await axios.post(
          'https://api.zimsend.com/v1/sms/send',
          {
            to: '+33612345678',
            message: 'Bonjour ! Ceci est mon premier SMS envoyé avec ZimSend.'
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': 'votre_cle_api',
              'X-Client-ID': 'votre_client_id',
              'X-Device-ID': 'votre_device_id'
            }
          }
        );

        console.log('SMS envoyé :', response.data);
      } catch (error) {
        console.error('Erreur :', error.response.data);
      }
    }

    sendSMS();
    ```
  </TabItem>
  <TabItem value="python" label="Python">
    ```python
    import requests

    url = 'https://api.zimsend.com/v1/sms/send'
    headers = {
        'Content-Type': 'application/json',
        'X-API-Key': 'votre_cle_api',
        'X-Client-ID': 'votre_client_id',
        'X-Device-ID': 'votre_device_id'
    }
    data = {
        'to': '+33612345678',
        'message': 'Bonjour ! Ceci est mon premier SMS envoyé avec ZimSend.'
    }

    response = requests.post(url, json=data, headers=headers)
    print(response.json())
    ```
  </TabItem>
  <TabItem value="php" label="PHP">
    ```php
    <?php
    $url = 'https://api.zimsend.com/v1/sms/send';
    $headers = [
        'Content-Type: application/json',
        'X-API-Key: votre_cle_api',
        'X-Client-ID: votre_client_id',
        'X-Device-ID: votre_device_id'
    ];
    $data = [
        'to' => '+33612345678',
        'message' => 'Bonjour ! Ceci est mon premier SMS envoyé avec ZimSend.'
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    curl_close($ch);

    echo $response;
    ?>
    ```
  </TabItem>
</Tabs>

### Réponse attendue

```json
{
  "success": true,
  "message_id": "msg_1234567890abcdef",
  "status": "queued",
  "to": "+33612345678",
  "queued_at": "2025-01-15T10:30:00Z"
}
```

## Vérifier le statut de votre SMS

Vous pouvez vérifier si votre SMS a bien été envoyé :

<Tabs groupId="programming-language">
  <TabItem value="curl" label="cURL">
    ```bash
    curl -X GET https://api.zimsend.com/v1/sms/status/msg_1234567890abcdef \
      -H "X-API-Key: votre_cle_api" \
      -H "X-Client-ID: votre_client_id"
    ```
  </TabItem>
  <TabItem value="nodejs" label="Node.js">
    ```javascript
    const axios = require('axios');

    async function checkStatus(messageId) {
      try {
        const response = await axios.get(
          `https://api.zimsend.com/v1/sms/status/${messageId}`,
          {
            headers: {
              'X-API-Key': 'votre_cle_api',
              'X-Client-ID': 'votre_client_id'
            }
          }
        );

        console.log('Statut:', response.data);
      } catch (error) {
        console.error('Erreur:', error.response.data);
      }
    }

    checkStatus('msg_1234567890abcdef');
    ```
  </TabItem>
  <TabItem value="python" label="Python">
    ```python
    import requests

    message_id = 'msg_1234567890abcdef'
    url = f'https://api.zimsend.com/v1/sms/status/{message_id}'
    headers = {
        'X-API-Key': 'votre_cle_api',
        'X-Client-ID': 'votre_client_id'
    }

    response = requests.get(url, headers=headers)
    print(response.json())
    ```
  </TabItem>
  <TabItem value="php" label="PHP">
    ```php
    <?php
    $messageId = 'msg_1234567890abcdef';
    $url = "https://api.zimsend.com/v1/sms/status/$messageId";
    $headers = [
        'X-API-Key: votre_cle_api',
        'X-Client-ID: votre_client_id'
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    curl_close($ch);

    echo $response;
    ?>
    ```
  </TabItem>
</Tabs>

### Réponse :

```json
{
  "success": true,
  "message_id": "msg_1234567890abcdef",
  "status": "delivered",
  "to": "+33612345678",
  "message": "Bonjour ! Ceci est mon premier SMS envoyé avec ZimSend.",
  "sent_at": "2025-01-15T10:30:05Z",
  "delivered_at": "2025-01-15T10:30:08Z"
}
```

## Prochaines étapes

Félicitations ! Vous avez envoyé votre premier SMS avec ZimSend.

Pour aller plus loin :

- [Authentification API](/guides/authentication) - Comprendre les headers d'authentification
- [Envoyer des SMS](/guides/sending-sms) - Découvrir toutes les options d'envoi
- [Système OTP](/guides/otp) - Implémenter l'authentification à deux facteurs
- [Webhooks](/webhooks/overview) - Recevoir des notifications en temps réel
- [SDKs](/sdks/nodejs) - Utiliser nos wrappers pour simplifier l'intégration

## Besoin d'aide ?

Si vous rencontrez des problèmes :

1. Vérifiez que votre device Android est bien connecté dans le dashboard
2. Vérifiez que votre téléphone a une connexion Internet active
3. Consultez notre [FAQ](/faq) pour les problèmes courants
4. Contactez le support : support@zimsend.com
