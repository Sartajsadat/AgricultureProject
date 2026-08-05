import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { userApi } from '../../api/userApi';
import { roleApi } from '../../api/roleApi';
import { useToast } from '../../context/ToastContext';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  directorate: '',
  department: '',
  position: '',
  phoneNo: '',
};

export default function AddUserModal({ open, onClose, onCreated }) {
  const { t } = useTranslation();
  const toast = useToast();
  const [form, setForm] = useState(initialForm);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      roleApi.list().then(setAvailableRoles).catch(() => setAvailableRoles([]));
    }
  }, [open]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleRole(roleName) {
    setSelectedRoles((prev) =>
      prev.includes(roleName) ? prev.filter((r) => r !== roleName) : [...prev, roleName]
    );
  }

  function handleClose() {
    setForm(initialForm);
    setSelectedRoles([]);
    setError('');
    onClose();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (selectedRoles.length === 0) {
      setError('Select at least one role');
      return;
    }

    setLoading(true);
    try {
      const created = await userApi.create({ ...form, roles: selectedRoles });
      onCreated?.(created);
      toast.success(t('users.createSuccess'));
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create user');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title={t('users.addNew')} size="lg">
      <form className="modal-form" onSubmit={handleSubmit}>
        <div className="modal-form__grid">
          <Input label={t('profile.firstName')} value={form.firstName} onChange={(e) => update('firstName', e.target.value)} required />
          <Input label={t('profile.lastName')} value={form.lastName} onChange={(e) => update('lastName', e.target.value)} required />
        </div>
        <Input type="email" label={t('profile.email')} value={form.email} onChange={(e) => update('email', e.target.value)} required />
        <Input type="password" label="Password" value={form.password} onChange={(e) => update('password', e.target.value)} minLength={6} required />
        <div className="modal-form__grid">
          <Input label="Directorate" value={form.directorate} onChange={(e) => update('directorate', e.target.value)} />
          <Input label={t('profile.department')} value={form.department} onChange={(e) => update('department', e.target.value)} />
        </div>
        <div className="modal-form__grid">
          <Input label={t('profile.position')} value={form.position} onChange={(e) => update('position', e.target.value)} />
          <Input label={t('profile.phoneNo')} value={form.phoneNo} onChange={(e) => update('phoneNo', e.target.value)} />
        </div>

        <div>
          <span className="field__label">{t('profile.roles')}</span>
          <div className="role-picker">
            {availableRoles.map((role) => (
              <label key={role.id} className="role-picker__option">
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(role.name)}
                  onChange={() => toggleRole(role.name)}
                />
                <span>{role.name}</span>
              </label>
            ))}
          </div>
        </div>

        {error && <p className="modal-form__error">{error}</p>}

        <div className="modal-form__actions">
          <Button type="button" variant="ghost" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" loading={loading}>
            {t('common.create')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
