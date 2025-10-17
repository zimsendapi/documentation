import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "ZimSend Documentation",
  tagline: "API SMS simple et économique",
  favicon: "img/favicon.ico",

  future: {
    v4: true,
  },

  url: "https://docs.zimsend.com",
  baseUrl: "/",

  organizationName: "zimsend",
  projectName: "zimsend-docs",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "fr",
    locales: ["fr"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
          editUrl: "https://github.com/zimsendapi/docs/tree/main/",
          docItemComponent: "@theme/ApiItem",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      "docusaurus-plugin-openapi-docs",
      {
        id: "api",
        docsPluginId: "classic",
        config: {
          zimsend: {
            specPath: "openapi.yaml",
            outputDir: "docs/api-reference",
            sidebarOptions: {
              groupPathsBy: "tag",
            },
          },
        },
      },
    ],
  ],

  themes: ["docusaurus-theme-openapi-docs"],

  themeConfig: {
    image: "img/zimsend-social.png",
    colorMode: {
      defaultMode: "light",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "",
      logo: {
        alt: "ZimSend Logo",
        src: "img/logo.png",
        height: 24,
        style: { width: "auto" },
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "docsSidebar",
          position: "left",
          label: "Documentation",
        },
        {
          to: "/api-reference/api-overview",
          label: "API Reference",
          position: "left",
        },
        {
          to: "/guides/quickstart",
          label: "Démarrage Rapide",
          position: "left",
        },
        {
          href: "https://app.zimsend.com",
          label: "Dashboard",
          position: "right",
        },
        {
          href: "https://github.com/zimsendapi",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Documentation",
          items: [
            {
              label: "Introduction",
              to: "/intro",
            },
            {
              label: "Démarrage Rapide",
              to: "/guides/quickstart",
            },
            {
              label: "API Reference",
              to: "/api-reference/api-overview",
            },
            {
              label: "Webhooks",
              to: "/webhooks/overview",
            },
          ],
        },
        {
          title: "Ressources",
          items: [
            {
              label: "SDKs",
              to: "/sdks/nodejs",
            },
            {
              label: "Exemples",
              to: "/guides/sending-sms",
            },
            {
              label: "FAQ",
              to: "/faq",
            },
            {
              label: "Codes d'erreur",
              to: "/errors",
            },
          ],
        },
        {
          title: "Produit",
          items: [
            {
              label: "Dashboard",
              href: "https://app.zimsend.com",
            },
            {
              label: "Pricing",
              href: "https://zimsend.com/pricing",
            },
            {
              label: "Status",
              href: "https://status.zimsend.com",
            },
          ],
        },
        {
          title: "Support",
          items: [
            {
              label: "Email",
              href: "mailto:support@zimsend.com",
            },
            {
              label: "Discord",
              href: "https://discord.gg/zimsend",
            },
            {
              label: "GitHub",
              href: "https://github.com/zimsendapi",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} ZimSend.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: [
        "bash",
        "json",
        "javascript",
        "typescript",
        "python",
        "java",
        "php",
        "ruby",
        "go",
        "csharp",
        "kotlin",
        "swift",
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
