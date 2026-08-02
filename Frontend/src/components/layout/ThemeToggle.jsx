import { useTranslation } from 'react-i18next';
import { Sun, Moon } from 'lucide-react';
import IconButton from '../ui/IconButton';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <IconButton
      icon={theme === 'dark' ? Sun : Moon}
      label={t('navbar.toggleDark')}
      onClick={toggleTheme}
    />
  );
}
