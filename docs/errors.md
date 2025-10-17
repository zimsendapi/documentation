---
sidebar_position: 11
---

# Codes d'erreur

Liste complète des codes d'erreur retournés par l'API ZimSend et comment les gérer.

## Format des erreurs

Toutes les erreurs suivent ce format :

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Description de l'erreur"
  }
}
```

## Codes HTTP

| Code | Signification |
|------|---------------|
| 200 | Succès |
| 400 | Requête invalide |
| 401 | Non autorisé (authentification échouée) |
| 403 | Interdit (permissions insuffisantes) |
| 404 | Ressource non trouvée |
| 429 | Trop de requêtes (rate limit) |
| 500 | Erreur serveur interne |
| 503 | Service indisponible |

## Erreurs d'authentification

### INVALID_API_KEY

**Code HTTP :** 401

```json
{
  "success": false,
  "error": {
    "code": "INVALID_API_KEY",
    "message": "La clé API fournie est invalide ou a expiré"
  }
}
```

**Causes possibles :**
- Clé API incorrecte
- Clé API révoquée
- Clé API expirée

**Solution :**
- Vérifiez votre clé API dans le dashboard
- Créez une nouvelle clé si nécessaire
- Vérifiez qu'il n'y a pas d'espaces avant/après la clé

### INVALID_CLIENT_ID

**Code HTTP :** 401

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CLIENT_ID",
    "message": "Le Client ID fourni n'existe pas"
  }
}
```

**Causes possibles :**
- Client ID incorrect
- Compte supprimé ou suspendu

**Solution :**
- Vérifiez votre Client ID dans le dashboard
- Contactez le support si le problème persiste

### MISSING_AUTH_HEADERS

**Code HTTP :** 400

```json
{
  "success": false,
  "error": {
    "code": "MISSING_AUTH_HEADERS",
    "message": "Les headers d'authentification requis sont manquants"
  }
}
```

**Causes possibles :**
- Headers `X-API-Key` ou `X-Client-ID` manquants

**Solution :**
- Vérifiez que vous envoyez bien tous les headers requis

## Erreurs de Device

### INVALID_DEVICE_ID

**Code HTTP :** 404

```json
{
  "success": false,
  "error": {
    "code": "INVALID_DEVICE_ID",
    "message": "Le Device ID fourni n'existe pas ou n'appartient pas à ce client"
  }
}
```

**Causes possibles :**
- Device ID incorrect
- Device supprimé
- Device appartenant à un autre compte

**Solution :**
- Vérifiez votre Device ID dans le dashboard
- Assurez-vous que le device existe et est associé à votre compte

### DEVICE_OFFLINE

**Code HTTP :** 503

```json
{
  "success": false,
  "error": {
    "code": "DEVICE_OFFLINE",
    "message": "Le device spécifié est actuellement hors ligne"
  }
}
```

**Causes possibles :**
- Téléphone éteint
- Application ZimSend fermée
- Pas de connexion Internet
- Mode avion activé

**Solution :**
- Vérifiez que le téléphone est allumé
- Ouvrez l'application ZimSend
- Vérifiez la connexion Internet (WiFi ou données mobiles)
- Consultez le statut du device dans le dashboard

### NO_DEVICE_AVAILABLE

**Code HTTP :** 503

```json
{
  "success": false,
  "error": {
    "code": "NO_DEVICE_AVAILABLE",
    "message": "Aucun device n'est actuellement disponible pour envoyer ce SMS"
  }
}
```

**Causes possibles :**
- Tous vos devices sont hors ligne
- Aucun device configuré

**Solution :**
- Connectez au moins un téléphone Android
- Vérifiez que les devices sont en ligne dans le dashboard

## Erreurs de validation

### INVALID_PHONE_NUMBER

**Code HTTP :** 400

```json
{
  "success": false,
  "error": {
    "code": "INVALID_PHONE_NUMBER",
    "message": "Le numéro de téléphone fourni n'est pas valide"
  }
}
```

**Causes possibles :**
- Format de numéro incorrect
- Numéro incomplet
- Caractères invalides

**Solution :**
- Utilisez le format international : `+33612345678`
- Vérifiez qu'il n'y a pas d'espaces ou de caractères spéciaux
- Le numéro doit commencer par `+`

### MESSAGE_TOO_LONG

**Code HTTP :** 400

```json
{
  "success": false,
  "error": {
    "code": "MESSAGE_TOO_LONG",
    "message": "Le message dépasse la longueur maximale de 1600 caractères"
  }
}
```

**Causes possibles :**
- Message de plus de 1600 caractères

**Solution :**
- Réduisez la taille de votre message
- Divisez en plusieurs SMS si nécessaire

### INVALID_PRIORITY

**Code HTTP :** 400

```json
{
  "success": false,
  "error": {
    "code": "INVALID_PRIORITY",
    "message": "La priorité doit être 'low', 'normal' ou 'high'"
  }
}
```

**Causes possibles :**
- Valeur de priorité incorrecte

**Solution :**
- Utilisez uniquement : `low`, `normal` ou `high`

### INVALID_SCHEDULED_DATE

**Code HTTP :** 400

```json
{
  "success": false,
  "error": {
    "code": "INVALID_SCHEDULED_DATE",
    "message": "La date programmée doit être dans le futur et au format ISO 8601"
  }
}
```

**Causes possibles :**
- Date dans le passé
- Format de date incorrect
- Date trop éloignée (> 30 jours)

**Solution :**
- Utilisez le format ISO 8601 : `2025-01-15T10:30:00Z`
- Vérifiez que la date est dans le futur
- Maximum 30 jours à l'avance

## Erreurs d'envoi SMS

### NETWORK_ERROR

**Code HTTP :** 500

```json
{
  "success": false,
  "error": {
    "code": "NETWORK_ERROR",
    "message": "Impossible de joindre le réseau mobile"
  }
}
```

**Causes possibles :**
- Problème de réseau mobile
- Pas de signal
- Opérateur indisponible

**Solution :**
- Vérifiez le signal mobile du téléphone
- Réessayez dans quelques minutes
- Changez de device si vous en avez plusieurs

### NO_CREDIT

**Code HTTP :** 402

```json
{
  "success": false,
  "error": {
    "code": "NO_CREDIT",
    "message": "Crédit téléphone insuffisant pour envoyer ce SMS"
  }
}
```

**Causes possibles :**
- Forfait mobile épuisé
- Carte SIM prépayée sans crédit

**Solution :**
- Rechargez votre forfait mobile
- Vérifiez votre crédit auprès de votre opérateur

### BLOCKED_NUMBER

**Code HTTP :** 403

```json
{
  "success": false,
  "error": {
    "code": "BLOCKED_NUMBER",
    "message": "Ce numéro est bloqué ou blacklisté"
  }
}
```

**Causes possibles :**
- Numéro dans votre blacklist
- Numéro bloqué par l'opérateur
- Numéro invalide

**Solution :**
- Vérifiez votre liste de numéros bloqués
- Contactez votre opérateur si le numéro devrait fonctionner

### SMS_SEND_TIMEOUT

**Code HTTP :** 504

```json
{
  "success": false,
  "error": {
    "code": "SMS_SEND_TIMEOUT",
    "message": "Le délai d'envoi du SMS a expiré"
  }
}
```

**Causes possibles :**
- Réseau mobile lent
- Device non réactif
- Problème temporaire

**Solution :**
- Réessayez l'envoi
- Vérifiez la connexion du device
- Redémarrez l'application ZimSend si nécessaire

## Erreurs OTP

### OTP_EXPIRED

**Code HTTP :** 400

```json
{
  "success": false,
  "error": {
    "code": "OTP_EXPIRED",
    "message": "Le code OTP a expiré"
  }
}
```

**Causes possibles :**
- Code expiré (> 5 minutes par défaut)

**Solution :**
- Demandez un nouveau code OTP
- Utilisez le code dans les 5 minutes

### OTP_MAX_ATTEMPTS

**Code HTTP :** 429

```json
{
  "success": false,
  "error": {
    "code": "OTP_MAX_ATTEMPTS",
    "message": "Nombre maximum de tentatives atteint"
  }
}
```

**Causes possibles :**
- 3 tentatives de vérification échouées

**Solution :**
- Demandez un nouveau code OTP
- Vérifiez que l'utilisateur saisit le bon code

### OTP_NOT_FOUND

**Code HTTP :** 404

```json
{
  "success": false,
  "error": {
    "code": "OTP_NOT_FOUND",
    "message": "L'OTP spécifié n'existe pas"
  }
}
```

**Causes possibles :**
- OTP ID incorrect
- OTP déjà utilisé
- OTP expiré et supprimé

**Solution :**
- Vérifiez l'OTP ID
- Générez un nouveau code OTP

### OTP_RATE_LIMIT

**Code HTTP :** 429

```json
{
  "success": false,
  "error": {
    "code": "OTP_RATE_LIMIT",
    "message": "Trop de codes OTP demandés pour ce numéro"
  }
}
```

**Causes possibles :**
- Plus de 10 OTP par heure pour un même numéro

**Solution :**
- Attendez 1 heure
- Implémentez un délai entre les demandes côté client

## Erreurs de ressources

### MESSAGE_NOT_FOUND

**Code HTTP :** 404

```json
{
  "success": false,
  "error": {
    "code": "MESSAGE_NOT_FOUND",
    "message": "Le message spécifié n'existe pas"
  }
}
```

**Causes possibles :**
- Message ID incorrect
- Message supprimé
- Message trop ancien (> 90 jours)

**Solution :**
- Vérifiez le message ID
- Les messages sont conservés 90 jours

### CANNOT_CANCEL_MESSAGE

**Code HTTP :** 400

```json
{
  "success": false,
  "error": {
    "code": "CANNOT_CANCEL_MESSAGE",
    "message": "Ce message ne peut pas être annulé (déjà envoyé)"
  }
}
```

**Causes possibles :**
- Message déjà envoyé (`sent` ou `delivered`)
- Message déjà annulé

**Solution :**
- Vous ne pouvez annuler que les messages avec le statut `queued`

## Erreurs de rate limiting

### RATE_LIMIT_EXCEEDED

**Code HTTP :** 429

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Vous avez dépassé le nombre maximum de requêtes par minute"
  }
}
```

**Causes possibles :**
- Plus de 100 requêtes par minute

**Solution :**
- Attendez 1 minute
- Réduisez la fréquence de vos requêtes
- Utilisez l'envoi en masse pour grouper les SMS

### TOO_MANY_RECIPIENTS

**Code HTTP :** 400

```json
{
  "success": false,
  "error": {
    "code": "TOO_MANY_RECIPIENTS",
    "message": "Nombre maximum de destinataires dépassé (max: 100)"
  }
}
```

**Causes possibles :**
- Plus de 100 destinataires dans une requête bulk

**Solution :**
- Divisez vos envois en lots de 100 maximum

## Erreurs de webhook

### INVALID_WEBHOOK_URL

**Code HTTP :** 400

```json
{
  "success": false,
  "error": {
    "code": "INVALID_WEBHOOK_URL",
    "message": "L'URL de webhook doit utiliser HTTPS"
  }
}
```

**Causes possibles :**
- URL HTTP au lieu de HTTPS
- URL invalide

**Solution :**
- Utilisez uniquement HTTPS : `https://...`
- Vérifiez que l'URL est valide et accessible

## Gérer les erreurs dans votre code

### JavaScript / Node.js

```javascript
async function sendSMS(to, message) {
  try {
    const result = await zimsend.sendSMS(to, message);

    if (!result.success) {
      // Gérer selon le code d'erreur
      switch(result.error.code) {
        case 'DEVICE_OFFLINE':
          console.error('Device hors ligne, réessayez plus tard');
          // Notifier l'admin
          break;

        case 'INVALID_PHONE_NUMBER':
          console.error('Numéro invalide:', to);
          // Valider côté client avant l'envoi
          break;

        case 'RATE_LIMIT_EXCEEDED':
          console.error('Rate limit atteint, pause de 60s');
          // Attendre 1 minute
          await new Promise(resolve => setTimeout(resolve, 60000));
          break;

        default:
          console.error('Erreur:', result.error.message);
      }

      return false;
    }

    console.log('SMS envoyé:', result.message_id);
    return true;
  } catch (error) {
    console.error('Erreur réseau:', error);
    return false;
  }
}
```

### Python

```python
def send_sms(to, message):
    try:
        result = zimsend.send_sms(to, message)

        if not result['success']:
            error_code = result['error']['code']

            # Gérer selon le code d'erreur
            if error_code == 'DEVICE_OFFLINE':
                print('Device hors ligne, réessayez plus tard')
                # Notifier l'admin

            elif error_code == 'INVALID_PHONE_NUMBER':
                print(f'Numéro invalide: {to}')
                # Valider côté client avant l'envoi

            elif error_code == 'RATE_LIMIT_EXCEEDED':
                print('Rate limit atteint, pause de 60s')
                # Attendre 1 minute
                time.sleep(60)

            else:
                print(f"Erreur: {result['error']['message']}")

            return False

        print(f"SMS envoyé: {result['message_id']}")
        return True

    except Exception as e:
        print(f'Erreur réseau: {str(e)}')
        return False
```

### PHP

```php
<?php
function sendSMS($to, $message) {
    global $zimsend;

    $result = $zimsend->sendSMS($to, $message);

    if (!$result['success']) {
        $errorCode = $result['error']['code'];

        // Gérer selon le code d'erreur
        switch($errorCode) {
            case 'DEVICE_OFFLINE':
                error_log('Device hors ligne, réessayez plus tard');
                // Notifier l'admin
                break;

            case 'INVALID_PHONE_NUMBER':
                error_log("Numéro invalide: $to");
                // Valider côté client avant l'envoi
                break;

            case 'RATE_LIMIT_EXCEEDED':
                error_log('Rate limit atteint, pause de 60s');
                // Attendre 1 minute
                sleep(60);
                break;

            default:
                error_log("Erreur: " . $result['error']['message']);
        }

        return false;
    }

    error_log("SMS envoyé: " . $result['message_id']);
    return true;
}
?>
```

## Retry Strategy

Recommandations pour réessayer après une erreur :

| Code d'erreur | Retry ? | Délai |
|---------------|---------|-------|
| `DEVICE_OFFLINE` | Oui | 1-5 minutes |
| `NETWORK_ERROR` | Oui | 30 secondes |
| `RATE_LIMIT_EXCEEDED` | Oui | 60 secondes |
| `SMS_SEND_TIMEOUT` | Oui | 1 minute |
| `INVALID_PHONE_NUMBER` | Non | - |
| `INVALID_API_KEY` | Non | - |
| `MESSAGE_TOO_LONG` | Non | - |

## Prochaines étapes

- [FAQ](/faq) - Questions fréquentes
- [Webhooks](/webhooks/overview) - Gérer les erreurs via webhooks
- [Support](mailto:support@zimsend.com) - Contactez-nous
