import { useTranslation } from 'react-i18next';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import { AUDIT_ACTION_TONE } from '../../config/auditActions';
import './AuditLogDetailsModal.css';

function formatJson(value) {
  if (!value) return null;
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

export default function AuditLogDetailsModal({ open, onClose, log }) {
  const { t } = useTranslation();

  if (!log) return null;

  const oldFormatted = formatJson(log.oldValue);
  const newFormatted = formatJson(log.newValue);

  return (
    <Modal open={open} onClose={onClose} title={t('audit.details.title')}>
      <div className="audit-details">
        <div className="audit-details__meta">
          <Badge tone={AUDIT_ACTION_TONE[log.action] || 'neutral'}>{t(`audit.actions.${log.action}`)}</Badge>
          <span className="audit-details__time">{new Date(log.performedAt).toLocaleString()}</span>
        </div>

        <div className="audit-details__row">
          <span className="audit-details__label">{t('audit.columns.performedBy')}</span>
          <span>{log.performedBy}</span>
        </div>
        <div className="audit-details__row">
          <span className="audit-details__label">{t('audit.columns.entity')}</span>
          <span>{log.entityLabel || `${log.entityType} #${log.entityId ?? '—'}`}</span>
        </div>
        {log.description && (
          <div className="audit-details__row">
            <span className="audit-details__label">{t('audit.columns.description')}</span>
            <span>{log.description}</span>
          </div>
        )}
        {log.ipAddress && (
          <div className="audit-details__row">
            <span className="audit-details__label">{t('audit.details.ip')}</span>
            <span>{log.ipAddress}</span>
          </div>
        )}
        {log.userAgent && (
          <div className="audit-details__row">
            <span className="audit-details__label">{t('audit.details.userAgent')}</span>
            <span className="audit-details__ua">{log.userAgent}</span>
          </div>
        )}

        {(oldFormatted || newFormatted) && (
          <div className="audit-details__snapshots">
            {oldFormatted && (
              <div>
                <span className="audit-details__label">{t('audit.details.oldValue')}</span>
                <pre className="audit-details__code">{oldFormatted}</pre>
              </div>
            )}
            {newFormatted && (
              <div>
                <span className="audit-details__label">{t('audit.details.newValue')}</span>
                <pre className="audit-details__code">{newFormatted}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
