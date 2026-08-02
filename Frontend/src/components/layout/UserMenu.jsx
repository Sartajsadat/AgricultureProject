import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserRound, KeyRound, LogOut } from 'lucide-react';
import Dropdown from '../ui/Dropdown';
import DropdownItem from '../ui/DropdownItem';
import Avatar from '../ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import ProfileModal from '../modals/ProfileModal';
import ChangePasswordModal from '../modals/ChangePasswordModal';
import './UserMenu.css';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <Dropdown
        trigger={
          <button type="button" className="user-menu__trigger">
            <Avatar firstName={user.firstName} lastName={user.lastName} />
            <span className="user-menu__name">
              {user.firstName} {user.lastName}
            </span>
          </button>
        }
      >
        <DropdownItem icon={UserRound} onClick={() => setProfileOpen(true)}>
          {t('navbar.profile')}
        </DropdownItem>
        <DropdownItem icon={KeyRound} onClick={() => setPasswordOpen(true)}>
          {t('navbar.changePassword')}
        </DropdownItem>
        <DropdownItem icon={LogOut} onClick={logout}>
          {t('navbar.logout')}
        </DropdownItem>
      </Dropdown>

      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
      <ChangePasswordModal open={passwordOpen} onClose={() => setPasswordOpen(false)} />
    </>
  );
}
