import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import { DollarSign, Zap, Shield, Lock, Bell, Megaphone, Book, Radio, Code, ArrowRight, Rocket } from 'lucide-react';

import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Documentation ZimSend
        </Heading>
        <p className="hero__subtitle">API SMS simple et économique - Utilisez votre téléphone Android comme gateway</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/guides/quickstart">
            Démarrer en 5 minutes
            <Rocket className="button-icon" size={20} />
          </Link>
          <Link
            className="button button--outline button--lg margin-left--md"
            to="/docs/api-reference"
            style={{color: 'white', borderColor: 'white'}}>
            Explorer l'API
            <Radio className="button-icon" size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
}

interface FeatureProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  iconColor: string;
}

function Feature({title, description, icon: Icon, iconColor}: FeatureProps) {
  return (
    <div className={clsx('col col--4')}>
      <div className="feature-card">
        <div className="feature-icon-wrapper" style={{backgroundColor: `${iconColor}15`}}>
          <Icon className="feature-icon" style={{color: iconColor}} />
        </div>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Accueil"
      description="Documentation de l'API ZimSend - Envoyez des SMS via API">
      <HomepageHeader />
      <main>
        {/* Features Section */}
        <section style={{padding: '4rem 0'}}>
          <div className="container">
            <div className="row">
              <Feature
                title="Économique"
                description="Pas de frais par SMS. Utilisez votre forfait mobile existant et payez uniquement l'abonnement mensuel."
                icon={DollarSign}
                iconColor="#3ecf8e"
              />
              <Feature
                title="Simple"
                description="API REST intuitive. Envoyez votre premier SMS en moins de 5 minutes avec seulement 3 headers."
                icon={Zap}
                iconColor="#00d4ff"
              />
              <Feature
                title="Fiable"
                description="Webhooks temps réel, retry automatique, file d'attente persistante et support OTP intégré."
                icon={Shield}
                iconColor="#0a2540"
              />
            </div>
          </div>
        </section>

        {/* Quick Example Section */}
        <section style={{padding: '4rem 0', backgroundColor: 'var(--ifm-color-emphasis-100)'}}>
          <div className="container">
            <div className="row">
              <div className="col col--6">
                <Heading as="h2">Envoyez votre premier SMS</Heading>
                <p>3 étapes simples pour commencer :</p>
                <ol>
                  <li>Créez un compte sur <a href="https://app.zimsend.com" target="_blank">app.zimsend.com</a></li>
                  <li>Générez une clé API dans le dashboard</li>
                  <li>Connectez votre téléphone Android</li>
                </ol>
                <p>Et voilà ! Vous pouvez envoyer des SMS via l'API.</p>
                <Link to="/docs/guides/quickstart" className="button button--primary">
                  Voir le guide complet
                  <ArrowRight className="button-icon" size={20} />
                </Link>
              </div>
              <div className="col col--6">
                <div style={{backgroundColor: '#0a2540', color: '#e6edf3', padding: '1.5rem', borderRadius: '8px', fontSize: '0.85rem', overflow: 'auto', border: '1px solid rgba(255, 255, 255, 0.1)'}}>
                  <pre style={{margin: 0, backgroundColor: 'transparent'}}>
                    <code style={{color: '#e6edf3'}}>{`curl -X POST https://api.zimsend.com/v1/sms/send \\
  -H "X-API-Key: sk_live_..." \\
  -H "X-Client-ID: client_..." \\
  -H "X-Device-ID: device_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+33612345678",
    "message": "Hello from ZimSend!",
    "priority": 3
  }'`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section style={{padding: '4rem 0'}}>
          <div className="container">
            <Heading as="h2" className="text--center margin-bottom--lg">Cas d'usage</Heading>
            <div className="row">
              <div className="col col--4">
                <div className="use-case-card">
                  <div className="use-case-icon-wrapper" style={{backgroundColor: '#9333ea15'}}>
                    <Lock className="use-case-icon" style={{color: '#9333ea'}} />
                  </div>
                  <Heading as="h3">Authentification 2FA</Heading>
                  <p>Envoyez des codes OTP pour sécuriser vos connexions utilisateur</p>
                  <Link to="/docs/guides/otp">
                    En savoir plus
                    <ArrowRight className="button-icon" size={16} />
                  </Link>
                </div>
              </div>
              <div className="col col--4">
                <div className="use-case-card">
                  <div className="use-case-icon-wrapper" style={{backgroundColor: '#4299e115'}}>
                    <Bell className="use-case-icon" style={{color: '#4299e1'}} />
                  </div>
                  <Heading as="h3">Notifications</Heading>
                  <p>Alertez vos utilisateurs en temps réel (commandes, livraisons, alertes)</p>
                  <Link to="/docs/guides/sending-sms">
                    En savoir plus
                    <ArrowRight className="button-icon" size={16} />
                  </Link>
                </div>
              </div>
              <div className="col col--4">
                <div className="use-case-card">
                  <div className="use-case-icon-wrapper" style={{backgroundColor: '#ffd60a15'}}>
                    <Megaphone className="use-case-icon" style={{color: '#ffd60a'}} />
                  </div>
                  <Heading as="h3">Marketing</Heading>
                  <p>Envoyez des campagnes SMS en masse à vos clients</p>
                  <Link to="/docs/guides/sending-sms">
                    En savoir plus
                    <ArrowRight className="button-icon" size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section style={{padding: '4rem 0', backgroundColor: 'var(--ifm-color-emphasis-100)'}}>
          <div className="container">
            <Heading as="h2" className="text--center margin-bottom--lg">Ressources</Heading>
            <div className="row">
              <div className="col col--3">
                <div style={{marginBottom: '2rem'}}>
                  <Heading as="h4">
                    <Book className="resource-icon" size={24} style={{color: 'var(--ifm-color-primary)'}} />
                    Guides
                  </Heading>
                  <ul style={{listStyle: 'none', padding: 0}}>
                    <li><Link to="/docs/guides/quickstart">Quick Start</Link></li>
                    <li><Link to="/docs/guides/authentication">Authentification</Link></li>
                    <li><Link to="/docs/guides/sending-sms">Envoyer des SMS</Link></li>
                    <li><Link to="/docs/guides/otp">Système OTP</Link></li>
                  </ul>
                </div>
              </div>
              <div className="col col--3">
                <div style={{marginBottom: '2rem'}}>
                  <Heading as="h4">
                    <Radio className="resource-icon" size={24} style={{color: 'var(--ifm-color-primary)'}} />
                    API Reference
                  </Heading>
                  <ul style={{listStyle: 'none', padding: 0}}>
                    <li><Link to="/docs/api-reference">Documentation complète</Link></li>
                    <li><Link to="/docs/api-reference/envoyer-un-sms">Envoyer un SMS</Link></li>
                    <li><Link to="/docs/api-reference/envoyer-des-sms-en-masse">Envoi en masse</Link></li>
                  </ul>
                </div>
              </div>
              <div className="col col--3">
                <div style={{marginBottom: '2rem'}}>
                  <Heading as="h4">
                    <Bell className="resource-icon" size={24} style={{color: 'var(--ifm-color-primary)'}} />
                    Webhooks
                  </Heading>
                  <ul style={{listStyle: 'none', padding: 0}}>
                    <li><Link to="/docs/webhooks/overview">Configuration</Link></li>
                    <li><Link to="/docs/webhooks/events">Événements</Link></li>
                  </ul>
                </div>
              </div>
              <div className="col col--3">
                <div style={{marginBottom: '2rem'}}>
                  <Heading as="h4">
                    <Code className="resource-icon" size={24} style={{color: 'var(--ifm-color-primary)'}} />
                    SDKs
                  </Heading>
                  <ul style={{listStyle: 'none', padding: 0}}>
                    <li><Link to="/docs/sdks/nodejs">Node.js</Link></li>
                    <li><Link to="/docs/sdks/python">Python</Link></li>
                    <li><Link to="/docs/sdks/php">PHP</Link></li>
                    <li><Link to="/docs/faq">FAQ</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{padding: '4rem 0', textAlign: 'center'}}>
          <div className="container">
            <Heading as="h2">Prêt à commencer ?</Heading>
            <p style={{fontSize: '1.2rem', marginBottom: '2rem'}}>Créez votre compte gratuitement et envoyez votre premier SMS en moins de 5 minutes</p>
            <div className={styles.buttons}>
              <Link
                className="button button--primary button--lg"
                to="https://app.zimsend.com/register"
                target="_blank">
                Créer un compte gratuit
                <Rocket className="button-icon" size={20} />
              </Link>
              <Link
                className="button button--secondary button--lg margin-left--md"
                to="/docs/guides/quickstart">
                Lire la documentation
                <Book className="button-icon" size={20} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
