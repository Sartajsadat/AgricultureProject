import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div>
      <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-semibold)' }}>
        {t('nav.dashboard')}
      </h1>
      <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
        {user?.firstName}, you're signed in as {user?.roles?.join(', ')}.
      </p>
      {/* ✅ This page is intentionally a placeholder. Role-specific dashboard
          widgets go here later — this file, plus a new navConfig entry, is
          all that's needed when that content is ready. */}
    </div>
  );
}
