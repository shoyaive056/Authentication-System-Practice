export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth">
      <aside className="auth__brand" aria-hidden="true">
        <div className="brand">Authly</div>
        <p className="auth__tagline">Secure sign-in for your team, built on short-lived tokens and revocable sessions.</p>
      </aside>
      <main className="auth__panel">
        <div className="auth__card">
          <div className="brand brand--mobile">Authly</div>
          <h1>{title}</h1>
          <p className="auth__subtitle">{subtitle}</p>
          {children}
          {footer && <p className="auth__footer">{footer}</p>}
        </div>
      </main>
    </div>
  );
}
