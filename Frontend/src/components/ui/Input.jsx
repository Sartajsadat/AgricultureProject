import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './Input.css';

export default function Input({ label, error, icon: Icon, id, type, ...rest }) {
    const [visible, setVisible] = useState(false);
    const isPassword = type === 'password';
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
                <input
                    id={inputId}
                    className="field__input"
                    type={isPassword ? (visible ? 'text' : 'password') : type}
                    {...rest}
                />
                {isPassword && (
                    <button
                        type="button"
                        className="field__toggle"
                        onClick={() => setVisible((v) => !v)}
                        aria-label={visible ? 'Hide password' : 'Show password'}
                    >
                        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                )}
            </div>
            {error && <span className="field__error">{error}</span>}
        </div>
    );
}
