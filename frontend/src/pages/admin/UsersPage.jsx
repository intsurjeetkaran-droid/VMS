import { useState, useEffect } from 'react';
import { getUsers, createUser, deleteUser } from '../../services/userService';
import Spinner from '../../components/ui/Spinner';
import { useConfirm } from '../../components/ui/ConfirmModal';
import { UserPlus, Trash2, X, Eye, EyeOff, Mail, Building, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const ROLES = ['admin', 'receptionist', 'employee'];
const INIT  = { name: '', email: '', password: '', role: 'employee', department: '' };

const roleStyle = {
  admin:        { badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300', dot: 'bg-purple-500' },
  receptionist: { badge: 'bg-blue-100   text-blue-700   dark:bg-blue-900/40   dark:text-blue-300',   dot: 'bg-blue-500'   },
  employee:     { badge: 'bg-green-100  text-green-700  dark:bg-green-900/40  dark:text-green-300',  dot: 'bg-green-500'  },
};

const avatarGradients = [
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-pink-600',
  'from-green-500 to-teal-600',
  'from-orange-500 to-red-600',
  'from-cyan-500 to-blue-600',
];

const inputCls = `w-full px-3 py-2 text-sm rounded-xl border
  border-slate-200 dark:border-zinc-600
  bg-white dark:bg-zinc-700
  text-slate-800 dark:text-zinc-100
  placeholder-slate-400 dark:placeholder-zinc-500
  focus:outline-none focus:ring-2 focus:ring-blue-500`;

const UsersPage = () => {
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState(INIT);
  const [submitting, setSubmitting] = useState(false);
  const [showPass, setShowPass]   = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');
  const { confirm, ConfirmModal } = useConfirm();

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data.data.users);
    } catch { toast.error('Failed to load users'); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createUser(form);
      toast.success('User created successfully');
      setShowModal(false); setForm(INIT); setShowPass(false);
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create user'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id, name) => {
    const ok = await confirm({
      title: `Deactivate ${name}?`,
      message: 'This user will no longer be able to log in.',
      confirmLabel: 'Deactivate', danger: true,
    });
    if (!ok) return;
    try { await deleteUser(id); toast.success(`${name} deactivated`); fetchUsers(); }
    catch { toast.error('Failed to deactivate user'); }
  };

  const filtered = roleFilter === 'all' ? users : users.filter(u => u.role === roleFilter);

  if (loading) return <div className="flex items-center justify-center h-full"><Spinner size="lg" /></div>;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <ConfirmModal />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-zinc-100">Users</h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm mt-0.5">
            {users.length} total · {users.filter(u => u.isActive).length} active
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors self-start sm:self-auto shadow-sm"
        >
          <UserPlus size={16} /> Add User
        </button>
      </div>

      {/* Role filter pills */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'admin', 'receptionist', 'employee'].map(r => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
              roleFilter === r
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
            }`}
          >
            {r === 'all' ? `All (${users.length})` : `${r} (${users.filter(u => u.role === r).length})`}
          </button>
        ))}
      </div>

      {/* ── Card Grid ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400 dark:text-zinc-600">
          <Users size={40} className="mx-auto mb-2 opacity-30" />
          <p>No users found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((u, i) => {
            const rs = roleStyle[u.role] || roleStyle.employee;
            const grad = avatarGradients[i % avatarGradients.length];
            return (
              <div
                key={u._id}
                className={`relative bg-white dark:bg-zinc-800 rounded-2xl border shadow-sm p-5 flex flex-col gap-4 transition-shadow hover:shadow-md
                  ${u.isActive
                    ? 'border-slate-100 dark:border-zinc-700'
                    : 'border-red-100 dark:border-red-900/30 opacity-60'
                  }`}
              >
                {/* Status dot */}
                <span className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full ${u.isActive ? 'bg-green-500' : 'bg-red-400'}`} title={u.isActive ? 'Active' : 'Inactive'} />

                {/* Avatar + name */}
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white font-bold text-base flex-shrink-0`}>
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-zinc-100 truncate">{u.name}</p>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${rs.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${rs.dot}`} />
                      {u.role}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400">
                    <Mail size={13} className="flex-shrink-0" />
                    <span className="truncate">{u.email}</span>
                  </div>
                  {u.department && (
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400">
                      <Building size={13} className="flex-shrink-0" />
                      <span>{u.department}</span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-zinc-700">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    u.isActive
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {u.isActive && (
                    <button
                      onClick={() => handleDelete(u._id, u.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Deactivate user"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Create User Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-100 dark:border-zinc-700">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-zinc-700">
              <h3 className="font-semibold text-slate-800 dark:text-zinc-100">Add New User</h3>
              <button onClick={() => { setShowModal(false); setShowPass(false); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition-colors p-1">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">Full Name *</label>
                  <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="John Doe" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">Department</label>
                  <input type="text" value={form.department} onChange={e => setForm({...form, department: e.target.value})} placeholder="Engineering, HR..." className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">Email *</label>
                <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="john@company.com" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">Password *</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} required value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Min 6 characters" className={`${inputCls} pr-10`} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition-colors" aria-label={showPass ? 'Hide' : 'Show'}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1">Role</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className={inputCls}>
                  {ROLES.map(r => <option key={r} value={r} className="capitalize">{r}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setShowPass(false); }} className="flex-1 py-2.5 border border-slate-200 dark:border-zinc-600 rounded-xl text-sm font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors">
                  {submitting ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
