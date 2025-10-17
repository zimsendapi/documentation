---
id: otp-overview
title: OTP (One-Time Password)
sidebar_label: Vue d'ensemble OTP
---

# OTP (One-Time Password)

Endpoints pour gérer les codes OTP (mots de passe à usage unique).

## À propos des OTP

Les OTP (One-Time Password) sont des codes temporaires utilisés pour l'authentification à deux facteurs et la vérification d'identité.

## Fonctionnalités

- **Génération automatique** : Codes aléatoires de 4 à 8 chiffres
- **Envoi SMS intégré** : Le code est automatiquement envoyé par SMS
- **Expiration configurable** : Durée de validité personnalisable (1-30 minutes)
- **Vérification sécurisée** : Validation avec limite de tentatives
- **Templates personnalisables** : Personnalisez le message envoyé

## Sécurité

- Les codes OTP sont envoyés avec une **priorité haute (1)** pour garantir une livraison rapide
- Chaque code a une **durée de validité limitée**
- Un **nombre maximum de tentatives** empêche les attaques par force brute
- Les codes sont **à usage unique** et ne peuvent pas être réutilisés

## Endpoints disponibles

Explorez les endpoints ci-dessous pour intégrer l'OTP dans votre application.
