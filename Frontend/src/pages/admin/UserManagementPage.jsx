import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { UserPlus, Pencil, KeyRound, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import IconButton from '../../components/ui/IconButton';
import SearchInput from '../../components/ui/SearchInput';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import AddUserModal from '../../components/modals/AddUserModal';
import EditUserModal from '../../components/modals/EditUserModal';
import ResetPasswordModal from '../../components/modals/ResetPasswordModal';
import { userApi } from '../../api/userApi';
import './UserManagementPage.css';

export default function UserManagementPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [addOpen, setAddOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [resettingUser, setResettingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  async function handleDelete() {
    if (!deletingUser) return;
    setDeleteLoading(true);
    try {
      await userApi.delete(deletingUser.id);
      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
      setDeletingUser(null);
    } finally {
      setDeleteLoading(false);
    }
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
    {
      key: 'actions',
      label: t('users.columns.actions'),
      render: (row) => (
        <div className="user-management__actions">
          <IconButton icon={Pencil} label={t('common.edit')} onClick={() => setEditingUser(row)} />
          <IconButton icon={KeyRound} label={t('users.resetPasswordTitle')} onClick={() => setResettingUser(row)} />
          <IconButton icon={Trash2} label={t('common.delete')} tone="danger" onClick={() => setDeletingUser(row)} />
        </div>
      ),
    },
  ];

  return (
    <div className="user-management">
      <div className="user-management__header">
        <h1 className="user-management__title">{t('users.title')}</h1>
        <Button icon={UserPlus} onClick={() => setAddOpen(true)}>
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

      <AddUserModal open={addOpen} onClose={() => setAddOpen(false)} onCreated={loadUsers} />

      <EditUserModal
        open={!!editingUser}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSaved={loadUsers}
      />

      <ResetPasswordModal
        open={!!resettingUser}
        user={resettingUser}
        onClose={() => setResettingUser(null)}
      />

      <ConfirmDialog
        open={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title={t('users.deleteTitle')}
        message={t('users.deleteMessage', {
          name: deletingUser ? `${deletingUser.firstName} ${deletingUser.lastName}` : '',
        })}
      />
    </div>
  );
}
