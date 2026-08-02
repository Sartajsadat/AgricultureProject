import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { userApi } from '../../api/userApi';
import { roleApi } from '../../api/roleApi';
import { useToast } from '../../context/ToastContext';

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  directorate: '',
  department: '',
  position: '',
  phoneNo: '',
};

export default function EditUserModal({ open, onClose, user, onSaved }) {
  const { t } = useTranslation();
  const toast = useToast();
  const [form, setForm] = useState(emptyForm);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Re-fill the form whenever a different user is opened for editing.
  useEffect(() => {
    if (open && user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        directorate: user.directorate || '',
        department: user.department || '',
        position: user.position || '',
        phoneNo: user.phoneNo || '',
      });
      setSelectedRoles((user.roles || []).map((r) => r.name));
      setError('');
    }
  }, [open, user]);

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

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (selectedRoles.length === 0) {
      setError('Select at least one role');
      return;
    }

    setLoading(true);
    try {
      // Two backend calls: profile fields via PUT, roles via the dedicated
      // role-reassignment endpoint — that's how the API is shaped.
      await userApi.update(user.id, form);
      await userApi.assignRoles(user.id, selectedRoles);
      onSaved?.();
      toast.success(t('users.updateSuccess'));
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save changes');
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  return (
    <Modal open={open} onClose={onClose} title={t('users.edit')}>
      <form className="modal-form" onSubmit={handleSubmit}>
        <div className="modal-form__grid">
          <Input label={t('profile.firstName')} value={form.firstName} onChange={(e) => update('firstName', e.target.value)} required />
          <Input label={t('profile.lastName')} value={form.lastName} onChange={(e) => update('lastName', e.target.value)} required />
        </div>
        <Input type="email" label={t('profile.email')} value={form.email} onChange={(e) => update('email', e.target.value)} required />
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
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" loading={loading}>
            {t('common.save')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
