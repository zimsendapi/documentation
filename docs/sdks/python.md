---
sidebar_position: 2
---

# SDK Python

Intégrez facilement ZimSend dans vos applications Python avec notre wrapper API.

## Installation

Installez la bibliothèque requests :

```bash
pip install requests
```

## Classe Wrapper Complète

Créez un fichier `zimsend.py` :

```python
import requests
from typing import List, Dict, Optional, Any

class ZimSend:
    def __init__(self, api_key: str, client_id: str, device_id: Optional[str] = None):
        self.api_key = api_key
        self.client_id = client_id
        self.device_id = device_id
        self.base_url = 'https://api.zimsend.com/v1'

    def _get_headers(self, include_device: bool = True) -> Dict[str, str]:
        """Génère les headers d'authentification"""
        headers = {
            'Content-Type': 'application/json',
            'X-API-Key': self.api_key,
            'X-Client-ID': self.client_id
        }

        if include_device and self.device_id:
            headers['X-Device-ID'] = self.device_id

        return headers

    def _handle_error(self, response: requests.Response) -> Dict[str, Any]:
        """Gestion des erreurs API"""
        try:
            return response.json()
        except:
            return {
                'success': False,
                'error': {
                    'code': 'UNKNOWN_ERROR',
                    'message': response.text or 'Une erreur est survenue'
                }
            }

    def send_sms(self, to: str, message: str, **options) -> Dict[str, Any]:
        """
        Envoie un SMS simple

        Args:
            to: Numéro du destinataire (format international)
            message: Contenu du SMS
            **options: Options supplémentaires (priority, webhook_url, metadata, scheduled_at)

        Returns:
            Réponse de l'API
        """
        url = f'{self.base_url}/sms/send'
        data = {
            'to': to,
            'message': message,
            **options
        }

        try:
            response = requests.post(url, json=data, headers=self._get_headers())
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            if hasattr(e, 'response') and e.response is not None:
                return self._handle_error(e.response)
            return {
                'success': False,
                'error': {
                    'code': 'NETWORK_ERROR',
                    'message': str(e)
                }
            }

    def send_bulk_sms(self, recipients: List[str], message: str, **options) -> Dict[str, Any]:
        """
        Envoie des SMS en masse

        Args:
            recipients: Liste de numéros de destinataires
            message: Contenu du SMS
            **options: Options supplémentaires (priority, webhook_url, metadata)

        Returns:
            Réponse de l'API
        """
        url = f'{self.base_url}/sms/send-bulk'
        data = {
            'recipients': recipients,
            'message': message,
            **options
        }

        try:
            response = requests.post(url, json=data, headers=self._get_headers())
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            if hasattr(e, 'response') and e.response is not None:
                return self._handle_error(e.response)
            return {
                'success': False,
                'error': {
                    'code': 'NETWORK_ERROR',
                    'message': str(e)
                }
            }

    def send_bulk_personalized_sms(self, messages: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Envoie des SMS personnalisés en masse

        Args:
            messages: Liste de messages avec 'to' et 'message'

        Returns:
            Réponse de l'API
        """
        url = f'{self.base_url}/sms/send-bulk-personalized'
        data = {'messages': messages}

        try:
            response = requests.post(url, json=data, headers=self._get_headers())
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            if hasattr(e, 'response') and e.response is not None:
                return self._handle_error(e.response)
            return {
                'success': False,
                'error': {
                    'code': 'NETWORK_ERROR',
                    'message': str(e)
                }
            }

    def send_otp(self, to: str, **options) -> Dict[str, Any]:
        """
        Génère et envoie un code OTP

        Args:
            to: Numéro du destinataire
            **options: Options (length, expiry, template, metadata)

        Returns:
            Réponse de l'API avec otp_id
        """
        url = f'{self.base_url}/sms/send-otp'
        data = {
            'to': to,
            'length': options.get('length', 6),
            'expiry': options.get('expiry', 300),
            'template': options.get('template'),
            'metadata': options.get('metadata')
        }

        try:
            response = requests.post(url, json=data, headers=self._get_headers())
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            if hasattr(e, 'response') and e.response is not None:
                return self._handle_error(e.response)
            return {
                'success': False,
                'error': {
                    'code': 'NETWORK_ERROR',
                    'message': str(e)
                }
            }

    def verify_otp(self, otp_id: str, code: str) -> Dict[str, Any]:
        """
        Vérifie un code OTP

        Args:
            otp_id: ID de l'OTP
            code: Code saisi par l'utilisateur

        Returns:
            Réponse de l'API avec valid: True/False
        """
        url = f'{self.base_url}/sms/verify-otp'
        data = {
            'otp_id': otp_id,
            'code': code
        }

        try:
            response = requests.post(url, json=data, headers=self._get_headers(False))
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            if hasattr(e, 'response') and e.response is not None:
                return self._handle_error(e.response)
            return {
                'success': False,
                'error': {
                    'code': 'NETWORK_ERROR',
                    'message': str(e)
                }
            }

    def get_status(self, message_id: str) -> Dict[str, Any]:
        """
        Obtient le statut d'un SMS

        Args:
            message_id: ID du message

        Returns:
            Réponse de l'API avec le statut
        """
        url = f'{self.base_url}/sms/status/{message_id}'

        try:
            response = requests.get(url, headers=self._get_headers(False))
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            if hasattr(e, 'response') and e.response is not None:
                return self._handle_error(e.response)
            return {
                'success': False,
                'error': {
                    'code': 'NETWORK_ERROR',
                    'message': str(e)
                }
            }

    def get_history(self, **filters) -> Dict[str, Any]:
        """
        Récupère l'historique des SMS

        Args:
            **filters: Filtres (page, limit, status, to, from_date, to_date, etc.)

        Returns:
            Réponse de l'API avec la liste des SMS
        """
        url = f'{self.base_url}/sms/history'

        try:
            response = requests.get(url, params=filters, headers=self._get_headers(False))
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            if hasattr(e, 'response') and e.response is not None:
                return self._handle_error(e.response)
            return {
                'success': False,
                'error': {
                    'code': 'NETWORK_ERROR',
                    'message': str(e)
                }
            }

    def cancel_message(self, message_id: str) -> Dict[str, Any]:
        """
        Annule un SMS programmé

        Args:
            message_id: ID du message à annuler

        Returns:
            Réponse de l'API
        """
        url = f'{self.base_url}/sms/{message_id}'

        try:
            response = requests.delete(url, headers=self._get_headers(False))
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            if hasattr(e, 'response') and e.response is not None:
                return self._handle_error(e.response)
            return {
                'success': False,
                'error': {
                    'code': 'NETWORK_ERROR',
                    'message': str(e)
                }
            }

    def get_stats(self, from_date: str, to_date: str, device_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Obtient les statistiques d'envoi

        Args:
            from_date: Date de début (ISO 8601)
            to_date: Date de fin (ISO 8601)
            device_id: ID du device (optionnel)

        Returns:
            Réponse de l'API avec les statistiques
        """
        url = f'{self.base_url}/sms/stats'
        params = {
            'from_date': from_date,
            'to_date': to_date
        }

        if device_id:
            params['device_id'] = device_id

        try:
            response = requests.get(url, params=params, headers=self._get_headers(False))
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            if hasattr(e, 'response') and e.response is not None:
                return self._handle_error(e.response)
            return {
                'success': False,
                'error': {
                    'code': 'NETWORK_ERROR',
                    'message': str(e)
                }
            }
```

## Utilisation

### Configuration

```python
import os
from zimsend import ZimSend

# Initialisation avec vos credentials
zimsend = ZimSend(
    api_key=os.getenv('ZIMSEND_API_KEY'),
    client_id=os.getenv('ZIMSEND_CLIENT_ID'),
    device_id=os.getenv('ZIMSEND_DEVICE_ID')
)
```

### Envoyer un SMS simple

```python
def send_simple_sms():
    result = zimsend.send_sms(
        to='+33612345678',
        message='Bonjour ! Ceci est un message de test.'
    )

    if result['success']:
        print(f"SMS envoyé: {result['message_id']}")
        print(f"Statut: {result['status']}")
    else:
        print(f"Erreur: {result['error']['message']}")

send_simple_sms()
```

### Envoyer avec options avancées

```python
def send_advanced_sms():
    result = zimsend.send_sms(
        to='+33612345678',
        message='Votre code de vérification : 123456',
        priority=1,
        webhook_url='https://monapp.com/webhooks/zimsend',
        metadata={
            'user_id': 'user_123',
            'type': 'verification'
        }
    )

    print(f"Résultat: {result}")

send_advanced_sms()
```

### Envoyer en masse

```python
def send_bulk_sms():
    recipients = [
        '+33612345678',
        '+33698765432',
        '+33687654321'
    ]

    result = zimsend.send_bulk_sms(
        recipients=recipients,
        message='Offre spéciale : -20% sur tout le site ce week-end !'
    )

    if result['success']:
        print(f"Total envoyé: {result['total_recipients']}")
        for msg in result['messages']:
            print(f"  - {msg['to']}: {msg['status']}")
    else:
        print(f"Erreur: {result['error']['message']}")

send_bulk_sms()
```

### Système OTP

```python
def authenticate_with_otp():
    phone_number = '+33612345678'

    # Étape 1: Envoyer un code OTP
    otp_result = zimsend.send_otp(
        to=phone_number,
        length=6,
        expiry=300,  # 5 minutes
        template='Votre code MonApp : {{code}}. Valide 5 minutes.'
    )

    if not otp_result['success']:
        print(f"Erreur envoi OTP: {otp_result['error']['message']}")
        return

    otp_id = otp_result['otp_id']
    print(f"OTP envoyé. Expire à: {otp_result['expires_at']}")

    # Étape 2: L'utilisateur saisit le code
    user_code = input('Entrez le code reçu: ')

    # Étape 3: Vérifier le code
    verify_result = zimsend.verify_otp(otp_id, user_code)

    if verify_result.get('valid'):
        print('✓ Code correct ! Utilisateur authentifié.')
        return True
    else:
        print(f'✗ Code incorrect: {verify_result.get("message")}')
        print(f'Tentatives restantes: {verify_result.get("attempts_remaining")}')
        return False

authenticate_with_otp()
```

### Suivre les SMS

```python
def track_sms():
    # Obtenir le statut d'un SMS
    status = zimsend.get_status('msg_1234567890abcdef')

    if status['success']:
        print(f"Statut: {status['status']}")
        print(f"Destinataire: {status['to']}")
        if status.get('delivered_at'):
            print(f"Délivré à: {status['delivered_at']}")
    else:
        print(f"Erreur: {status['error']['message']}")

    # Obtenir l'historique
    history = zimsend.get_history(
        status='delivered',
        limit=50,
        page=1
    )

    if history['success']:
        print(f"\nSMS délivrés: {len(history['data'])}")
        print(f"Total: {history['pagination']['total_items']}")

        for sms in history['data']:
            print(f"  - {sms['to']}: {sms['message'][:50]}...")
    else:
        print(f"Erreur: {history['error']['message']}")

    # Obtenir les statistiques
    stats = zimsend.get_stats(
        from_date='2025-01-01T00:00:00Z',
        to_date='2025-01-31T23:59:59Z'
    )

    if stats['success']:
        print(f"\nStatistiques du mois:")
        print(f"Total envoyés: {stats['stats']['total_sent']}")
        print(f"Délivrés: {stats['stats']['delivered']}")
        print(f"Échoués: {stats['stats']['failed']}")
        print(f"Taux de délivrance: {stats['stats']['delivery_rate']}%")
    else:
        print(f"Erreur: {stats['error']['message']}")

track_sms()
```

## Intégration Flask

Exemple d'API REST avec Flask :

```python
from flask import Flask, request, jsonify, session
from zimsend import ZimSend
import os

app = Flask(__name__)
app.secret_key = 'votre_secret_key'

zimsend = ZimSend(
    api_key=os.getenv('ZIMSEND_API_KEY'),
    client_id=os.getenv('ZIMSEND_CLIENT_ID'),
    device_id=os.getenv('ZIMSEND_DEVICE_ID')
)

@app.route('/api/sms/send', methods=['POST'])
def send_sms():
    """Endpoint pour envoyer un SMS"""
    data = request.json
    to = data.get('to')
    message = data.get('message')

    if not to or not message:
        return jsonify({'error': 'Paramètres manquants'}), 400

    result = zimsend.send_sms(to, message)
    return jsonify(result)

@app.route('/api/otp/send', methods=['POST'])
def send_otp():
    """Endpoint pour envoyer un OTP"""
    data = request.json
    phone_number = data.get('phoneNumber')

    if not phone_number:
        return jsonify({'error': 'Numéro de téléphone manquant'}), 400

    result = zimsend.send_otp(
        to=phone_number,
        template='Votre code de vérification : {{code}}'
    )

    if result['success']:
        # Stocker l'otp_id en session
        session['otp_id'] = result['otp_id']

        return jsonify({
            'success': True,
            'expires_at': result['expires_at']
        })
    else:
        return jsonify(result), 400

@app.route('/api/otp/verify', methods=['POST'])
def verify_otp():
    """Endpoint pour vérifier un OTP"""
    data = request.json
    code = data.get('code')
    otp_id = session.get('otp_id')

    if not otp_id:
        return jsonify({'error': 'Aucun OTP en attente'}), 400

    if not code:
        return jsonify({'error': 'Code manquant'}), 400

    result = zimsend.verify_otp(otp_id, code)

    if result.get('valid'):
        # Authentifier l'utilisateur
        session['authenticated'] = True
        session.pop('otp_id', None)

        return jsonify({
            'success': True,
            'message': 'Code vérifié'
        })
    else:
        return jsonify({
            'success': False,
            'message': result.get('message'),
            'attempts_remaining': result.get('attempts_remaining')
        }), 400

@app.route('/api/sms/history', methods=['GET'])
def get_history():
    """Endpoint pour obtenir l'historique"""
    filters = {
        'page': request.args.get('page', 1, type=int),
        'limit': request.args.get('limit', 50, type=int),
        'status': request.args.get('status')
    }

    # Supprimer les paramètres None
    filters = {k: v for k, v in filters.items() if v is not None}

    result = zimsend.get_history(**filters)
    return jsonify(result)

@app.route('/api/sms/status/<message_id>', methods=['GET'])
def get_status(message_id):
    """Endpoint pour obtenir le statut d'un SMS"""
    result = zimsend.get_status(message_id)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
```

## Intégration Django

Exemple avec Django :

```python
# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from zimsend import ZimSend
import os

zimsend = ZimSend(
    api_key=os.getenv('ZIMSEND_API_KEY'),
    client_id=os.getenv('ZIMSEND_CLIENT_ID'),
    device_id=os.getenv('ZIMSEND_DEVICE_ID')
)

@csrf_exempt
@require_http_methods(["POST"])
def send_sms(request):
    """Vue pour envoyer un SMS"""
    try:
        data = json.loads(request.body)
        to = data.get('to')
        message = data.get('message')

        if not to or not message:
            return JsonResponse({'error': 'Paramètres manquants'}, status=400)

        result = zimsend.send_sms(to, message)
        return JsonResponse(result)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def send_otp(request):
    """Vue pour envoyer un OTP"""
    try:
        data = json.loads(request.body)
        phone_number = data.get('phoneNumber')

        if not phone_number:
            return JsonResponse({'error': 'Numéro manquant'}, status=400)

        result = zimsend.send_otp(
            to=phone_number,
            template='Votre code : {{code}}'
        )

        if result['success']:
            # Stocker l'otp_id en session
            request.session['otp_id'] = result['otp_id']

            return JsonResponse({
                'success': True,
                'expires_at': result['expires_at']
            })
        else:
            return JsonResponse(result, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def verify_otp(request):
    """Vue pour vérifier un OTP"""
    try:
        data = json.loads(request.body)
        code = data.get('code')
        otp_id = request.session.get('otp_id')

        if not otp_id:
            return JsonResponse({'error': 'Aucun OTP en attente'}, status=400)

        result = zimsend.verify_otp(otp_id, code)

        if result.get('valid'):
            request.session['authenticated'] = True
            del request.session['otp_id']

            return JsonResponse({
                'success': True,
                'message': 'Code vérifié'
            })
        else:
            return JsonResponse({
                'success': False,
                'message': result.get('message'),
                'attempts_remaining': result.get('attempts_remaining')
            }, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(["GET"])
def get_history(request):
    """Vue pour obtenir l'historique"""
    filters = {
        'page': request.GET.get('page', 1),
        'limit': request.GET.get('limit', 50),
        'status': request.GET.get('status')
    }

    # Supprimer les paramètres None
    filters = {k: v for k, v in filters.items() if v is not None}

    result = zimsend.get_history(**filters)
    return JsonResponse(result)
```

## Prochaines étapes

- [SDK Node.js](/sdks/nodejs) - Intégration JavaScript/TypeScript
- [SDK PHP](/sdks/php) - Intégration PHP
- [Guides d'envoi SMS](/guides/sending-sms) - En savoir plus sur les options d'envoi
