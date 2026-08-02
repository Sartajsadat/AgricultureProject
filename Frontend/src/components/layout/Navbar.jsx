import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';
import './Navbar.css';

// Swap this path when you have the real logo — nothing else changes.
const LOGO_SRC = '/logo-placeholder.svg';

export default function Navbar() {
  const { t } = useTranslation();

  return (
    <header className="navbar">
      {/* ✅ First child in source order = "start" of the row. In ltr that's
          visually left; in rtl the browser flips the row and it lands on
          the right — automatically, because of flex-direction: row + dir. */}
      <div className="navbar__brand">
        <img src={LOGO_SRC} alt="" className="navbar__logo" />
        <span className="navbar__title">{t('app.title')}</span>
      </div>

      {/* ✅ Last child in source order = "end" of the row — mirrors the same way. */}
      <div className="navbar__controls">
        <LanguageSwitcher />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
