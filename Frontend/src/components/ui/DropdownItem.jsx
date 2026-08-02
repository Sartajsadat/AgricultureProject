import './DropdownItem.css';

export default function DropdownItem({ icon: Icon, children, active, ...rest }) {
  return (
    <button type="button" className={`dropdown-item ${active ? 'dropdown-item--active' : ''}`} {...rest}>
      {Icon && <Icon size={16} aria-hidden="true" />}
      <span>{children}</span>
    </button>
  );
}
