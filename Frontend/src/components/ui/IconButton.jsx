import './IconButton.css';

export default function IconButton({ icon: Icon, label, active, ...rest }) {
  return (
    <button type="button" className={`icon-btn ${active ? 'icon-btn--active' : ''}`} aria-label={label} title={label} {...rest}>
      <Icon size={18} aria-hidden="true" />
    </button>
  );
}
