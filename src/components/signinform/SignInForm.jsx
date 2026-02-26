// import React, { useState } from 'react';
// import InputField from '../inputfield/InputField';
// import styles from './SignInForm.module.css';
// import { Link } from 'react-router-dom';

// const SignInForm = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle sign in logic here
//     console.log('Sign in with:', formData);
//   };

//   return (
//     <form onSubmit={handleSubmit} className={styles.form}>
//       {/* Email Input */}
//       <InputField
//         label="Email Address"
//         type="email"
//         name="email"
//         id="email"
//         placeholder="name@example.com"
//         value={formData.email}
//         onChange={handleChange}
//         required
//       />

//       {/* Password Input */}
//       <InputField
//         label="Password"
//         type="password"
//         name="password"
//         id="password"
//         placeholder="••••••••"
//         value={formData.password}
//         onChange={handleChange}
//         required
//       />

//       {/* Forgot Password Link */}
//       <div className={styles.forgotPassword}>
//         <a href="/forgot-password" className={styles.forgotPasswordLink}>
//           Forgot Password?
//         </a>
//       </div>

//       {/* Submit Button */}
//       <button type="submit" className={styles.submitButton}>
//         Sign In
//       </button>
//     </form>
//   );
// };

// export default SignInForm;

// import React, { useMemo, useState } from 'react';
// import InputField from '../inputfield/InputField';
// import styles from './SignInForm.module.css';


// import lockIcon from '../../assets/icons/Lock.svg';
// import hideIcon from '../../assets/icons/Hide.svg';
// import showIcon from '../../assets/icons/Show.png';

// const SignInForm = () => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [showPassword, setShowPassword] = useState(false);

//   const [errors, setErrors] = useState({ email: '', password: '' });

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({ ...prev, [name]: value }));

//     // clear error while typing
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: '' }));
//     }
//   };

//   const passwordErrorMessage = useMemo(() => {
//     // simple rule for now (you can match backend rules later)
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

//     console.log('Sign in with:', formData);
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
//         leftIconSrc={lockIcon}
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




// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import InputField from '../inputfield/InputField';
// import styles from './SignInForm.module.css';

// const SignInForm = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });

//   const [errors, setErrors] = useState({
//     email: '',
//     password: '',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({ ...prev, [name]: value }));

//     // clear error as user types
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const nextErrors = { email: '', password: '' };

//     if (!formData.email) nextErrors.email = 'Email is required.';
//     if (!formData.password) nextErrors.password = 'Password is required.';
//     else if (formData.password.length < 8) nextErrors.password = 'Invalid password. Use at least 8 characters.';

//     if (nextErrors.email || nextErrors.password) {
//       setErrors(nextErrors);
//       return;
//     }

//     // ✅ Navigate to verification popup page
//     navigate('/verify-account', { state: { email: formData.email } });
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
//         error={errors.email}
//       />

//       <InputField
//         label="Password"
//         type="password"
//         name="password"
//         id="password"
//         placeholder="••••••••"
//         value={formData.password}
//         onChange={handleChange}
//         required
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



// import React, { useMemo, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import InputField from '../inputfield/InputField';
// import styles from './SignInForm.module.css';

// import lockIcon from '../../assets/icons/Lock.svg';
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

//     // ✅ go to verification popup page
//     navigate('/verify-account', { state: { email: formData.email } });
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
//         leftIconSrc={lockIcon}
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


import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../inputfield/InputField';
import styles from './SignInForm.module.css';
import Greylock from '../../assets/icons/Greylockicon.png';

// import lockIcon from '../../assets/icons/Lock.svg';
import hideIcon from '../../assets/icons/Hide.svg';
import showIcon from '../../assets/icons/Show.png';

const SignInForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const passwordErrorMessage = useMemo(() => {
    if (!formData.password) return 'Password is required.';
    if (formData.password.length < 8) return 'Invalid password. Use at least 8 characters.';
    return '';
  }, [formData.password]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = { email: '', password: '' };

    if (!formData.email) nextErrors.email = 'Email is required.';
    if (passwordErrorMessage) nextErrors.password = passwordErrorMessage;

    if (nextErrors.email || nextErrors.password) {
      setErrors(nextErrors);
      return;
    }

    // ✅ This is what makes the button "work"
    navigate('/verify-account', { state: { email: formData.email } });
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
        type={showPassword ? 'text' : 'password'}
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
        rightIconAlt={showPassword ? 'Hide password' : 'Show password'}
        rightIconAriaLabel={showPassword ? 'Hide password' : 'Show password'}
        onRightIconClick={() => setShowPassword((prev) => !prev)}
        error={errors.password}
      />

      <div className={styles.forgotPassword}>
        <a href="/forgot-password" className={styles.forgotPasswordLink}>
          Forgot Password?
        </a>
      </div>

      <button type="submit" className={styles.submitButton}>
        Sign In
      </button>
    </form>
  );
};

export default SignInForm;