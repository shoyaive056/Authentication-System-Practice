import { useState } from "react";

// Tiny form helper: input values plus per-field errors that clear as the user types.
export default function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((errs) => (errs[name] ? { ...errs, [name]: undefined } : errs));
  };

  return { values, errors, setErrors, handleChange };
}
