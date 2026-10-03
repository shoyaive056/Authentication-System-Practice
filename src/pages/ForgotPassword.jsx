import { Link } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout.jsx";
import { Alert } from "../components/FormField.jsx";

// Placeholder: password reset needs an email provider (SMTP/SES), which isn't set up in this project yet.
export default function ForgotPassword() {
  return (
    <AuthLayout title="Reset your password" subtitle="Password reset by email isn't available yet."
      footer={<Link to="/login">Back to sign in</Link>}>
      <Alert kind="info">This feature needs an email service to be configured. Contact an administrator to reset your password.</Alert>
    </AuthLayout>
  );
}
