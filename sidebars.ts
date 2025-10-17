import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: '👋 Introduction',
    },
    {
      type: 'category',
      label: '🚀 Guides',
      collapsed: false,
      items: [
        'guides/quickstart',
        'guides/authentication',
        'guides/sending-sms',
        'guides/otp',
        'guides/tracking',
      ],
    },
    {
      type: 'category',
      label: '🔔 Webhooks',
      items: [
        'webhooks/overview',
        'webhooks/events',
      ],
    },
    {
      type: 'category',
      label: '💻 SDKs & Exemples',
      collapsed: false,
      items: [
        'sdks/nodejs',
        'sdks/python',
        'sdks/php',
      ],
    },
    {
      type: 'category',
      label: '📚 Référence',
      items: [
        'faq',
        'errors',
      ],
    },
    {
      type: 'category',
      label: '📡 API Reference',
      link: {
        type: 'doc',
        id: 'api-reference/api-overview',
      },
      items: [
        {
          type: 'category',
          label: 'SMS',
          link: {
            type: 'doc',
            id: 'api-reference/sms-overview',
          },
          items: [
            'api-reference/envoyer-un-sms',
            'api-reference/envoyer-des-sms-en-masse',
            'api-reference/obtenir-le-statut-dun-sms',
            'api-reference/historique-des-sms',
            'api-reference/renvoyer-un-sms-echoue',
            'api-reference/annuler-un-sms-programme',
          ],
        },
        {
          type: 'category',
          label: 'OTP',
          link: {
            type: 'doc',
            id: 'api-reference/otp-overview',
          },
          items: [
            'api-reference/generer-et-envoyer-un-code-otp',
            'api-reference/verifier-un-code-otp',
          ],
        },
        {
          type: 'category',
          label: 'Webhooks',
          link: {
            type: 'doc',
            id: 'api-reference/webhooks-overview',
          },
          items: [
            'api-reference/configurer-un-webhook',
            'api-reference/liste-des-webhooks',
            'api-reference/logs-des-webhooks',
            'api-reference/tester-un-webhook',
            'api-reference/supprimer-un-webhook',
          ],
        },
      ],
    },
  ],
};

export default sidebars;
