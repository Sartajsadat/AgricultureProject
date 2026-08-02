import './Input.css';

export default function Input({ label, error, icon: Icon, id, ...rest }) {
  const inputId = id || rest.name;
  return (
    <div className="field">
      {label && (
        <label className="field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className={`field__control ${error ? 'field__control--error' : ''}`}>
        {Icon && <Icon size={16} className="field__icon" aria-hidden="true" />}
        <input id={inputId} className="field__input" {...rest} />
      </div>
      {error && <span className="field__error">{error}</span>}
    </div>
  );
}
