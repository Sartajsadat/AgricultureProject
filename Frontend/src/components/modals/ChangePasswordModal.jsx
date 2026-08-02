import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { authApi } from '../../api/authApi';

const initialForm = { oldPassword: '', newPassword: '', confirmPassword: '' };

export default function ChangePasswordModal({ open, onClose }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleClose() {
    setForm(initialForm);
    setError('');
    setSuccess(false);
    onClose();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (form.newPassword !== form.confirmPassword) {
      setError(t('changePassword.mismatch'));
      return;
    }

    setLoading(true);
    try {
      await authApi.changeOwnPassword(form.oldPassword, form.newPassword);
      setSuccess(true);
      setForm(initialForm);
    } catch (err) {
      setError(err.response?.data?.message || t('login.error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title={t('changePassword.title')}>
      <form className="modal-form" onSubmit={handleSubmit}>
        <Input
          type="password"
          label={t('changePassword.oldPassword')}
          value={form.oldPassword}
          onChange={(e) => update('oldPassword', e.target.value)}
          required
        />
        <Input
          type="password"
          label={t('changePassword.newPassword')}
          value={form.newPassword}
          onChange={(e) => update('newPassword', e.target.value)}
          minLength={6}
          required
        />
        <Input
          type="password"
          label={t('changePassword.confirmPassword')}
          value={form.confirmPassword}
          onChange={(e) => update('confirmPassword', e.target.value)}
          minLength={6}
          required
          error={error}
        />
        {success && <p className="modal-form__success">{t('changePassword.success')}</p>}
        <div className="modal-form__actions">
          <Button type="button" variant="ghost" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" loading={loading}>
            {t('changePassword.submit')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
