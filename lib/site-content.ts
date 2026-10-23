export interface Product {
  slug: string
  name: string
  tagline: string
  description: string
  features: string[]
}

export const PRODUCTS: Product[] = [
  {
    slug: 'analytics',
    name: 'Acme Analytics',
    tagline: 'Dashboards your whole team actually reads.',
    description:
      'Connect your data sources in minutes and turn raw events into clear, shareable dashboards. Scheduled reports land in the inbox of everyone who needs them.',
    features: ['Real-time dashboards', 'Scheduled email reports', 'Role-based access', 'SQL and no-code explorer'],
  },
  {
    slug: 'automation',
    name: 'Acme Automation',
    tagline: 'Retire the repetitive work.',
    description:
      'Build workflows with a visual editor and trigger them from schedules, webhooks or events. Every run is logged so you always know what happened and why.',
    features: ['Visual workflow builder', 'Webhook and schedule triggers', 'Full run history', 'Built-in retries'],
  },
  {
    slug: 'storage',
    name: 'Acme Storage',
    tagline: 'Durable object storage without the surprises.',
    description:
      'Store files of any size with predictable pricing, versioning and lifecycle rules. Encryption at rest and in transit is on by default.',
    features: ['Versioning and recovery', 'Lifecycle policies', 'Encryption by default', 'Global edge caching'],
  },
]

export interface Plan {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  highlighted?: boolean
}

export const PLANS: Plan[] = [
  {
    name: 'Starter',
    price: '$0',
    period: 'forever',
    description: 'For individuals exploring what Acme Cloud can do.',
    features: ['1 project', '5 GB storage', 'Community support'],
  },
  {
    name: 'Team',
    price: '$29',
    period: 'per user / month',
    description: 'For teams that ship together and need room to grow.',
    features: ['Unlimited projects', '500 GB storage', 'Priority email support', 'Role-based access'],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'talk to sales',
    description: 'For organisations with security and compliance needs.',
    features: ['SSO and audit logs', 'Dedicated infrastructure', '99.99% uptime SLA', '24/7 phone support'],
  },
]

export const FAQ = [
  { q: 'Can I change plans later?', a: 'Yes. You can upgrade or downgrade at any time and billing adjusts automatically on your next invoice.' },
  { q: 'Do you offer a free trial of Team?', a: 'Every new workspace gets 14 days of Team features, no credit card required.' },
  { q: 'What payment methods do you accept?', a: 'All major credit cards. Enterprise customers can pay by invoice.' },
  { q: 'How do I reset my password?', a: 'Use “Forgot password” on the sign-in page and we will email you a secure reset link.' },
  { q: 'Where can I find my invoices?', a: 'Open Settings → Billing → Invoices. Every invoice is available as a PDF.' },
]
