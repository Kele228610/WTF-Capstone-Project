
import React, { useState } from 'react';
import styles from './InputField.module.css';
import hideIcon from '../../assets/icons/Hide.svg';
import showIcon from '../../assets/icons/Show.png';

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
  showPasswordToggle = false,

  // Error / helper text
  error,
  helperText,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const hasLeftIcon = Boolean(leftIconSrc);
  const shouldShowPasswordToggle = showPasswordToggle && type === 'password';
  const resolvedType = shouldShowPasswordToggle
    ? (isPasswordVisible ? 'text' : 'password')
    : type;
  const resolvedRightIconSrc = shouldShowPasswordToggle
    ? (isPasswordVisible ? hideIcon : showIcon)
    : rightIconSrc;
  const resolvedRightIconAlt = shouldShowPasswordToggle
    ? (isPasswordVisible ? 'Hide password' : 'Show password')
    : rightIconAlt;
  const resolvedRightIconAriaLabel = shouldShowPasswordToggle
    ? (isPasswordVisible ? 'Hide password' : 'Show password')
    : rightIconAriaLabel;
  const resolvedRightIconClick = shouldShowPasswordToggle
    ? (() => setIsPasswordVisible((prev) => !prev))
    : onRightIconClick;
  const hasRightIcon = Boolean(resolvedRightIconSrc);

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
          type={resolvedType}
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
            onClick={resolvedRightIconClick}
            aria-label={resolvedRightIconAriaLabel}
          >
            <img className={styles.rightIcon} src={resolvedRightIconSrc} alt={resolvedRightIconAlt} />
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

