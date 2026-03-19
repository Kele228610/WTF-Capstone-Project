// import React, { useMemo, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import InputField from '../inputfield/InputField';
// import styles from './SignInForm.module.css';
// import Greylock from '../../assets/icons/Greylockicon.png';

// // import lockIcon from '../../assets/icons/Lock.svg';
// import hideIcon from '../../assets/icons/Hide.svg';
// import showIcon from '../../assets/icons/Show.png';

// const SignInForm = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState({ email: '', password: '' });

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({ ...prev, [name]: value }));

//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: '' }));
//     }
//   };

//   const passwordErrorMessage = useMemo(() => {
//     if (!formData.password) return 'Password is required.';
//     if (formData.password.length < 8) return 'Invalid password. Use at least 8 characters.';
//     return '';
//   }, [formData.password]);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const nextErrors = { email: '', password: '' };

//     if (!formData.email) nextErrors.email = 'Email is required.';
//     if (passwordErrorMessage) nextErrors.password = passwordErrorMessage;

//     if (nextErrors.email || nextErrors.password) {
//       setErrors(nextErrors);
//       return;
//     }

//     // ✅ This is what makes the button "work"
//     navigate('/returning-home');
//   };

//   return (
//     <form onSubmit={handleSubmit} className={styles.form}>
//       <InputField
//         label="Email Address"
//         type="email"
//         name="email"
//         id="email"
//         placeholder="name@example.com"
//         value={formData.email}
//         onChange={handleChange}
//         required
//         autoComplete="email"
//         error={errors.email}
//       />

//       <InputField
//         label="Password"
//         type={showPassword ? 'text' : 'password'}
//         name="password"
//         id="password"
//         placeholder="••••••••"
//         value={formData.password}
//         onChange={handleChange}
//         required
//         autoComplete="current-password"
//         leftIconSrc={Greylock}
//         leftIconAlt="Lock"
//         rightIconSrc={showPassword ? hideIcon : showIcon}
//         rightIconAlt={showPassword ? 'Hide password' : 'Show password'}
//         rightIconAriaLabel={showPassword ? 'Hide password' : 'Show password'}
//         onRightIconClick={() => setShowPassword((prev) => !prev)}
//         error={errors.password}
//       />

//       <div className={styles.forgotPassword}>
//         <a href="/forgot-password" className={styles.forgotPasswordLink}>
//           Forgot Password?
//         </a>
//       </div>

//       <button type="submit" className={styles.submitButton}>
//         Sign In
//       </button>
//     </form>
//   );
// };

// export default SignInForm;

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../inputfield/InputField";
import styles from "./SignInForm.module.css";
import Greylock from "../../assets/icons/Greylockicon.png";
import hideIcon from "../../assets/icons/Hide.svg";
import showIcon from "../../assets/icons/Show.png";

import { login } from "../../api/auth"; // ✅ ADD THIS


const SignInForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const [loading, setLoading] = useState(false);     // ✅ ADD
  const [apiError, setApiError] = useState("");      // ✅ ADD

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (apiError) setApiError(""); // ✅ clear API error when user edits
  };

  const passwordErrorMessage = useMemo(() => {
    if (!formData.password) return "Password is required.";
    if (formData.password.length < 8) return "Invalid password. Use at least 8 characters.";
    return "";
  }, [formData.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    const nextErrors = { email: "", password: "" };

    if (!formData.email) nextErrors.email = "Email is required.";
    if (passwordErrorMessage) nextErrors.password = passwordErrorMessage;

    if (nextErrors.email || nextErrors.password) {
      setErrors(nextErrors);
      return;
    }

    try {
      setLoading(true);

      // CALL BACKEND
      await login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });

      // ✅ Navigate only after success
      navigate("/returning-home");
    } catch (err) {
      // show backend error message
      const statusText = err?.status ? ` (HTTP ${err.status})` : "";
      setApiError((err.message || "Login failed. Please try again.") + statusText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <InputField
        label="Email Address"
        type="email"
        name="email"
        id="email"
        placeholder="name@example.com"
        value={formData.email}
        onChange={handleChange}
        required
        autoComplete="email"
        error={errors.email}
      />

      <InputField
        label="Password"
        type={showPassword ? "text" : "password"}
        name="password"
        id="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
        required
        autoComplete="current-password"
        leftIconSrc={Greylock}
        leftIconAlt="Lock"
        rightIconSrc={showPassword ? hideIcon : showIcon}
        rightIconAlt={showPassword ? "Hide password" : "Show password"}
        rightIconAriaLabel={showPassword ? "Hide password" : "Show password"}
        onRightIconClick={() => setShowPassword((prev) => !prev)}
        error={errors.password}
      />

      <div className={styles.forgotPassword}>
        <a href="/forgot-password" className={styles.forgotPasswordLink}>
          Forgot Password?
        </a>
      </div>

      {/* Show API error message */}
      {apiError && <p className={styles.apiError}>{apiError}</p>}

      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
};

export default SignInForm;
