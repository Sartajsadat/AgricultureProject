import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { roleApi } from '../../api/roleApi';

export default function AddRoleModal({ open, onClose, onCreated }) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleClose() {
    setName('');
    setError('');
    onClose();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const created = await roleApi.create(name);
      onCreated?.(created);
      handleClose();
    } catch (err) {
      setError(err.response?.status === 400 ? 'Role already exists' : 'Could not create role');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title={t('roles.addNew')}>
      <form className="modal-form" onSubmit={handleSubmit}>
        <Input
          label={t('roles.name')}
          value={name}
          onChange={(e) => setName(e.target.value.toUpperCase())}
          placeholder="e.g. DATA_ENTRY"
          error={error}
          required
        />
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
