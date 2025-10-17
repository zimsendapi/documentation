---
sidebar_position: 1
---

# Introduction à ZimSend

Bienvenue sur ZimSend, la plateforme d'API SMS qui vous permet d'envoyer des SMS depuis vos applications en utilisant votre propre téléphone Android comme gateway.

## Qu'est-ce que ZimSend ?

ZimSend est une API SMS similaire à Twilio, mais avec une approche différente : au lieu de passer par des opérateurs tiers coûteux, vous utilisez **votre propre téléphone Android** comme passerelle pour envoyer des SMS. Cela vous permet de contrôler totalement vos envois et de réduire drastiquement vos coûts.

## Comment ça marche ?

Le fonctionnement de ZimSend est simple :

1. **Vous créez un compte** sur [app.zimsend.com](https://app.zimsend.com)
2. **Vous connectez votre téléphone Android** en installant notre application
3. **Vous intégrez notre API** dans votre application web ou mobile
4. **Vos SMS sont envoyés** via votre téléphone Android connecté

Votre téléphone reste connecté à Internet et reçoit les instructions d'envoi de SMS via notre API. Les SMS sont envoyés directement depuis votre carte SIM, comme si vous les envoyiez manuellement.

## Pourquoi choisir ZimSend ?

### Économies considérables

Avec ZimSend, vous ne payez **aucun frais par SMS**. Vous utilisez simplement votre forfait mobile existant. Si vous avez un forfait illimité, vos SMS sont gratuits. Plus besoin de payer 0,05€ ou plus par SMS comme avec les fournisseurs traditionnels.

### Contrôle total

- Utilisez votre propre numéro de téléphone
- Gérez vos propres limites d'envoi
- Accédez à l'historique complet depuis le dashboard
- Pas de dépendance à un fournisseur tiers

### Simplicité d'intégration

Notre API REST est simple et intuitive. Si vous avez déjà utilisé Twilio ou d'autres services similaires, vous serez en terrain connu.

### Fiabilité

- Système de webhooks pour suivre l'état de vos SMS
- Retry automatique en cas d'échec
- Gestion de file d'attente pour les envois en masse
- Support de plusieurs devices pour la redondance

## Cas d'usage

ZimSend est parfait pour :

### Authentification à deux facteurs (2FA)

Envoyez des codes de vérification par SMS pour sécuriser les connexions de vos utilisateurs.

```
"Votre code de vérification est : 123456"
```

### Notifications transactionnelles

Informez vos clients des événements importants :
- Confirmation de commande
- Notification de livraison
- Alertes de sécurité
- Rappels de rendez-vous

### Marketing et promotions

Communiquez avec vos clients :
- Offres promotionnelles
- Nouveautés produits
- Invitations à des événements
- Programmes de fidélité

### Alertes et monitoring

Recevez des alertes critiques :
- Notifications d'erreurs système
- Alertes de monitoring
- Notifications de seuils dépassés

## Prêt à commencer ?

Consultez notre [guide de démarrage rapide](/guides/quickstart) pour envoyer votre premier SMS en moins de 5 minutes.

## Support et assistance

Besoin d'aide ? Contactez notre équipe :
- Email : support@zimsend.com
- Documentation : [docs.zimsend.com](https://docs.zimsend.com)
