import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import Dropdown from '../ui/Dropdown';
import DropdownItem from '../ui/DropdownItem';
import IconButton from '../ui/IconButton';
import { applyDocumentDirection } from '../../utils/direction';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ps', label: 'پښتو' },
  { code: 'da', label: 'دری' },
];

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  function changeLanguage(code) {
    i18n.changeLanguage(code);
    applyDocumentDirection(code);
  }

  return (
    <Dropdown
      trigger={<IconButton icon={Globe} label={t('navbar.language')} />}
    >
      {LANGUAGES.map((lang) => (
        <DropdownItem
          key={lang.code}
          active={i18n.language === lang.code}
          onClick={() => changeLanguage(lang.code)}
        >
          <span style={{ flex: 1 }}>{lang.label}</span>
          {i18n.language === lang.code && <Check size={14} />}
        </DropdownItem>
      ))}
    </Dropdown>
  );
}
