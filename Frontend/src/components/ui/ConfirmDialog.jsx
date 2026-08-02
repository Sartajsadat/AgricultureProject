import { useTranslation } from 'react-i18next';
import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, danger = true, loading }) {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
            {t('common.confirm')}
          </Button>
        </>
      }
    >
      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>{message}</p>
    </Modal>
  );
}
