import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import './ToastContainer.css';

const ICONS = { success: CheckCircle2, error: XCircle, info: Info };

export default function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type] || Info;
        return (
          <div key={toast.id} className={`toast toast--${toast.type}`}>
            <Icon size={18} className="toast__icon" aria-hidden="true" />
            <span className="toast__message">{toast.message}</span>
            <button
              type="button"
              className="toast__close"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
