import type { ReactNode, CSSProperties } from "react";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div style={shell}>
      <header style={header}>
        <div style={container}>
          <div style={headerInner}>
            <a href="/" style={brand}>
              DVTrucks
            </a>

            <nav style={nav}>
              <a href="/" style={navLink}>Головна</a>
              <a href="/services" style={navLink}>Послуги</a>
              <a href="/contacts" style={navLink}>Контакти</a>
              <a href="/booking" style={navLink}>Запис</a>
              <a href="/news" style={navLink}>Новини</a>
            </nav>
          </div>
        </div>
      </header>

      <div>{children}</div>

      <footer style={footer}>
        <div style={container}>
          <div style={footerGrid}>
            <div>
              <div style={footerBrand}>DVTrucks</div>
              <p style={footerText}>
                Сервіс і ремонт вантажних авто та комерційного транспорту.
              </p>
            </div>

            <div>
              <div style={footerTitle}>Навігація</div>
              <div style={footerLinks}>
                <a href="/" style={footerLink}>Головна</a>
                <a href="/services" style={footerLink}>Послуги</a>
                <a href="/contacts" style={footerLink}>Контакти</a>
                <a href="/booking" style={footerLink}>Запис</a>
                <a href="/news" style={footerLink}>Новини</a>
              </div>
            </div>

            <div>
              <div style={footerTitle}>Контакти</div>
              <p style={footerText}>Телефон: +38 (0XX) XXX-XX-XX</p>
              <p style={footerText}>Адреса: додамо після уточнення</p>
              <p style={footerText}>Графік: Пн–Сб, 09:00–18:00</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const shell: CSSProperties = {
  background: "#0e1013",
  color: "#f5f7fa",
  minHeight: "100vh",
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const container: CSSProperties = {
  maxWidth: 1180,
  margin: "0 auto",
  padding: "0 20px",
};

const header: CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 20,
  backdropFilter: "blur(10px)",
  background: "rgba(14,16,19,0.82)",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
};

const headerInner: CSSProperties = {
  minHeight: 74,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 18,
  flexWrap: "wrap",
};

const brand: CSSProperties = {
  color: "#fff",
  textDecoration: "none",
  fontWeight: 900,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  fontSize: 24,
};

const nav: CSSProperties = {
  display: "flex",
  gap: 18,
  flexWrap: "wrap",
};

const navLink: CSSProperties = {
  color: "rgba(255,255,255,0.82)",
  textDecoration: "none",
  fontSize: 15,
};

const footer: CSSProperties = {
  borderTop: "1px solid rgba(255,255,255,0.08)",
  background: "#0a0c0f",
  padding: "52px 0",
};

const footerGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 28,
};

const footerBrand: CSSProperties = {
  fontSize: 22,
  fontWeight: 900,
  marginBottom: 10,
};

const footerTitle: CSSProperties = {
  fontSize: 16,
  fontWeight: 800,
  marginBottom: 12,
};

const footerText: CSSProperties = {
  margin: "0 0 8px",
  color: "rgba(255,255,255,0.68)",
  lineHeight: 1.7,
};

const footerLinks: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const footerLink: CSSProperties = {
  color: "rgba(255,255,255,0.78)",
  textDecoration: "none",
};
