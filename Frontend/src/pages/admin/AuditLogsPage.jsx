import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { SlidersHorizontal, Eye, X } from 'lucide-react';
import SearchInput from '../../components/ui/SearchInput';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import IconButton from '../../components/ui/IconButton';
import Button from '../../components/ui/Button';
import Popover from '../../components/ui/Popover';
import Pagination from '../../components/ui/Pagination';
import AuditLogDetailsModal from '../../components/modals/AuditLogDetailsModal';
import { auditApi } from '../../api/auditApi';
import { AUDIT_ACTIONS, AUDIT_ACTION_TONE } from '../../config/auditActions';
import './AuditLogsPage.css';

const PAGE_SIZE = 20;

export default function AuditLogsPage() {
  const { t } = useTranslation();

  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [performedByFilter, setPerformedByFilter] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({ action: '', performedBy: '' });

  const [selectedLog, setSelectedLog] = useState(null);

  const hasActiveFilters = !!(appliedFilters.action || appliedFilters.performedBy);

  const loadLogs = useCallback(() => {
    setLoading(true);
    const params = {
      page,
      size: PAGE_SIZE,
      ...(appliedFilters.action && { action: appliedFilters.action }),
      ...(appliedFilters.performedBy && { performedBy: appliedFilters.performedBy }),
    };
    auditApi
      .list(params)
      .then((data) => {
        setLogs(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      })
      .finally(() => setLoading(false));
  }, [page, appliedFilters]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  function applyFilters(close) {
    setAppliedFilters({ action: actionFilter, performedBy: performedByFilter });
    setPage(0);
    close?.();
  }

  function clearFilters(close) {
    setActionFilter('');
    setPerformedByFilter('');
    setAppliedFilters({ action: '', performedBy: '' });
    setPage(0);
    close?.();
  }

  // Quick client-side text search across the current page — description
  // and entity are the fields people actually scan by eye.
  const visibleLogs = query.trim()
    ? logs.filter((log) => {
        const q = query.toLowerCase();
        return (
          log.description?.toLowerCase().includes(q) ||
          log.performedBy?.toLowerCase().includes(q) ||
          log.entityLabel?.toLowerCase().includes(q) ||
          log.entityType?.toLowerCase().includes(q)
        );
      })
    : logs;

  const columns = [
    {
      key: 'action',
      label: t('audit.columns.action'),
      render: (row) => (
        <Badge tone={AUDIT_ACTION_TONE[row.action] || 'neutral'}>{t(`audit.actions.${row.action}`)}</Badge>
      ),
    },
    {
      key: 'entity',
      label: t('audit.columns.entity'),
      sortable: true,
      sortValue: (row) => row.entityLabel || row.entityType,
      render: (row) => (
        <span>{row.entityLabel || `${row.entityType} #${row.entityId ?? '—'}`}</span>
      ),
    },
    { key: 'performedBy', label: t('audit.columns.performedBy'), sortable: true },
    {
      key: 'description',
      label: t('audit.columns.description'),
      render: (row) => <span className="audit-logs__description">{row.description}</span>,
    },
    {
      key: 'performedAt',
      label: t('audit.columns.date'),
      sortable: true,
      sortValue: (row) => row.performedAt,
      render: (row) => new Date(row.performedAt).toLocaleString(),
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <IconButton icon={Eye} label={t('audit.viewDetails')} onClick={() => setSelectedLog(row)} />
      ),
    },
  ];

  return (
    <div className="audit-logs">
      <div className="audit-logs__header">
        <h1 className="audit-logs__title">{t('audit.title')}</h1>
      </div>

      <div className="audit-logs__toolbar">
        <SearchInput value={query} onChange={setQuery} placeholder={t('audit.search')} />

        <Popover
          align="end"
          trigger={
            <Button variant="secondary" icon={SlidersHorizontal}>
              {t('audit.filters')}
              {hasActiveFilters && <span className="audit-logs__filter-dot" aria-hidden="true" />}
            </Button>
          }
        >
          {({ close }) => (
            <div className="audit-filter-panel">
              <div className="audit-filter-panel__field">
                <label className="field__label">{t('audit.action')}</label>
                <select
                  className="audit-filter-panel__select"
                  value={actionFilter}
                  onChange={(e) => setActionFilter(e.target.value)}
                >
                  <option value="">{t('audit.allActions')}</option>
                  {AUDIT_ACTIONS.map((action) => (
                    <option key={action} value={action}>
                      {t(`audit.actions.${action}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="audit-filter-panel__field">
                <label className="field__label">{t('audit.performedBy')}</label>
                <input
                  className="audit-filter-panel__input"
                  type="text"
                  value={performedByFilter}
                  onChange={(e) => setPerformedByFilter(e.target.value)}
                  placeholder="admin@ss.com"
                />
              </div>

              <div className="audit-filter-panel__actions">
                <Button variant="ghost" onClick={() => clearFilters(close)}>
                  {t('audit.clearFilters')}
                </Button>
                <Button onClick={() => applyFilters(close)}>{t('audit.applyFilters')}</Button>
              </div>
            </div>
          )}
        </Popover>
      </div>

      {hasActiveFilters && (
        <div className="audit-logs__active-filters">
          {appliedFilters.action && (
            <button type="button" className="audit-logs__filter-chip" onClick={() => clearFilters()}>
              {t(`audit.actions.${appliedFilters.action}`)} <X size={12} />
            </button>
          )}
          {appliedFilters.performedBy && (
            <button type="button" className="audit-logs__filter-chip" onClick={() => clearFilters()}>
              {appliedFilters.performedBy} <X size={12} />
            </button>
          )}
        </div>
      )}

      {!loading && (
        <>
          <DataTable
            columns={columns}
            rows={visibleLogs}
            getRowId={(row) => row.id}
            emptyMessage={t('audit.empty')}
          />
          <Pagination page={page} totalPages={totalPages} totalElements={totalElements} onPageChange={setPage} />
        </>
      )}

      <AuditLogDetailsModal open={!!selectedLog} log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
}
