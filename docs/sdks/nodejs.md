---
sidebar_position: 1
---

# SDK Node.js / JavaScript

Intégrez facilement ZimSend dans vos applications Node.js et JavaScript avec notre wrapper API.

## Installation

Installez les dépendances nécessaires :

```bash
npm install axios
# ou
yarn add axios
```

## Classe Wrapper Complète

Créez un fichier `zimsend.js` :

```javascript
const axios = require('axios');

class ZimSend {
  constructor(apiKey, clientId, deviceId = null) {
    this.apiKey = apiKey;
    this.clientId = clientId;
    this.deviceId = deviceId;
    this.baseURL = 'https://api.zimsend.com/v1';
  }

  /**
   * Headers d'authentification
   */
  getHeaders(includeDevice = true) {
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
      'X-Client-ID': this.clientId
    };

    if (includeDevice && this.deviceId) {
      headers['X-Device-ID'] = this.deviceId;
    }

    return headers;
  }

  /**
   * Envoyer un SMS simple
   */
  async sendSMS(to, message, options = {}) {
    try {
      const response = await axios.post(
        `${this.baseURL}/sms/send`,
        {
          to,
          message,
          ...options
        },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Envoyer des SMS en masse
   */
  async sendBulkSMS(recipients, message, options = {}) {
    try {
      const response = await axios.post(
        `${this.baseURL}/sms/send-bulk`,
        {
          recipients,
          message,
          ...options
        },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Envoyer des SMS personnalisés en masse
   */
  async sendBulkPersonalizedSMS(messages) {
    try {
      const response = await axios.post(
        `${this.baseURL}/sms/send-bulk-personalized`,
        { messages },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Générer et envoyer un code OTP
   */
  async sendOTP(to, options = {}) {
    try {
      const response = await axios.post(
        `${this.baseURL}/sms/send-otp`,
        {
          to,
          length: options.length || 6,
          expiry: options.expiry || 300,
          template: options.template,
          metadata: options.metadata
        },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Vérifier un code OTP
   */
  async verifyOTP(otpId, code) {
    try {
      const response = await axios.post(
        `${this.baseURL}/sms/verify-otp`,
        { otp_id: otpId, code },
        { headers: this.getHeaders(false) }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtenir le statut d'un SMS
   */
  async getStatus(messageId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/sms/status/${messageId}`,
        { headers: this.getHeaders(false) }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtenir l'historique des SMS
   */
  async getHistory(filters = {}) {
    try {
      const response = await axios.get(
        `${this.baseURL}/sms/history`,
        {
          params: filters,
          headers: this.getHeaders(false)
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Annuler un SMS programmé
   */
  async cancelMessage(messageId) {
    try {
      const response = await axios.delete(
        `${this.baseURL}/sms/${messageId}`,
        { headers: this.getHeaders(false) }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtenir les statistiques
   */
  async getStats(fromDate, toDate, deviceId = null) {
    try {
      const params = {
        from_date: fromDate,
        to_date: toDate
      };

      if (deviceId) {
        params.device_id = deviceId;
      }

      const response = await axios.get(
        `${this.baseURL}/sms/stats`,
        {
          params,
          headers: this.getHeaders(false)
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Gestion des erreurs
   */
  handleError(error) {
    if (error.response) {
      const apiError = error.response.data;
      return {
        success: false,
        error: apiError.error || {
          code: 'UNKNOWN_ERROR',
          message: error.message
        }
      };
    }
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error.message
      }
    };
  }
}

module.exports = ZimSend;
```

## Utilisation

### Configuration

```javascript
const ZimSend = require('./zimsend');

// Initialisation avec vos credentials
const zimsend = new ZimSend(
  process.env.ZIMSEND_API_KEY,
  process.env.ZIMSEND_CLIENT_ID,
  process.env.ZIMSEND_DEVICE_ID
);
```

### Envoyer un SMS simple

```javascript
async function sendSimpleSMS() {
  try {
    const result = await zimsend.sendSMS(
      '+33612345678',
      'Bonjour ! Ceci est un message de test.'
    );

    console.log('SMS envoyé:', result);
    // {
    //   success: true,
    //   message_id: "msg_1234567890abcdef",
    //   status: "queued",
    //   to: "+33612345678",
    //   queued_at: "2025-01-15T10:30:00Z"
    // }
  } catch (error) {
    console.error('Erreur:', error);
  }
}

sendSimpleSMS();
```

### Envoyer avec options avancées

```javascript
async function sendAdvancedSMS() {
  try {
    const result = await zimsend.sendSMS(
      '+33612345678',
      'Votre code de vérification : 123456',
      {
        priority: 1,
        webhook_url: 'https://monapp.com/webhooks/zimsend',
        metadata: {
          user_id: 'user_123',
          type: 'verification'
        }
      }
    );

    console.log('SMS envoyé:', result);
  } catch (error) {
    console.error('Erreur:', error);
  }
}

sendAdvancedSMS();
```

### Envoyer en masse

```javascript
async function sendBulkSMS() {
  try {
    const recipients = [
      '+33612345678',
      '+33698765432',
      '+33687654321'
    ];

    const result = await zimsend.sendBulkSMS(
      recipients,
      'Offre spéciale : -20% sur tout le site ce week-end !'
    );

    console.log('SMS envoyés:', result);
    console.log('Total:', result.total_recipients);
  } catch (error) {
    console.error('Erreur:', error);
  }
}

sendBulkSMS();
```

### Système OTP

```javascript
// Étape 1 : Envoyer un code OTP
async function sendOTP(phoneNumber) {
  try {
    const result = await zimsend.sendOTP(phoneNumber, {
      length: 6,
      expiry: 300, // 5 minutes
      template: 'Votre code MonApp : {{code}}. Valide 5 minutes.'
    });

    console.log('OTP envoyé:', result);
    // Stocker l'otp_id pour la vérification
    return result.otp_id;
  } catch (error) {
    console.error('Erreur:', error);
  }
}

// Étape 2 : Vérifier le code OTP
async function verifyOTP(otpId, userCode) {
  try {
    const result = await zimsend.verifyOTP(otpId, userCode);

    if (result.valid) {
      console.log('Code correct !');
      // Authentifier l'utilisateur
      return true;
    } else {
      console.log('Code incorrect');
      console.log('Tentatives restantes:', result.attempts_remaining);
      return false;
    }
  } catch (error) {
    console.error('Erreur:', error);
    return false;
  }
}

// Utilisation complète
async function authenticateWithOTP() {
  const phoneNumber = '+33612345678';

  // Envoyer le code
  const otpId = await sendOTP(phoneNumber);

  // Simuler la saisie utilisateur
  const userCode = '123456'; // Code saisi par l'utilisateur

  // Vérifier le code
  const isValid = await verifyOTP(otpId, userCode);

  if (isValid) {
    console.log('Utilisateur authentifié avec succès !');
  } else {
    console.log('Échec de l\'authentification');
  }
}

authenticateWithOTP();
```

### Suivre les SMS

```javascript
async function trackSMS() {
  try {
    // Obtenir le statut d'un SMS
    const status = await zimsend.getStatus('msg_1234567890abcdef');
    console.log('Statut:', status.status);
    console.log('Délivré à:', status.delivered_at);

    // Obtenir l'historique
    const history = await zimsend.getHistory({
      status: 'delivered',
      limit: 50,
      page: 1
    });

    console.log('SMS délivrés:', history.data.length);
    console.log('Total:', history.pagination.total_items);

    // Obtenir les statistiques
    const stats = await zimsend.getStats(
      '2025-01-01T00:00:00Z',
      '2025-01-31T23:59:59Z'
    );

    console.log('Total envoyés:', stats.stats.total_sent);
    console.log('Taux de délivrance:', stats.stats.delivery_rate + '%');
  } catch (error) {
    console.error('Erreur:', error);
  }
}

trackSMS();
```

## Intégration Express.js

Exemple d'API REST avec Express :

```javascript
const express = require('express');
const ZimSend = require('./zimsend');

const app = express();
app.use(express.json());

const zimsend = new ZimSend(
  process.env.ZIMSEND_API_KEY,
  process.env.ZIMSEND_CLIENT_ID,
  process.env.ZIMSEND_DEVICE_ID
);

// Endpoint pour envoyer un SMS
app.post('/api/sms/send', async (req, res) => {
  const { to, message } = req.body;

  try {
    const result = await zimsend.sendSMS(to, message);
    res.json(result);
  } catch (error) {
    res.status(400).json(error);
  }
});

// Endpoint pour envoyer un OTP
app.post('/api/otp/send', async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const result = await zimsend.sendOTP(phoneNumber, {
      template: 'Votre code de vérification : {{code}}'
    });

    // Stocker l'otp_id en session
    req.session.otp_id = result.otp_id;

    res.json({
      success: true,
      expires_at: result.expires_at
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

// Endpoint pour vérifier un OTP
app.post('/api/otp/verify', async (req, res) => {
  const { code } = req.body;
  const otpId = req.session.otp_id;

  if (!otpId) {
    return res.status(400).json({
      error: 'Aucun OTP en attente'
    });
  }

  try {
    const result = await zimsend.verifyOTP(otpId, code);

    if (result.valid) {
      // Authentifier l'utilisateur
      req.session.authenticated = true;
      delete req.session.otp_id;

      res.json({
        success: true,
        message: 'Code vérifié'
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        attempts_remaining: result.attempts_remaining
      });
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

// Endpoint pour obtenir l'historique
app.get('/api/sms/history', async (req, res) => {
  try {
    const history = await zimsend.getHistory(req.query);
    res.json(history);
  } catch (error) {
    res.status(400).json(error);
  }
});

app.listen(3000, () => {
  console.log('API démarrée sur le port 3000');
});
```

## Version TypeScript

Pour TypeScript, créez `zimsend.ts` :

```typescript
import axios, { AxiosError } from 'axios';

interface SendSMSOptions {
  priority?: 1 | 2 | 3  | 4 | 5;
  webhook_url?: string;
  metadata?: Record<string, any>;
  scheduled_at?: string;
}

interface SendOTPOptions {
  length?: number;
  expiry?: number;
  template?: string;
  metadata?: Record<string, any>;
}

interface HistoryFilters {
  page?: number;
  limit?: number;
  status?: 'queued' | 'sent' | 'delivered' | 'failed';
  to?: string;
  from_date?: string;
  to_date?: string;
  device_id?: string;
  search?: string;
}

class ZimSend {
  private apiKey: string;
  private clientId: string;
  private deviceId: string | null;
  private baseURL: string = 'https://api.zimsend.com/v1';

  constructor(apiKey: string, clientId: string, deviceId: string | null = null) {
    this.apiKey = apiKey;
    this.clientId = clientId;
    this.deviceId = deviceId;
  }

  private getHeaders(includeDevice: boolean = true): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
      'X-Client-ID': this.clientId
    };

    if (includeDevice && this.deviceId) {
      headers['X-Device-ID'] = this.deviceId;
    }

    return headers;
  }

  async sendSMS(to: string, message: string, options: SendSMSOptions = {}): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseURL}/sms/send`,
        { to, message, ...options },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async sendBulkSMS(recipients: string[], message: string, options: SendSMSOptions = {}): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseURL}/sms/send-bulk`,
        { recipients, message, ...options },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async sendOTP(to: string, options: SendOTPOptions = {}): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseURL}/sms/send-otp`,
        {
          to,
          length: options.length || 6,
          expiry: options.expiry || 300,
          template: options.template,
          metadata: options.metadata
        },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async verifyOTP(otpId: string, code: string): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseURL}/sms/verify-otp`,
        { otp_id: otpId, code },
        { headers: this.getHeaders(false) }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async getStatus(messageId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseURL}/sms/status/${messageId}`,
        { headers: this.getHeaders(false) }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async getHistory(filters: HistoryFilters = {}): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseURL}/sms/history`,
        {
          params: filters,
          headers: this.getHeaders(false)
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  private handleError(error: AxiosError): any {
    if (error.response) {
      return error.response.data;
    }
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error.message
      }
    };
  }
}

export default ZimSend;
```

## Prochaines étapes

- [SDK Python](/sdks/python) - Intégration Python
- [SDK PHP](/sdks/php) - Intégration PHP
- [Guides d'envoi SMS](/guides/sending-sms) - En savoir plus sur les options d'envoi
