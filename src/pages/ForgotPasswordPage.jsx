import { Link } from "react-router-dom";
import Alert from "../components/Alert.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";

// Placeholder: real password reset needs an email provider (SMTP/SES/etc.) and a reset-token flow.
export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Password reset by email isn't available yet."
      footer={<Link to="/login">Back to sign in</Link>}
    >
      <Alert type="info">
        This feature needs an email service to be configured. For now, contact an administrator to reset your password.
      </Alert>
    </AuthLayout>
  );
}
