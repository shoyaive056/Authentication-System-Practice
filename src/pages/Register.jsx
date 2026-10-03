import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout.jsx";
import { Alert, FormField, PasswordInput } from "../components/FormField.jsx";
import { registerUser } from "../services/authService.js";
import { getErrorMessage } from "../services/api.js";
import { passwordRules, validateRegister } from "../utils/validation.js";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validateRegister(form);
    setErrors(found);
    setServerError("");
    if (Object.keys(found).length) return;
    setSubmitting(true);
    try {
      await registerUser(form);
      navigate("/login", { replace: true, state: { message: "Account created. You can sign in now." } });
    } catch (err) {
      if (err.response?.status === 409) setErrors({ email: getErrorMessage(err) });
      else setServerError(getErrorMessage(err));
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account" subtitle="It takes less than a minute."
      footer={<>Already registered? <Link to="/login">Sign in</Link></>}
    >
      <form onSubmit={handleSubmit} noValidate>
        <Alert>{serverError}</Alert>
        <FormField id="fullName" label="Full name" error={errors.fullName}>
          <input id="fullName" value={form.fullName} onChange={set("fullName")} autoComplete="name" aria-invalid={!!errors.fullName} />
        </FormField>
        <FormField id="email" label="Email" error={errors.email}>
          <input id="email" type="email" value={form.email} onChange={set("email")} autoComplete="email" aria-invalid={!!errors.email} />
        </FormField>
        <FormField id="password" label="Password" error={errors.password}
          hint={
            <ul className="rules" aria-label="Password requirements">
              {passwordRules.map((r) => (
                <li key={r.id} className={r.test(form.password) ? "met" : ""}>{r.label}</li>
              ))}
            </ul>
          }>
          <PasswordInput id="password" value={form.password} onChange={set("password")} autoComplete="new-password" error={errors.password} />
        </FormField>
        <FormField id="confirmPassword" label="Confirm password" error={errors.confirmPassword}>
          <PasswordInput id="confirmPassword" value={form.confirmPassword} onChange={set("confirmPassword")} autoComplete="new-password" error={errors.confirmPassword} />
        </FormField>
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}
