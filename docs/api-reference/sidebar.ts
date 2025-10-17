import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "api-reference/api-overview",
    },
    {
      type: "category",
      label: "SMS",
      link: {
        type: "doc",
        id: "api-reference/sms-overview",
      },
      items: [
        {
          type: "doc",
          id: "api-reference/envoyer-un-sms",
          label: "Envoyer un SMS",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/envoyer-des-sms-en-masse",
          label: "Envoyer des SMS en masse",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/obtenir-le-statut-dun-sms",
          label: "Obtenir le statut d'un SMS",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/historique-des-sms",
          label: "Historique des SMS",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/renvoyer-un-sms-echoue",
          label: "Renvoyer un SMS échoué",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/annuler-un-sms-programme",
          label: "Annuler un SMS programmé",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "OTP",
      link: {
        type: "doc",
        id: "api-reference/otp-overview",
      },
      items: [
        {
          type: "doc",
          id: "api-reference/generer-et-envoyer-un-code-otp",
          label: "Générer et envoyer un code OTP",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/verifier-un-code-otp",
          label: "Vérifier un code OTP",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Webhooks",
      link: {
        type: "doc",
        id: "api-reference/webhooks-overview",
      },
      items: [
        {
          type: "doc",
          id: "api-reference/configurer-un-webhook",
          label: "Configurer un webhook",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/liste-des-webhooks",
          label: "Liste des webhooks",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/logs-des-webhooks",
          label: "Logs des webhooks",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/tester-un-webhook",
          label: "Tester un webhook",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/supprimer-un-webhook",
          label: "Supprimer un webhook",
          className: "api-method delete",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
