// The chat window rendered inside the widget iframe. Deliberately bare: no site
// header/footer, and no WidgetProvider (that would install a widget inside the widget).
export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return children
}
