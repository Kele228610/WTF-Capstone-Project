// import React from 'react';
// import styles from './InputField.module.css';

// const InputField = ({
//   label,
//   type = 'text',
//   name,
//   id,
//   placeholder,
//   value,
//   onChange,
//   required = false,
// }) => {
//   return (
//     <div className={styles.inputField}>
//       {/* Label */}
//       <label htmlFor={id} className={styles.label}>
//         {label}
//       </label>

//       {/* Input */}
//       <input
//         type={type}
//         name={name}
//         id={id}
//         placeholder={placeholder}
//         value={value}
//         onChange={onChange}
//         required={required}
//         className={styles.input}
//       />
//     </div>
//   );
// };

// export default InputField;

import React from 'react';
import styles from './InputField.module.css';

const InputField = ({
  label,
  type = 'text',
  name,
  id,
  placeholder,
  value,
  onChange,
  required = false,
  autoComplete,
  disabled = false,

  // Optional icons
  leftIconSrc,
  leftIconAlt = '',
  rightIconSrc,
  rightIconAlt = '',
  onRightIconClick,
  rightIconAriaLabel = 'Toggle',

  // Error / helper text
  error,
  helperText,
}) => {
  const hasLeftIcon = Boolean(leftIconSrc);
  const hasRightIcon = Boolean(rightIconSrc);

  return (
    <div className={styles.inputField}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      <div className={styles.inputWrapper}>
        {hasLeftIcon && (
          <img
            className={styles.leftIcon}
            src={leftIconSrc}
            alt={leftIconAlt}
            aria-hidden={leftIconAlt ? undefined : true}
          />
        )}

        <input
          type={type}
          name={name}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={`${styles.input} ${
            hasLeftIcon ? styles.inputWithLeftIcon : ''
          } ${hasRightIcon ? styles.inputWithRightIcon : ''} ${
            error ? styles.inputError : ''
          }`}
        />

        {hasRightIcon && (
          <button
            type="button"
            className={styles.rightIconBtn}
            onClick={onRightIconClick}
            aria-label={rightIconAriaLabel}
          >
            <img className={styles.rightIcon} src={rightIconSrc} alt={rightIconAlt} />
          </button>
        )}
      </div>

      {(error || helperText) && (
        <p className={error ? styles.errorText : styles.helperText}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default InputField;

