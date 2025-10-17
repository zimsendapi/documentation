---
sidebar_position: 4
---

# Système OTP (One-Time Password)

ZimSend intègre un système complet de génération et vérification de codes OTP pour implémenter facilement l'authentification à deux facteurs (2FA) dans vos applications.

## Qu'est-ce qu'un OTP ?

Un OTP (One-Time Password) est un code à usage unique envoyé par SMS pour vérifier l'identité d'un utilisateur. C'est couramment utilisé pour :

- Authentification à deux facteurs (2FA)
- Vérification de numéro de téléphone
- Réinitialisation de mot de passe
- Confirmation de transactions sensibles

## Générer et envoyer un code OTP

L'API ZimSend génère automatiquement un code OTP sécurisé et l'envoie par SMS.

### Endpoint

```
POST https://api.zimsend.com/v1/sms/send-otp
```

### Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `to` | string | Numéro du destinataire au format international |
| `length` | number | Longueur du code (4-8 chiffres, défaut: 6) |
| `expiry` | number | Durée de validité en secondes (défaut: 300 = 5 minutes) |
| `template` | string | Template du message (optionnel, voir ci-dessous) |
| `metadata` | object | Données personnalisées (optionnel) |

### Exemple de requête

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="programming-language">
  <TabItem value="curl" label="cURL">
    ```bash
    curl -X POST https://api.zimsend.com/v1/sms/send-otp \
      -H "Content-Type: application/json" \
      -H "X-API-Key: votre_cle_api" \
      -H "X-Client-ID: votre_client_id" \
      -H "X-Device-ID: votre_device_id" \
      -d '{
        "to": "+33612345678",
        "length": 6,
        "expiry": 300
      }'
    ```
  </TabItem>
  <TabItem value="nodejs" label="Node.js">
    ```javascript
    const axios = require('axios');

    const response = await axios.post(
      'https://api.zimsend.com/v1/sms/send-otp',
      {
        to: '+33612345678',
        length: 6,
        expiry: 300
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
    console.log(response.data);
    ```
  </TabItem>
  <TabItem value="python" label="Python">
    ```python
    import requests

    response = requests.post(
        'https://api.zimsend.com/v1/sms/send-otp',
        json={
            'to': '+33612345678',
            'length': 6,
            'expiry': 300
        },
        headers={
            'Content-Type': 'application/json',
            'X-API-Key': 'votre_cle_api',
            'X-Client-ID': 'votre_client_id',
            'X-Device-ID': 'votre_device_id'
        }
    )
    print(response.json())
    ```
  </TabItem>
  <TabItem value="php" label="PHP">
    ```php
    <?php
    $ch = curl_init('https://api.zimsend.com/v1/sms/send-otp');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'to' => '+33612345678',
        'length' => 6,
        'expiry' => 300
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
    echo $response;
    ?>
    ```
  </TabItem>
</Tabs>

### Réponse

```json
{
  "success": true,
  "otp_id": "otp_abc123def456",
  "to": "+33612345678",
  "expires_at": "2025-01-15T10:35:00Z",
  "message_id": "msg_1234567890abcdef",
  "status": "queued"
}
```

**Important :** Le code OTP n'est pas retourné dans la réponse pour des raisons de sécurité. Il est uniquement envoyé par SMS au destinataire.

### Personnaliser le message

Par défaut, le message envoyé est :

```
Votre code de vérification est : 123456
```

Vous pouvez personnaliser ce message avec le paramètre `template` :

```bash
curl -X POST https://api.zimsend.com/v1/sms/send-otp \
  -H "Content-Type: application/json" \
  -H "X-API-Key: votre_cle_api" \
  -H "X-Client-ID: votre_client_id" \
  -H "X-Device-ID: votre_device_id" \
  -d '{
    "to": "+33612345678",
    "length": 6,
    "template": "Votre code MonApp : {{code}}. Valide 5 minutes."
  }'
```

Le placeholder `{{code}}` sera automatiquement remplacé par le code généré.

## Vérifier un code OTP

Une fois que l'utilisateur a reçu et saisi le code, vérifiez-le avec cet endpoint.

### Endpoint

```
POST https://api.zimsend.com/v1/sms/verify-otp
```

### Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `otp_id` | string | ID de l'OTP retourné lors de la génération |
| `code` | string | Code saisi par l'utilisateur |

### Exemple de requête

```bash
curl -X POST https://api.zimsend.com/v1/sms/verify-otp \
  -H "Content-Type: application/json" \
  -H "X-API-Key: votre_cle_api" \
  -H "X-Client-ID: votre_client_id" \
  -d '{
    "otp_id": "otp_abc123def456",
    "code": "123456"
  }'
```

### Réponse - Code correct

```json
{
  "success": true,
  "valid": true,
  "message": "Code OTP vérifié avec succès",
  "verified_at": "2025-01-15T10:32:15Z"
}
```

### Réponse - Code incorrect

```json
{
  "success": true,
  "valid": false,
  "message": "Code OTP incorrect",
  "attempts_remaining": 2
}
```

### Réponse - Code expiré

```json
{
  "success": false,
  "error": {
    "code": "OTP_EXPIRED",
    "message": "Le code OTP a expiré"
  }
}
```

### Réponse - Trop de tentatives

```json
{
  "success": false,
  "error": {
    "code": "OTP_MAX_ATTEMPTS",
    "message": "Nombre maximum de tentatives atteint"
  }
}
```

## Sécurité

Le système OTP de ZimSend intègre plusieurs mécanismes de sécurité :

### Limitation des tentatives

Chaque OTP ne peut être vérifié que **3 fois maximum**. Après 3 échecs, l'OTP est invalidé et un nouveau doit être généré.

### Expiration automatique

Les codes OTP expirent automatiquement après la durée spécifiée (5 minutes par défaut). Les codes expirés ne peuvent plus être vérifiés.

### Usage unique

Une fois un code OTP vérifié avec succès, il ne peut plus être réutilisé, même s'il n'est pas encore expiré.

### Rate limiting

Un même numéro de téléphone ne peut recevoir qu'un nombre limité d'OTP par heure (10 maximum) pour éviter les abus.

## Exemples d'intégration complète

### Node.js / JavaScript

```javascript
const axios = require('axios');

class ZimSendOTP {
  constructor(apiKey, clientId, deviceId) {
    this.apiKey = apiKey;
    this.clientId = clientId;
    this.deviceId = deviceId;
    this.baseURL = 'https://api.zimsend.com/v1';
  }

  async sendOTP(phoneNumber, options = {}) {
    try {
      const response = await axios.post(
        `${this.baseURL}/sms/send-otp`,
        {
          to: phoneNumber,
          length: options.length || 6,
          expiry: options.expiry || 300,
          template: options.template,
          metadata: options.metadata
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

  async verifyOTP(otpId, code) {
    try {
      const response = await axios.post(
        `${this.baseURL}/sms/verify-otp`,
        {
          otp_id: otpId,
          code: code
        },
        {
          headers: {
            'Content-Type': 'application/json',
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

// Utilisation - Exemple d'authentification 2FA
const otp = new ZimSendOTP(
  process.env.ZIMSEND_API_KEY,
  process.env.ZIMSEND_CLIENT_ID,
  process.env.ZIMSEND_DEVICE_ID
);

// Étape 1 : L'utilisateur demande un code
app.post('/api/auth/request-otp', async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const result = await otp.sendOTP(phoneNumber, {
      template: 'Votre code de connexion MonApp : {{code}}',
      metadata: { user_id: req.user.id }
    });

    // Stockez l'otp_id en session ou en base de données
    req.session.otp_id = result.otp_id;

    res.json({
      success: true,
      message: 'Code envoyé par SMS',
      expires_at: result.expires_at
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Étape 2 : L'utilisateur soumet le code
app.post('/api/auth/verify-otp', async (req, res) => {
  const { code } = req.body;
  const otpId = req.session.otp_id;

  if (!otpId) {
    return res.status(400).json({ error: 'Aucun code OTP en attente' });
  }

  try {
    const result = await otp.verifyOTP(otpId, code);

    if (result.valid) {
      // Code correct - Authentifier l'utilisateur
      req.session.authenticated = true;
      delete req.session.otp_id;

      res.json({
        success: true,
        message: 'Authentification réussie'
      });
    } else {
      // Code incorrect
      res.status(400).json({
        success: false,
        message: result.message,
        attempts_remaining: result.attempts_remaining
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

### Python (Flask)

```python
import requests
from flask import Flask, request, session, jsonify

app = Flask(__name__)
app.secret_key = 'votre_secret_key'

class ZimSendOTP:
    def __init__(self, api_key, client_id, device_id):
        self.api_key = api_key
        self.client_id = client_id
        self.device_id = device_id
        self.base_url = 'https://api.zimsend.com/v1'

    def _get_headers(self):
        return {
            'Content-Type': 'application/json',
            'X-API-Key': self.api_key,
            'X-Client-ID': self.client_id,
            'X-Device-ID': self.device_id
        }

    def send_otp(self, phone_number, **options):
        url = f'{self.base_url}/sms/send-otp'
        data = {
            'to': phone_number,
            'length': options.get('length', 6),
            'expiry': options.get('expiry', 300),
            'template': options.get('template'),
            'metadata': options.get('metadata')
        }
        response = requests.post(url, json=data, headers=self._get_headers())
        return response.json()

    def verify_otp(self, otp_id, code):
        url = f'{self.base_url}/sms/verify-otp'
        data = {
            'otp_id': otp_id,
            'code': code
        }
        headers = {
            'Content-Type': 'application/json',
            'X-API-Key': self.api_key,
            'X-Client-ID': self.client_id
        }
        response = requests.post(url, json=data, headers=headers)
        return response.json()

# Initialisation
otp = ZimSendOTP(
    os.getenv('ZIMSEND_API_KEY'),
    os.getenv('ZIMSEND_CLIENT_ID'),
    os.getenv('ZIMSEND_DEVICE_ID')
)

@app.route('/api/auth/request-otp', methods=['POST'])
def request_otp():
    phone_number = request.json.get('phoneNumber')

    try:
        result = otp.send_otp(
            phone_number,
            template='Votre code de connexion MonApp : {{code}}',
            metadata={'user_id': session.get('user_id')}
        )

        session['otp_id'] = result['otp_id']

        return jsonify({
            'success': True,
            'message': 'Code envoyé par SMS',
            'expires_at': result['expires_at']
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/auth/verify-otp', methods=['POST'])
def verify_otp():
    code = request.json.get('code')
    otp_id = session.get('otp_id')

    if not otp_id:
        return jsonify({'error': 'Aucun code OTP en attente'}), 400

    try:
        result = otp.verify_otp(otp_id, code)

        if result.get('valid'):
            session['authenticated'] = True
            session.pop('otp_id', None)

            return jsonify({
                'success': True,
                'message': 'Authentification réussie'
            })
        else:
            return jsonify({
                'success': False,
                'message': result['message'],
                'attempts_remaining': result.get('attempts_remaining')
            }), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
```

### PHP (Laravel)

```php
<?php

namespace App\Services;

class ZimSendOTP {
    private $apiKey;
    private $clientId;
    private $deviceId;
    private $baseURL = 'https://api.zimsend.com/v1';

    public function __construct() {
        $this->apiKey = env('ZIMSEND_API_KEY');
        $this->clientId = env('ZIMSEND_CLIENT_ID');
        $this->deviceId = env('ZIMSEND_DEVICE_ID');
    }

    private function getHeaders() {
        return [
            'Content-Type: application/json',
            'X-API-Key: ' . $this->apiKey,
            'X-Client-ID: ' . $this->clientId,
            'X-Device-ID: ' . $this->deviceId
        ];
    }

    public function sendOTP($phoneNumber, $options = []) {
        $url = $this->baseURL . '/sms/send-otp';
        $data = [
            'to' => $phoneNumber,
            'length' => $options['length'] ?? 6,
            'expiry' => $options['expiry'] ?? 300,
            'template' => $options['template'] ?? null,
            'metadata' => $options['metadata'] ?? null
        ];

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, $this->getHeaders());
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response, true);
    }

    public function verifyOTP($otpId, $code) {
        $url = $this->baseURL . '/sms/verify-otp';
        $data = [
            'otp_id' => $otpId,
            'code' => $code
        ];

        $headers = [
            'Content-Type: application/json',
            'X-API-Key: ' . $this->apiKey,
            'X-Client-ID: ' . $this->clientId
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
}

// Controller
namespace App\Http\Controllers;

use App\Services\ZimSendOTP;
use Illuminate\Http\Request;

class AuthController extends Controller {
    private $otp;

    public function __construct(ZimSendOTP $otp) {
        $this->otp = $otp;
    }

    public function requestOTP(Request $request) {
        $phoneNumber = $request->input('phoneNumber');

        try {
            $result = $this->otp->sendOTP($phoneNumber, [
                'template' => 'Votre code de connexion MonApp : {{code}}',
                'metadata' => ['user_id' => auth()->id()]
            ]);

            session(['otp_id' => $result['otp_id']]);

            return response()->json([
                'success' => true,
                'message' => 'Code envoyé par SMS',
                'expires_at' => $result['expires_at']
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function verifyOTP(Request $request) {
        $code = $request->input('code');
        $otpId = session('otp_id');

        if (!$otpId) {
            return response()->json(['error' => 'Aucun code OTP en attente'], 400);
        }

        try {
            $result = $this->otp->verifyOTP($otpId, $code);

            if ($result['valid']) {
                session(['authenticated' => true]);
                session()->forget('otp_id');

                return response()->json([
                    'success' => true,
                    'message' => 'Authentification réussie'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => $result['message'],
                    'attempts_remaining' => $result['attempts_remaining']
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
```

## Cas d'usage courants

### Vérification de numéro de téléphone

Lors de l'inscription, vérifiez que le numéro de téléphone appartient bien à l'utilisateur :

```javascript
// 1. L'utilisateur s'inscrit avec son numéro
const result = await otp.sendOTP(phoneNumber, {
  template: 'Bienvenue ! Votre code de vérification : {{code}}'
});

// 2. L'utilisateur saisit le code
const verification = await otp.verifyOTP(otpId, userCode);

// 3. Si valide, marquer le numéro comme vérifié
if (verification.valid) {
  await User.update({ phone_verified: true });
}
```

### Réinitialisation de mot de passe

Sécurisez la réinitialisation de mot de passe avec un code OTP :

```javascript
// 1. L'utilisateur demande une réinitialisation
const user = await User.findByEmail(email);
const result = await otp.sendOTP(user.phoneNumber, {
  template: 'Code de réinitialisation de mot de passe : {{code}}'
});

// 2. L'utilisateur saisit le code
const verification = await otp.verifyOTP(otpId, userCode);

// 3. Si valide, autoriser le changement de mot de passe
if (verification.valid) {
  // Afficher le formulaire de nouveau mot de passe
}
```

### Confirmation de transaction

Ajoutez une couche de sécurité pour les opérations sensibles :

```javascript
// 1. Avant une transaction importante
const result = await otp.sendOTP(user.phoneNumber, {
  template: 'Confirmez votre transaction de 1000€ avec le code : {{code}}'
});

// 2. L'utilisateur confirme avec le code
const verification = await otp.verifyOTP(otpId, userCode);

// 3. Si valide, exécuter la transaction
if (verification.valid) {
  await executeTransaction();
}
```

## Bonnes pratiques

### Utilisez des templates clairs

Le message doit être clair sur l'origine et l'usage du code :

```
✅ BON : "Votre code MonApp : 123456. Valide 5 minutes."
❌ MAUVAIS : "123456"
```

### Affichez le temps restant

Informez l'utilisateur du temps de validité du code dans votre interface.

### Proposez un renvoi

Permettez à l'utilisateur de demander un nouveau code si nécessaire.

### Ne stockez jamais les codes

Ne stockez jamais les codes OTP en clair dans votre base de données. Utilisez uniquement l'`otp_id`.

### Limitez les tentatives

Notre système limite déjà à 3 tentatives, mais vous pouvez ajouter une limitation supplémentaire côté client.

## Prochaines étapes

- [Suivre vos SMS](/guides/tracking) - Consulter l'historique et le statut
- [Webhooks](/webhooks/overview) - Recevoir des notifications en temps réel
- [Codes d'erreur](/errors) - Gérer les erreurs OTP
