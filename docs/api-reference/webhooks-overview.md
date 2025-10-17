---
id: webhooks-overview
title: Webhooks
sidebar_label: Vue d'ensemble Webhooks
---

# Webhooks

Endpoints pour configurer et gérer vos webhooks.

## À propos des Webhooks

Les webhooks permettent à ZimSend de notifier votre application en temps réel lorsque des événements se produisent (changement de statut d'un SMS, échec de livraison, etc.).

## Fonctionnalités

- **Notifications en temps réel** : Recevez des mises à jour instantanées
- **Événements multiples** : Configurez des webhooks pour différents types d'événements
- **Sécurité** : Signature HMAC pour vérifier l'authenticité des requêtes
- **Retry automatique** : Nouvelle tentative en cas d'échec de livraison
- **Logs détaillés** : Consultez l'historique de tous les webhooks envoyés
- **Test intégré** : Testez vos webhooks avant leur mise en production

## Événements disponibles

- `sms.sent` : SMS envoyé avec succès
- `sms.delivered` : SMS livré au destinataire
- `sms.failed` : Échec d'envoi du SMS
- `sms.expired` : SMS expiré
- `otp.sent` : Code OTP envoyé
- `otp.verified` : Code OTP vérifié avec succès
- `otp.failed` : Échec de vérification OTP

## Sécurité

Tous les webhooks sont signés avec HMAC-SHA256. Consultez le [guide des webhooks](/webhooks/overview) pour apprendre à vérifier les signatures.

## Endpoints disponibles

Explorez les endpoints ci-dessous pour configurer vos webhooks.
