import { passwordRules } from "../utils/validation.js";

export default function PasswordStrength({ password }) {
  if (!password) return null;
  return (
    <ul className="rules" aria-label="Password requirements">
      {passwordRules.map((rule) => {
        const ok = rule.test(password);
        return (
          <li key={rule.label} className={ok ? "rule rule--ok" : "rule"}>
            <span aria-hidden="true">{ok ? "✓" : "○"}</span> {rule.label}
            <span className="sr-only">{ok ? " (met)" : " (not met)"}</span>
          </li>
        );
      })}
    </ul>
  );
}
