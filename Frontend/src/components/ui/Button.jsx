import './Button.css';

export default function Button({
  children,
  variant = 'primary', // primary | secondary | ghost | danger
  size = 'md', // sm | md
  icon: Icon,
  loading = false,
  disabled,
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="btn__spinner" aria-hidden="true" />
      ) : (
        Icon && <Icon size={16} className="btn__icon" aria-hidden="true" />
      )}
      <span>{children}</span>
    </button>
  );
}
