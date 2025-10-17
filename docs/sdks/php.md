---
sidebar_position: 3
---

# SDK PHP

Intégrez facilement ZimSend dans vos applications PHP avec notre wrapper API.

## Installation

Vous pouvez utiliser cURL (inclus par défaut) ou GuzzleHTTP pour des fonctionnalités avancées :

```bash
composer require guzzlehttp/guzzle
```

## Classe Wrapper Complète

Créez un fichier `ZimSend.php` :

```php
<?php

class ZimSend {
    private $apiKey;
    private $clientId;
    private $deviceId;
    private $baseURL = 'https://api.zimsend.com/v1';

    public function __construct($apiKey, $clientId, $deviceId = null) {
        $this->apiKey = $apiKey;
        $this->clientId = $clientId;
        $this->deviceId = $deviceId;
    }

    /**
     * Génère les headers d'authentification
     */
    private function getHeaders($includeDevice = true) {
        $headers = [
            'Content-Type: application/json',
            'X-API-Key: ' . $this->apiKey,
            'X-Client-ID: ' . $this->clientId
        ];

        if ($includeDevice && $this->deviceId) {
            $headers[] = 'X-Device-ID: ' . $this->deviceId;
        }

        return $headers;
    }

    /**
     * Effectue une requête HTTP
     */
    private function request($method, $endpoint, $data = null, $includeDevice = true) {
        $url = $this->baseURL . $endpoint;
        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $this->getHeaders($includeDevice));

        switch ($method) {
            case 'POST':
                curl_setopt($ch, CURLOPT_POST, true);
                if ($data) {
                    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
                }
                break;
            case 'DELETE':
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
                break;
            case 'GET':
                if ($data) {
                    $url .= '?' . http_build_query($data);
                    curl_setopt($ch, CURLOPT_URL, $url);
                }
                break;
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $result = json_decode($response, true);

        if ($httpCode >= 400) {
            return [
                'success' => false,
                'error' => $result['error'] ?? [
                    'code' => 'UNKNOWN_ERROR',
                    'message' => 'Une erreur est survenue'
                ]
            ];
        }

        return $result;
    }

    /**
     * Envoie un SMS simple
     */
    public function sendSMS($to, $message, $options = []) {
        $data = array_merge([
            'to' => $to,
            'message' => $message
        ], $options);

        return $this->request('POST', '/sms/send', $data);
    }

    /**
     * Envoie des SMS en masse
     */
    public function sendBulkSMS($recipients, $message, $options = []) {
        $data = array_merge([
            'recipients' => $recipients,
            'message' => $message
        ], $options);

        return $this->request('POST', '/sms/send-bulk', $data);
    }

    /**
     * Envoie des SMS personnalisés en masse
     */
    public function sendBulkPersonalizedSMS($messages) {
        $data = ['messages' => $messages];
        return $this->request('POST', '/sms/send-bulk-personalized', $data);
    }

    /**
     * Génère et envoie un code OTP
     */
    public function sendOTP($to, $options = []) {
        $data = [
            'to' => $to,
            'length' => $options['length'] ?? 6,
            'expiry' => $options['expiry'] ?? 300,
            'template' => $options['template'] ?? null,
            'metadata' => $options['metadata'] ?? null
        ];

        return $this->request('POST', '/sms/send-otp', $data);
    }

    /**
     * Vérifie un code OTP
     */
    public function verifyOTP($otpId, $code) {
        $data = [
            'otp_id' => $otpId,
            'code' => $code
        ];

        return $this->request('POST', '/sms/verify-otp', $data, false);
    }

    /**
     * Obtient le statut d'un SMS
     */
    public function getStatus($messageId) {
        return $this->request('GET', '/sms/status/' . $messageId, null, false);
    }

    /**
     * Récupère l'historique des SMS
     */
    public function getHistory($filters = []) {
        return $this->request('GET', '/sms/history', $filters, false);
    }

    /**
     * Annule un SMS programmé
     */
    public function cancelMessage($messageId) {
        return $this->request('DELETE', '/sms/' . $messageId, null, false);
    }

    /**
     * Obtient les statistiques d'envoi
     */
    public function getStats($fromDate, $toDate, $deviceId = null) {
        $params = [
            'from_date' => $fromDate,
            'to_date' => $toDate
        ];

        if ($deviceId) {
            $params['device_id'] = $deviceId;
        }

        return $this->request('GET', '/sms/stats', $params, false);
    }
}
```

## Utilisation

### Configuration

```php
<?php
require_once 'ZimSend.php';

// Initialisation avec vos credentials
$zimsend = new ZimSend(
    getenv('ZIMSEND_API_KEY'),
    getenv('ZIMSEND_CLIENT_ID'),
    getenv('ZIMSEND_DEVICE_ID')
);
```

### Envoyer un SMS simple

```php
<?php
function sendSimpleSMS() {
    global $zimsend;

    $result = $zimsend->sendSMS(
        '+33612345678',
        'Bonjour ! Ceci est un message de test.'
    );

    if ($result['success']) {
        echo "SMS envoyé: " . $result['message_id'] . "\n";
        echo "Statut: " . $result['status'] . "\n";
    } else {
        echo "Erreur: " . $result['error']['message'] . "\n";
    }
}

sendSimpleSMS();
```

### Envoyer avec options avancées

```php
<?php
function sendAdvancedSMS() {
    global $zimsend;

    $result = $zimsend->sendSMS(
        '+33612345678',
        'Votre code de vérification : 123456',
        [
            'priority' => 1,
            'webhook_url' => 'https://monapp.com/webhooks/zimsend',
            'metadata' => [
                'user_id' => 'user_123',
                'type' => 'verification'
            ]
        ]
    );

    print_r($result);
}

sendAdvancedSMS();
```

### Envoyer en masse

```php
<?php
function sendBulkSMS() {
    global $zimsend;

    $recipients = [
        '+33612345678',
        '+33698765432',
        '+33687654321'
    ];

    $result = $zimsend->sendBulkSMS(
        $recipients,
        'Offre spéciale : -20% sur tout le site ce week-end !'
    );

    if ($result['success']) {
        echo "Total envoyé: " . $result['total_recipients'] . "\n";
        foreach ($result['messages'] as $msg) {
            echo "  - " . $msg['to'] . ": " . $msg['status'] . "\n";
        }
    } else {
        echo "Erreur: " . $result['error']['message'] . "\n";
    }
}

sendBulkSMS();
```

### Système OTP

```php
<?php
function authenticateWithOTP() {
    global $zimsend;

    $phoneNumber = '+33612345678';

    // Étape 1: Envoyer un code OTP
    $otpResult = $zimsend->sendOTP($phoneNumber, [
        'length' => 6,
        'expiry' => 300, // 5 minutes
        'template' => 'Votre code MonApp : {{code}}. Valide 5 minutes.'
    ]);

    if (!$otpResult['success']) {
        echo "Erreur envoi OTP: " . $otpResult['error']['message'] . "\n";
        return false;
    }

    $otpId = $otpResult['otp_id'];
    echo "OTP envoyé. Expire à: " . $otpResult['expires_at'] . "\n";

    // Étape 2: L'utilisateur saisit le code
    echo "Entrez le code reçu: ";
    $userCode = trim(fgets(STDIN));

    // Étape 3: Vérifier le code
    $verifyResult = $zimsend->verifyOTP($otpId, $userCode);

    if (isset($verifyResult['valid']) && $verifyResult['valid']) {
        echo "✓ Code correct ! Utilisateur authentifié.\n";
        return true;
    } else {
        echo "✗ Code incorrect: " . $verifyResult['message'] . "\n";
        echo "Tentatives restantes: " . $verifyResult['attempts_remaining'] . "\n";
        return false;
    }
}

authenticateWithOTP();
```

### Suivre les SMS

```php
<?php
function trackSMS() {
    global $zimsend;

    // Obtenir le statut d'un SMS
    $status = $zimsend->getStatus('msg_1234567890abcdef');

    if ($status['success']) {
        echo "Statut: " . $status['status'] . "\n";
        echo "Destinataire: " . $status['to'] . "\n";
        if (isset($status['delivered_at'])) {
            echo "Délivré à: " . $status['delivered_at'] . "\n";
        }
    } else {
        echo "Erreur: " . $status['error']['message'] . "\n";
    }

    // Obtenir l'historique
    $history = $zimsend->getHistory([
        'status' => 'delivered',
        'limit' => 50,
        'page' => 1
    ]);

    if ($history['success']) {
        echo "\nSMS délivrés: " . count($history['data']) . "\n";
        echo "Total: " . $history['pagination']['total_items'] . "\n";

        foreach ($history['data'] as $sms) {
            echo "  - " . $sms['to'] . ": " . substr($sms['message'], 0, 50) . "...\n";
        }
    } else {
        echo "Erreur: " . $history['error']['message'] . "\n";
    }

    // Obtenir les statistiques
    $stats = $zimsend->getStats(
        '2025-01-01T00:00:00Z',
        '2025-01-31T23:59:59Z'
    );

    if ($stats['success']) {
        echo "\nStatistiques du mois:\n";
        echo "Total envoyés: " . $stats['stats']['total_sent'] . "\n";
        echo "Délivrés: " . $stats['stats']['delivered'] . "\n";
        echo "Échoués: " . $stats['stats']['failed'] . "\n";
        echo "Taux de délivrance: " . $stats['stats']['delivery_rate'] . "%\n";
    } else {
        echo "Erreur: " . $stats['error']['message'] . "\n";
    }
}

trackSMS();
```

## Intégration avec GuzzleHTTP

Version alternative utilisant GuzzleHTTP :

```php
<?php

require 'vendor/autoload.php';

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

class ZimSendGuzzle {
    private $apiKey;
    private $clientId;
    private $deviceId;
    private $client;
    private $baseURL = 'https://api.zimsend.com/v1';

    public function __construct($apiKey, $clientId, $deviceId = null) {
        $this->apiKey = $apiKey;
        $this->clientId = $clientId;
        $this->deviceId = $deviceId;
        $this->client = new Client(['base_uri' => $this->baseURL]);
    }

    private function getHeaders($includeDevice = true) {
        $headers = [
            'Content-Type' => 'application/json',
            'X-API-Key' => $this->apiKey,
            'X-Client-ID' => $this->clientId
        ];

        if ($includeDevice && $this->deviceId) {
            $headers['X-Device-ID'] = $this->deviceId;
        }

        return $headers;
    }

    public function sendSMS($to, $message, $options = []) {
        try {
            $response = $this->client->post('/sms/send', [
                'headers' => $this->getHeaders(),
                'json' => array_merge([
                    'to' => $to,
                    'message' => $message
                ], $options)
            ]);

            return json_decode($response->getBody(), true);
        } catch (RequestException $e) {
            if ($e->hasResponse()) {
                return json_decode($e->getResponse()->getBody(), true);
            }
            return [
                'success' => false,
                'error' => [
                    'code' => 'NETWORK_ERROR',
                    'message' => $e->getMessage()
                ]
            ];
        }
    }

    public function sendBulkSMS($recipients, $message, $options = []) {
        try {
            $response = $this->client->post('/sms/send-bulk', [
                'headers' => $this->getHeaders(),
                'json' => array_merge([
                    'recipients' => $recipients,
                    'message' => $message
                ], $options)
            ]);

            return json_decode($response->getBody(), true);
        } catch (RequestException $e) {
            if ($e->hasResponse()) {
                return json_decode($e->getResponse()->getBody(), true);
            }
            return [
                'success' => false,
                'error' => [
                    'code' => 'NETWORK_ERROR',
                    'message' => $e->getMessage()
                ]
            ];
        }
    }

    public function sendOTP($to, $options = []) {
        try {
            $response = $this->client->post('/sms/send-otp', [
                'headers' => $this->getHeaders(),
                'json' => [
                    'to' => $to,
                    'length' => $options['length'] ?? 6,
                    'expiry' => $options['expiry'] ?? 300,
                    'template' => $options['template'] ?? null,
                    'metadata' => $options['metadata'] ?? null
                ]
            ]);

            return json_decode($response->getBody(), true);
        } catch (RequestException $e) {
            if ($e->hasResponse()) {
                return json_decode($e->getResponse()->getBody(), true);
            }
            return [
                'success' => false,
                'error' => [
                    'code' => 'NETWORK_ERROR',
                    'message' => $e->getMessage()
                ]
            ];
        }
    }

    public function verifyOTP($otpId, $code) {
        try {
            $response = $this->client->post('/sms/verify-otp', [
                'headers' => $this->getHeaders(false),
                'json' => [
                    'otp_id' => $otpId,
                    'code' => $code
                ]
            ]);

            return json_decode($response->getBody(), true);
        } catch (RequestException $e) {
            if ($e->hasResponse()) {
                return json_decode($e->getResponse()->getBody(), true);
            }
            return [
                'success' => false,
                'error' => [
                    'code' => 'NETWORK_ERROR',
                    'message' => $e->getMessage()
                ]
            ];
        }
    }

    public function getHistory($filters = []) {
        try {
            $response = $this->client->get('/sms/history', [
                'headers' => $this->getHeaders(false),
                'query' => $filters
            ]);

            return json_decode($response->getBody(), true);
        } catch (RequestException $e) {
            if ($e->hasResponse()) {
                return json_decode($e->getResponse()->getBody(), true);
            }
            return [
                'success' => false,
                'error' => [
                    'code' => 'NETWORK_ERROR',
                    'message' => $e->getMessage()
                ]
            ];
        }
    }
}
```

## Intégration Laravel

Exemple avec Laravel :

```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class ZimSendService {
    private $apiKey;
    private $clientId;
    private $deviceId;
    private $baseURL = 'https://api.zimsend.com/v1';

    public function __construct() {
        $this->apiKey = config('services.zimsend.api_key');
        $this->clientId = config('services.zimsend.client_id');
        $this->deviceId = config('services.zimsend.device_id');
    }

    private function getHeaders($includeDevice = true) {
        $headers = [
            'X-API-Key' => $this->apiKey,
            'X-Client-ID' => $this->clientId
        ];

        if ($includeDevice && $this->deviceId) {
            $headers['X-Device-ID'] = $this->deviceId;
        }

        return $headers;
    }

    public function sendSMS($to, $message, $options = []) {
        $response = Http::withHeaders($this->getHeaders())
            ->post($this->baseURL . '/sms/send', array_merge([
                'to' => $to,
                'message' => $message
            ], $options));

        return $response->json();
    }

    public function sendBulkSMS($recipients, $message, $options = []) {
        $response = Http::withHeaders($this->getHeaders())
            ->post($this->baseURL . '/sms/send-bulk', array_merge([
                'recipients' => $recipients,
                'message' => $message
            ], $options));

        return $response->json();
    }

    public function sendOTP($to, $options = []) {
        $response = Http::withHeaders($this->getHeaders())
            ->post($this->baseURL . '/sms/send-otp', [
                'to' => $to,
                'length' => $options['length'] ?? 6,
                'expiry' => $options['expiry'] ?? 300,
                'template' => $options['template'] ?? null,
                'metadata' => $options['metadata'] ?? null
            ]);

        return $response->json();
    }

    public function verifyOTP($otpId, $code) {
        $response = Http::withHeaders($this->getHeaders(false))
            ->post($this->baseURL . '/sms/verify-otp', [
                'otp_id' => $otpId,
                'code' => $code
            ]);

        return $response->json();
    }

    public function getHistory($filters = []) {
        $response = Http::withHeaders($this->getHeaders(false))
            ->get($this->baseURL . '/sms/history', $filters);

        return $response->json();
    }
}

// Controller
namespace App\Http\Controllers;

use App\Services\ZimSendService;
use Illuminate\Http\Request;

class SMSController extends Controller {
    private $zimsend;

    public function __construct(ZimSendService $zimsend) {
        $this->zimsend = $zimsend;
    }

    public function sendSMS(Request $request) {
        $request->validate([
            'to' => 'required|string',
            'message' => 'required|string'
        ]);

        $result = $this->zimsend->sendSMS(
            $request->input('to'),
            $request->input('message')
        );

        return response()->json($result);
    }

    public function sendOTP(Request $request) {
        $request->validate([
            'phoneNumber' => 'required|string'
        ]);

        $result = $this->zimsend->sendOTP($request->input('phoneNumber'), [
            'template' => 'Votre code : {{code}}'
        ]);

        if ($result['success']) {
            session(['otp_id' => $result['otp_id']]);

            return response()->json([
                'success' => true,
                'expires_at' => $result['expires_at']
            ]);
        }

        return response()->json($result, 400);
    }

    public function verifyOTP(Request $request) {
        $request->validate([
            'code' => 'required|string'
        ]);

        $otpId = session('otp_id');

        if (!$otpId) {
            return response()->json(['error' => 'Aucun OTP en attente'], 400);
        }

        $result = $this->zimsend->verifyOTP($otpId, $request->input('code'));

        if (isset($result['valid']) && $result['valid']) {
            session(['authenticated' => true]);
            session()->forget('otp_id');

            return response()->json([
                'success' => true,
                'message' => 'Code vérifié'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message'],
            'attempts_remaining' => $result['attempts_remaining']
        ], 400);
    }
}

// config/services.php
return [
    'zimsend' => [
        'api_key' => env('ZIMSEND_API_KEY'),
        'client_id' => env('ZIMSEND_CLIENT_ID'),
        'device_id' => env('ZIMSEND_DEVICE_ID'),
    ],
];
```

## Prochaines étapes

- [SDK Node.js](/sdks/nodejs) - Intégration JavaScript/TypeScript
- [SDK Python](/sdks/python) - Intégration Python
- [Guides d'envoi SMS](/guides/sending-sms) - En savoir plus sur les options d'envoi
