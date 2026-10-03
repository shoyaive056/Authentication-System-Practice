import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getServerInfo } from "../services/authService.js";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [servers, setServers] = useState([]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate("/login", { replace: true });
  };

  // Developer aid: shows which backend container answered each request (proves Nginx is balancing).
  const pingServer = async () => {
    try {
      const { server } = await getServerInfo();
      setServers((s) => [server, ...s].slice(0, 8));
    } catch {
      setServers((s) => ["request failed", ...s].slice(0, 8));
    }
  };

  const initials = user.full_name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="dash">
      <header className="dash__bar">
        <div className="brand">Authly</div>
        <div className="dash__user">
          <span className="avatar" aria-hidden="true">{initials}</span>
          <span className="dash__name">{user.full_name}</span>
          <button className="btn btn--ghost" onClick={handleLogout} disabled={loggingOut}>
            {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </header>
      <main className="dash__main">
        <h1>Hello, {user.full_name.split(" ")[0]}</h1>
        <p className="muted">You're signed in as {user.email}. This page is only visible to authenticated users.</p>

        <section className="card">
          <h2>Load balancer check</h2>
          <p className="muted">Each click goes through Nginx. Watch the backend instance change.</p>
          <button className="btn btn--primary btn--inline" onClick={pingServer}>Send request</button>
          {servers.length > 0 && (
            <ol className="servers" aria-live="polite">
              {servers.map((s, i) => <li key={i}><code>{s}</code></li>)}
            </ol>
          )}
        </section>
      </main>
    </div>
  );
}
