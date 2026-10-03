import { useState } from "react";

export function FormField({ id, label, error, hint, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {hint}
      {error && <p className="field-error" id={`${id}-error`}>{error}</p>}
    </div>
  );
}

export function PasswordInput({ id, value, onChange, error, autoComplete }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="password-wrap">
      <input
        id={id} type={visible ? "text" : "password"} value={value} onChange={onChange}
        autoComplete={autoComplete} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}
      />
      <button type="button" className="toggle" onClick={() => setVisible((v) => !v)} aria-pressed={visible}>
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}

export function Alert({ kind = "error", children }) {
  if (!children) return null;
  return <div className={`alert alert-${kind}`} role={kind === "error" ? "alert" : "status"}>{children}</div>;
}
