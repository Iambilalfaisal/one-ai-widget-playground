export interface ChecklistItem {
  id: string
  title: string
  /** Extra widget configuration needed in the One-AI dashboard (omit if none). */
  needs?: string
  steps: string[]
  expected: string
  /** Site page where this is best tested. */
  page?: { href: string; label: string }
}

export interface ChecklistGroup {
  id: string
  title: string
  description: string
  items: ChecklistItem[]
}

export const CHECKLIST: ChecklistGroup[] = [
  {
    id: 'install',
    title: 'Installation & launcher',
    description: 'The widget appears and looks the way the dashboard says it should.',
    items: [
      {
        id: 'install-launcher',
        title: 'Launcher appears after installing',
        steps: ['Open Test Console → Setup & controls.', 'Enter the Widget ID and click “Initialize widget”.'],
        expected: 'A round launcher button appears in the bottom corner. The status pill in the header turns green (“Widget active”).',
        page: { href: '/console', label: 'Test Console' },
      },
      {
        id: 'install-branding',
        title: 'Branding matches the dashboard',
        needs: 'Widget with a custom theme colour, launcher icon and position set in the dashboard.',
        steps: ['Compare the launcher colour, icon, size and corner with the widget’s Appearance settings in the dashboard.'],
        expected: 'Colour, icon, size, shape, shadow and corner (left/right) all match the dashboard configuration.',
      },
      {
        id: 'install-persist',
        title: 'Widget works on every page',
        steps: ['Click through Home, Products, Pricing and Support in the top menu.'],
        expected: 'The launcher is present on every page and never overlaps the page content in a broken way.',
        page: { href: '/products', label: 'Products' },
      },
      {
        id: 'install-remove',
        title: 'Remove and re-install',
        steps: ['In the Console click “Remove widget”, then “Initialize widget” again.'],
        expected: 'The launcher disappears completely on remove, and exactly one launcher appears after re-install (never two).',
        page: { href: '/console', label: 'Test Console' },
      },
    ],
  },
  {
    id: 'window',
    title: 'Chat window',
    description: 'Opening, closing and layout of the chat window.',
    items: [
      {
        id: 'window-open-close',
        title: 'Open and close from the launcher',
        steps: ['Click the launcher.', 'Click the minimize / close control inside the chat window.', 'Click the launcher again.'],
        expected: 'The window opens with the configured animation, closes cleanly, and re-opens showing the same conversation.',
      },
      {
        id: 'window-controls',
        title: 'Open / Close / Toggle from the host page',
        steps: ['In the Console use the Open, Close and Toggle buttons.'],
        expected: 'Each button changes the window state accordingly; the event log records each call.',
        page: { href: '/console', label: 'Test Console' },
      },
      {
        id: 'window-header',
        title: 'Header and greeting copy',
        needs: 'Header title, subtitle, greeting and input placeholder configured in the dashboard.',
        steps: ['Open the widget and read the header, greeting message and message-box placeholder.'],
        expected: 'All copy matches what is configured in the dashboard.',
      },
      {
        id: 'window-quick-replies',
        title: 'Quick replies',
        needs: 'At least one quick reply configured.',
        steps: ['Open the widget before sending anything, then click a quick-reply chip.'],
        expected: 'The chip text is sent as a message and the assistant replies.',
      },
    ],
  },
  {
    id: 'conversation',
    title: 'Conversation',
    description: 'Sending messages and receiving answers.',
    items: [
      {
        id: 'conv-send',
        title: 'Send a message and get a reply',
        steps: ['Open the widget, type “Hello, what can you help me with?” and press Enter.'],
        expected: 'Your message appears immediately, a typing indicator shows, then the assistant’s reply appears. The event log shows the API calls succeeding.',
      },
      {
        id: 'conv-status',
        title: 'Progress status while waiting',
        needs: 'An assistant that uses tools or routes between agents.',
        steps: ['Ask a question that requires a tool (e.g. a web search or a knowledge lookup).'],
        expected: 'Under the typing indicator a short status such as “Using Web Search…” or “Routing to …” appears before the answer.',
      },
      {
        id: 'conv-history',
        title: 'Conversation survives a page reload',
        steps: ['Send two messages.', 'Reload the page (Console → “Reload the page”).', 'Open the widget.'],
        expected: 'The earlier messages are restored in order.',
      },
      {
        id: 'conv-new-visitor',
        title: 'New visitor starts fresh',
        steps: ['Console → “Start as a brand-new visitor”, then open the widget.'],
        expected: 'The previous conversation is gone and only the greeting is shown.',
        page: { href: '/console', label: 'Test Console' },
      },
      {
        id: 'conv-markdown',
        title: 'Rich formatting renders',
        steps: ['Ask: “Give me a bulleted list of 3 tips and a short table.”'],
        expected: 'Lists, bold text, links and tables render as formatted content, not raw symbols.',
      },
    ],
  },
  {
    id: 'attachments',
    title: 'Attachments',
    description: 'Uploading files from the chat window.',
    items: [
      {
        id: 'att-upload',
        title: 'Attach and send a file',
        needs: '“Allow attachments” enabled for the widget.',
        steps: ['Open the widget and click the attachment button.', 'Choose a small PNG or PDF.', 'Send the message.'],
        expected: 'The file shows an upload progress state, attaches to the message, and the assistant acknowledges it.',
      },
      {
        id: 'att-disabled',
        title: 'No attachment button when disabled',
        needs: '“Allow attachments” disabled for the widget.',
        steps: ['Open the widget.'],
        expected: 'There is no attachment button.',
      },
      {
        id: 'att-invalid',
        title: 'Oversized or unsupported file is rejected',
        needs: '“Allow attachments” enabled.',
        steps: ['Try to attach a very large file (over the configured limit) or an unsupported type such as .exe.'],
        expected: 'A clear error is shown and the message can still be sent without the file.',
      },
    ],
  },
  {
    id: 'lead',
    title: 'Lead capture',
    description: 'The pre-chat form that collects visitor details.',
    items: [
      {
        id: 'lead-form',
        title: 'Lead form appears and submits',
        needs: 'At least two lead fields configured (e.g. name and email), one of them required.',
        steps: ['Start as a brand-new visitor.', 'Open the widget and fill in the form, then continue.'],
        expected: 'The form shows the configured fields, then the chat becomes available. The event log shows a lead-submit event.',
      },
      {
        id: 'lead-validation',
        title: 'Required fields are enforced',
        needs: 'A required lead field.',
        steps: ['Leave a required field empty (or enter an invalid email) and try to continue.'],
        expected: 'The form blocks submission and explains what to fix.',
      },
      {
        id: 'lead-once',
        title: 'Form is not shown again',
        steps: ['After submitting, reload the page and open the widget.'],
        expected: 'The visitor goes straight to the conversation without being asked again.',
      },
    ],
  },
  {
    id: 'triggers',
    title: 'Triggers',
    description: 'The widget opening itself.',
    items: [
      {
        id: 'trig-auto-open',
        title: 'Auto-open after a delay',
        needs: 'Auto-open enabled with a delay (e.g. 4 seconds).',
        steps: ['Start as a brand-new visitor.', 'Reload any page and wait without touching anything.'],
        expected: 'The widget opens by itself after the configured delay.',
      },
      {
        id: 'trig-scroll',
        title: 'Open at a scroll depth',
        needs: '“Open on scroll” set to a percentage (e.g. 50%).',
        steps: ['Open the Long read page and scroll slowly down.'],
        expected: 'The widget opens once when the scroll depth passes the configured percentage, and not again after you close it.',
        page: { href: '/blog/scaling-with-confidence', label: 'Long read' },
      },
    ],
  },
  {
    id: 'greetings',
    title: 'Page-targeted greetings',
    description: 'Different welcome messages depending on the page.',
    items: [
      {
        id: 'greet-pricing',
        title: 'Pricing page greeting',
        needs: 'Targeted greeting with path pattern /pricing and its own message.',
        steps: ['Make sure “Re-install on every page navigation” is on.', 'Go to Pricing and open the widget.'],
        expected: 'The greeting is the Pricing-specific message, not the default one.',
        page: { href: '/pricing', label: 'Pricing' },
      },
      {
        id: 'greet-wildcard',
        title: 'Wildcard path greeting',
        needs: 'Targeted greeting with path pattern /products* (trailing wildcard).',
        steps: ['Open Products, then open one of the product pages, and open the widget on each.'],
        expected: 'Both pages show the Products greeting; the Support and Home pages show the default.',
        page: { href: '/products', label: 'Products' },
      },
    ],
  },
  {
    id: 'locale',
    title: 'Localization',
    description: 'Translated widget copy based on the visitor’s language.',
    items: [
      {
        id: 'loc-translate',
        title: 'Copy switches to the visitor’s language',
        needs: 'Locale copy added for a language (e.g. es) in the dashboard.',
        steps: ['Console → set Visitor language to that language and click “Re-initialize widget”.', 'Open the widget.'],
        expected: 'Header, greeting and placeholder show the translated text.',
        page: { href: '/console', label: 'Test Console' },
      },
      {
        id: 'loc-fallback',
        title: 'Falls back to the default copy',
        steps: ['Set Visitor language to a language with no translation (e.g. German) and re-initialize.'],
        expected: 'The default (base) copy is shown.',
        page: { href: '/console', label: 'Test Console' },
      },
      {
        id: 'loc-rtl',
        title: 'Right-to-left layout',
        needs: 'Arabic locale copy configured.',
        steps: ['Set Visitor language to Arabic and re-initialize, then open the widget.'],
        expected: 'The chat window lays out right-to-left.',
        page: { href: '/console', label: 'Test Console' },
      },
    ],
  },
  {
    id: 'availability',
    title: 'Connectivity & availability',
    description: 'Offline handling and business hours.',
    items: [
      {
        id: 'avail-offline',
        title: 'Offline notice and queued message',
        steps: [
          'Open the widget, then turn on “Simulate offline” in the Console.',
          'Send a message.',
          'Turn “Simulate offline” off.',
        ],
        expected: 'An offline notice shows while offline. The message is delivered automatically once back online and the assistant replies.',
        page: { href: '/console', label: 'Test Console' },
      },
      {
        id: 'avail-hours',
        title: 'Outside business hours',
        needs: 'Availability schedule set so that “now” is outside business hours, with an offline message.',
        steps: ['Open the widget.'],
        expected: 'The widget shows an “Away” state and the configured offline message.',
      },
      {
        id: 'avail-retry',
        title: 'Failed send can be retried',
        steps: ['Open the widget, then block the API in your browser DevTools (Network → Offline) and send a message.', 'Restore the network and click Retry.'],
        expected: 'After a failure the message shows “Not sent” with a Retry action; Retry delivers it.',
      },
    ],
  },
  {
    id: 'badge',
    title: 'Unread badge & feedback',
    description: 'Notifications and ratings.',
    items: [
      {
        id: 'badge-unread',
        title: 'Unread badge while closed',
        steps: ['Send a message, then immediately close the widget before the reply arrives.'],
        expected: 'A red badge with the unread count appears on the launcher; it clears when you open the widget.',
      },
      {
        id: 'feedback-rate',
        title: 'Rate an answer',
        needs: 'Message feedback enabled for the widget.',
        steps: ['Click thumbs-up on an answer, then thumbs-down on another.'],
        expected: 'The choice is highlighted and the event log shows a feedback event.',
      },
    ],
  },
  {
    id: 'responsive',
    title: 'Responsive behaviour',
    description: 'Phones and small windows.',
    items: [
      {
        id: 'resp-mobile',
        title: 'Full screen on mobile',
        needs: '“Full screen on mobile” enabled.',
        steps: ['Resize the browser below 640 px wide (or use the DevTools device toolbar).', 'Open the widget.'],
        expected: 'The chat window fills the whole screen, and the close control is reachable.',
      },
      {
        id: 'resp-small-height',
        title: 'Short window does not overflow',
        steps: ['Make the browser window short (about 500 px tall) and open the widget.'],
        expected: 'The chat window fits inside the viewport and the message box stays visible.',
      },
    ],
  },
  {
    id: 'security',
    title: 'Origins & access',
    description: 'Who is allowed to embed the widget.',
    items: [
      {
        id: 'sec-bad-id',
        title: 'Invalid widget ID',
        steps: ['Enter a wrong Widget ID in the Console and initialize.', 'Open Diagnostics and run the checks.'],
        expected: 'The widget does not work and Diagnostics reports that the configuration could not be loaded.',
        page: { href: '/console/diagnostics', label: 'Diagnostics' },
      },
      {
        id: 'sec-origin',
        title: 'Origin not on the allowed list',
        needs: 'A deployed copy of this site whose URL is NOT in the widget’s allowed origins.',
        steps: ['Open the deployed site, initialize the widget, then run Diagnostics.'],
        expected: 'Diagnostics flags the origin problem and the widget does not load. After adding the URL to Allowed origins (allow about a minute), it works.',
        page: { href: '/console/diagnostics', label: 'Diagnostics' },
      },
      {
        id: 'sec-disabled',
        title: 'Disabled widget',
        needs: 'Ability to disable the widget in the dashboard.',
        steps: ['Disable the widget in the dashboard, then reload this site.'],
        expected: 'The widget no longer works; re-enabling it brings it back.',
      },
    ],
  },
]

export const ALL_ITEM_IDS = CHECKLIST.flatMap(g => g.items.map(i => i.id))
