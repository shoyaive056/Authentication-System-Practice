import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/Alert.jsx";
import PasswordStrength from "../components/PasswordStrength.jsx";
import TextField from "../components/TextField.jsx";
import useForm from "../hooks/useForm.js";
import AuthLayout from "../layouts/AuthLayout.jsx";
import { getErrorMessage, getFieldErrors } from "../services/api.js";
import { registerUser } from "../services/authService.js";
import { isStrongPassword, isValidEmail } from "../utils/validation.js";

const FIELD_MAP = { full_name: "fullName", confirm_password: "confirmPassword" };

export default function RegisterPage() {
  const navigate = useNavigate();
  const { values, errors, setErrors, handleChange } = useForm({
    fullName: "", email: "", password: "", confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const validate = () => {
    const next = {};
    if (!values.fullName.trim()) next.fullName = "Name cannot be empty";
    if (!isValidEmail(values.email)) next.email = "Enter a valid email address";
    if (!isStrongPassword(values.password)) next.password = "Password doesn't meet all requirements";
    if (values.confirmPassword !== values.password) next.confirmPassword = "Passwords do not match";
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const next = validate();
    if (Object.keys(next).length) return setErrors(next);

    setLoading(true);
    try {
      await registerUser({ ...values, fullName: values.fullName.trim(), email: values.email.trim() });
      navigate("/login", { replace: true, state: { registered: true } });
    } catch (err) {
      const serverFields = getFieldErrors(err);
      const mapped = Object.fromEntries(Object.entries(serverFields).map(([k, v]) => [FIELD_MAP[k] || k, v]));
      if (Object.keys(mapped).length) setErrors(mapped);
      else if (err.response?.status === 409) setErrors({ email: "An account with this email already exists" });
      else setFormError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="It takes less than a minute."
      footer={<>Already have an account? <Link to="/login">Sign in</Link></>}
    >
      <form onSubmit={handleSubmit} noValidate>
        <Alert>{formError}</Alert>
        <TextField label="Full name" name="fullName" autoComplete="name"
          value={values.fullName} onChange={handleChange} error={errors.fullName} />
        <TextField label="Email" name="email" type="email" autoComplete="email"
          value={values.email} onChange={handleChange} error={errors.email} />
        <TextField label="Password" name="password" type="password" autoComplete="new-password"
          value={values.password} onChange={handleChange} error={errors.password} />
        <PasswordStrength password={values.password} />
        <TextField label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password"
          value={values.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
        <button className="btn btn--primary" type="submit" disabled={loading}>
          {loading ? <><span className="spinner" /> Creating account…</> : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}
