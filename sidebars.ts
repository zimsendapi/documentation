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
      type: 'link',
      label: '📡 API Reference',
      href: '/api-reference/api-overview',
    },
  ],
};

export default sidebars;
