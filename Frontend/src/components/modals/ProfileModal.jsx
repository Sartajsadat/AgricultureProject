import { useTranslation } from 'react-i18next';
import Modal from '../ui/Modal';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';
import './ProfileModal.css';

export default function ProfileModal({ open, onClose }) {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user) return null;

  return (
    <Modal open={open} onClose={onClose} title={t('profile.title')}>
      <div className="profile-modal__header">
        <Avatar firstName={user.firstName} lastName={user.lastName} size={56} />
        <div>
          <div className="profile-modal__name">
            {user.firstName} {user.lastName}
          </div>
          <div className="profile-modal__email">{user.email}</div>
        </div>
      </div>

      <div className="profile-modal__row">
        <span className="profile-modal__label">{t('profile.status')}</span>
        <Badge tone={user.status === 'ACTIVE' ? 'success' : 'danger'}>
          {user.status === 'ACTIVE' ? t('common.active') : t('common.inactive')}
        </Badge>
      </div>

      <div className="profile-modal__row">
        <span className="profile-modal__label">{t('profile.roles')}</span>
        <div className="profile-modal__roles">
          {user.roles?.map((role) => (
            <Badge key={role} tone="accent">
              {role}
            </Badge>
          ))}
        </div>
      </div>
    </Modal>
  );
}
