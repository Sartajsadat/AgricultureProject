import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldPlus } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import AddRoleModal from '../../components/modals/AddRoleModal';
import { roleApi } from '../../api/roleApi';
import './RolesPage.css';

export default function RolesPage() {
  const { t } = useTranslation();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  function loadRoles() {
    setLoading(true);
    roleApi
      .list()
      .then(setRoles)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadRoles();
  }, []);

  return (
    <div>
      <div className="roles-page__header">
        <h1 className="roles-page__title">{t('roles.title')}</h1>
        <Button icon={ShieldPlus} onClick={() => setModalOpen(true)}>
          {t('roles.addNew')}
        </Button>
      </div>

      {!loading && (
        <div className="roles-page__grid">
          {roles.length === 0 && <p style={{ color: 'var(--color-text-faint)' }}>{t('roles.empty')}</p>}
          {roles.map((role) => (
            <div key={role.id} className="roles-page__card">
              <Badge tone="accent">{role.name}</Badge>
            </div>
          ))}
        </div>
      )}

      <AddRoleModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={loadRoles} />
    </div>
  );
}
