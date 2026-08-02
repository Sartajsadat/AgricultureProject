import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { UserPlus } from 'lucide-react';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import AddUserModal from '../../components/modals/AddUserModal';
import { userApi } from '../../api/userApi';
import './UserManagementPage.css';

export default function UserManagementPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  function loadUsers() {
    setLoading(true);
    userApi
      .list()
      .then(setUsers)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!query.trim()) return users;
    const q = query.toLowerCase();
    return users.filter(
      (u) =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }, [users, query]);

  async function toggleStatus(user) {
    const nextStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const updated = await userApi.updateStatus(user.id, nextStatus);
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: updated.status } : u)));
  }

  const columns = [
    {
      key: 'name',
      label: t('users.columns.name'),
      sortable: true,
      sortValue: (row) => `${row.firstName} ${row.lastName}`,
      render: (row) => (
        <span className="user-management__name">
          {row.firstName} {row.lastName}
        </span>
      ),
    },
    { key: 'email', label: t('users.columns.email'), sortable: true },
    { key: 'department', label: t('users.columns.department'), sortable: true },
    {
      key: 'roles',
      label: t('users.columns.roles'),
      render: (row) => (
        <div className="user-management__roles">
          {row.roles?.map((r) => (
            <Badge key={r.id} tone="accent">
              {r.name}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: 'status',
      label: t('users.columns.status'),
      sortable: true,
      render: (row) => (
        <button
          type="button"
          className="user-management__status-toggle"
          onClick={() => toggleStatus(row)}
        >
          <Badge tone={row.status === 'ACTIVE' ? 'success' : 'danger'}>
            {row.status === 'ACTIVE' ? t('common.active') : t('common.inactive')}
          </Badge>
        </button>
      ),
    },
  ];

  return (
    <div className="user-management">
      <div className="user-management__header">
        <h1 className="user-management__title">{t('users.title')}</h1>
        <Button icon={UserPlus} onClick={() => setModalOpen(true)}>
          {t('users.addNew')}
        </Button>
      </div>

      <div className="user-management__toolbar">
        <SearchInput value={query} onChange={setQuery} placeholder={t('users.search')} />
      </div>

      {!loading && (
        <DataTable
          columns={columns}
          rows={filteredUsers}
          getRowId={(row) => row.id}
          emptyMessage={t('users.empty')}
        />
      )}

      <AddUserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={loadUsers}
      />
    </div>
  );
}
