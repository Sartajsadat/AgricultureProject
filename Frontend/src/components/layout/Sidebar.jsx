import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { getNavItemsForRoles } from '../../config/navConfig';
import './Sidebar.css';

export default function Sidebar() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const items = getNavItemsForRoles(user?.roles);

  return (
    <nav className="sidebar" aria-label="Primary">
      <ul className="sidebar__list">
        {items.map((item) => (
          <li key={item.key}>
            <NavLink
              to={item.path}
              className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
            >
              <item.icon size={18} className="sidebar__icon" aria-hidden="true" />
              <span>{t(item.labelKey)}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
