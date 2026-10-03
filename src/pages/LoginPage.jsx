import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Alert from "../components/Alert.jsx";
import TextField from "../components/TextField.jsx";
import useForm from "../hooks/useForm.js";
import AuthLayout from "../layouts/AuthLayout.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../services/api.js";
import { isValidEmail } from "../utils/validation.js";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { values, errors, setErrors, handleChange } = useForm({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const justRegistered = location.state?.registered;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const next = {};
    if (!isValidEmail(values.email)) next.email = "Enter a valid email address";
    if (!values.password) next.password = "Enter your password";
    if (Object.keys(next).length) return setErrors(next);

    setLoading(true);
    try {
      await login({ email: values.email.trim(), password: values.password });
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue."
      footer={<>Don't have an account? <Link to="/register">Create one</Link></>}
    >
      <form onSubmit={handleSubmit} noValidate>
        {justRegistered && <Alert type="success">Account created. Sign in to continue.</Alert>}
        <Alert>{formError}</Alert>
        <TextField label="Email" name="email" type="email" autoComplete="email"
          value={values.email} onChange={handleChange} error={errors.email} />
        <TextField label="Password" name="password" type="password" autoComplete="current-password"
          value={values.password} onChange={handleChange} error={errors.password} />
        <div className="form-row">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        <button className="btn btn--primary" type="submit" disabled={loading}>
          {loading ? <><span className="spinner" /> Signing in…</> : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  );
}
