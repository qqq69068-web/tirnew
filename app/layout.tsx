import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Tirnew — Сервіс вантажних і легкових автомобілів", template: "%s | Tirnew" },
  description: "Діагностика, ремонт та обслуговування вантажних і легкових автомобілів, причепів і напівпричепів. Власний склад запчастин.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Cabinet Grotesk + Satoshi via Fontshare */}
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,600,700,800,900&f[]=satoshi@300,400,500,700&display=swap"
          rel="stylesheet"
        />
        {/* Inline theme init: read localStorage before first paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  try{
    var t=localStorage.getItem('tirnew-theme');
    if(!t) t=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';
    document.documentElement.setAttribute('data-theme',t);
  }catch(e){}
})();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        {/* Skip to main content — accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-surface focus:text-text focus:border focus:border-border-strong focus:rounded-md focus:shadow-lg"
        >
          Перейти до вмісту
        </a>

        {children}

        {/* ── SCROLL REVEAL OBSERVER ──────────────────────────────────────────────
            Activates .reveal / .reveal-left / .reveal-scale / .reveal-clip
            by adding .visible class when element enters the viewport.
            Runs once per element (unobserves after trigger).
            Respects prefers-reduced-motion — skips animation, shows instantly.
        ───────────────────────────────────────────────────────────── */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  var SELECTORS = '.reveal,.reveal-left,.reveal-scale,.reveal-clip';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // If user prefers reduced motion — show all immediately, no animation
  if (reduced) {
    document.querySelectorAll(SELECTORS).forEach(function(el){
      el.classList.add('visible');
    });
    return;
  }

  var io = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
  );

  function observe() {
    document.querySelectorAll(SELECTORS).forEach(function(el) {
      io.observe(el);
    });
  }

  // Observe immediately for elements already in DOM
  observe();

  // Re-observe after Next.js client-side navigation (new elements in DOM)
  var mutObs = new MutationObserver(function(mutations) {
    var hasNew = mutations.some(function(m) {
      return m.addedNodes.length > 0;
    });
    if (hasNew) observe();
  });
  mutObs.observe(document.body, { childList: true, subtree: true });
})();
            `,
          }}
        />
      </body>
    </html>
  );
}
