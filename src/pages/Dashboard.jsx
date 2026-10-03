import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { Alert } from "../components/FormField.jsx";
import { getServerInfo } from "../services/authService.js";
import { getErrorMessage } from "../services/api.js";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [servers, setServers] = useState([]);
  const [error, setError] = useState("");

  async function pingServer() {
    setError("");
    try {
      const { server } = await getServerInfo();
      setServers((s) => [server, ...s].slice(0, 8));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="dashboard">
      <header className="topbar">
        <div className="brand">Northbeam</div>
        <button className="btn btn-ghost" onClick={logout}>Sign out</button>
      </header>
      <main className="content">
        <h1>Hello, {user.full_name.split(" ")[0]}</h1>
        <p className="subtitle">You're signed in as {user.email}.</p>
        <section className="panel">
          <h2>Load balancer check</h2>
          <p>Each click is a request through Nginx. Different backend names mean traffic is being distributed.</p>
          <button className="btn btn-inline" onClick={pingServer}>Send request</button>
          <Alert>{error}</Alert>
          <ol className="server-log">
            {servers.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </section>
      </main>
    </div>
  );
}
