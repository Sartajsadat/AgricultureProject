import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { userApi } from '../../api/userApi';

export default function ResetPasswordModal({ open, onClose, user }) {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setSuccess(false);
    }
  }, [open]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError(t('changePassword.mismatch'));
      return;
    }

    setLoading(true);
    try {
      await userApi.resetPassword(user.id, newPassword);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reset password');
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  return (
    <Modal open={open} onClose={onClose} title={`${t('users.resetPasswordTitle')} — ${user.firstName} ${user.lastName}`}>
      <form className="modal-form" onSubmit={handleSubmit}>
        <Input
          type="password"
          label={t('changePassword.newPassword')}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          minLength={6}
          required
        />
        <Input
          type="password"
          label={t('changePassword.confirmPassword')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          minLength={6}
          required
          error={error}
        />
        {success && <p className="modal-form__success">{t('changePassword.success')}</p>}
        <div className="modal-form__actions">
          <Button type="button" variant="ghost" onClick={onClose}>
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
