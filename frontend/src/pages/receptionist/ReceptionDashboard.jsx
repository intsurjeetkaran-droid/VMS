/**
 * Reception Dashboard — Smart Reception UI
 * Dark mode + responsive + no window.confirm
 */
import { useState, useEffect, useCallback } from 'react';
import { getVisitors, checkIn, checkOut, createVisitor } from '../../services/visitorService';
import { getEmployees } from '../../services/userService';
import { getDashboardStats } from '../../services/reportService';
import StatusBadge from '../../components/ui/StatusBadge';
import StatCard from '../../components/ui/StatCard';
import Spinner from '../../components/ui/Spinner';
import { formatTime } from '../../utils/formatDate';
import { Users, UserCheck, Clock, CheckCircle, Plus, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_FORM = {
  name: '', phone: '', email: '', purpose: '', company: '', host_id: '', notes: '',
};

const inputCls = 'w-full px-3 py-2 text-sm border border-slate-200 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-700 text-slate-800 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500';
const labelCls = 'block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1';

const ReceptionDashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [stats, setStats] = useState({});
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchData = useCallback(async () => {
    try {
      const [vRes, sRes, eRes] = await Promise.all([
        getVisitors(),
        getDashboardStats(),
        getEmployees(),
      ]);
      setVisitors(vRes.data.data.visitors);
      setStats(sRes.data.data.stats);
      setEmployees(eRes.data.data.employees);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleCheckIn = async (id) => {
    try {
      await checkIn(id);
      toast.success('Visitor checked in');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-in failed');
    }
  };

  const handleCheckOut = async (id) => {
    try {
      await checkOut(id);
      toast.success('Visitor checked out');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-out failed');
    }
  };

  const handleAddVisitor = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createVisitor(form);
      toast.success(`${form.name} registered successfully`);
      setForm(INITIAL_FORM);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register visitor');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = visitors.filter((v) => {
    const matchStatus = activeFilter === 'all' || v.status === activeFilter;
    const matchSearch =
      !search ||
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.phone.includes(search);
    return matchStatus && matchSearch;
  });

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Waiting' },
    { key: 'approved', label: 'Approved' },
    { key: 'checked-in', label: 'Inside' },
    { key: 'checked-out', label: 'Done' },
  ];

  if (loading) return <div className="flex items-center justify-center h-screen dark:bg-zinc-900"><Spinner size="lg" /></div>;

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-zinc-100">Reception Dashboard</h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm mt-0.5">Manage visitor check-ins and registrations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total Today" value={stats.total}      icon={Users}        color="blue" />
        <StatCard label="Inside Now"  value={stats.checkedIn}  icon={UserCheck}    color="green" />
        <StatCard label="Waiting"     value={stats.pending}    icon={Clock}        color="yellow" />
        <StatCard label="Completed"   value={stats.checkedOut} icon={CheckCircle}  color="gray" />
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* ── Live Visitor Board ── */}
        <div className="xl:col-span-2 bg-white dark:bg-zinc-800 rounded-2xl border border-slate-100 dark:border-zinc-700 shadow-sm">
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-semibold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live Visitor Board
            </h2>
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or phone..."
                className="pl-8 pr-8 py-2 text-sm border border-slate-200 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-700 text-slate-800 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-52"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Filter tabs */}
          <div className="px-4 sm:px-5 pt-3 flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeFilter === f.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-600'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Visitor cards grid */}
          <div className="p-4 sm:p-5 max-h-[520px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Users size={40} className="mx-auto mb-2 opacity-30" />
                <p>No visitors found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filtered.map((v) => (
                  <div
                    key={v._id}
                    className="rounded-xl border border-slate-100 dark:border-zinc-700 bg-slate-50/50 dark:bg-zinc-700/30 hover:border-blue-200 dark:hover:border-blue-700 hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition-colors p-3 flex flex-col gap-2.5"
                  >
                    {/* Name + status */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {v.name.charAt(0).toUpperCase()}
                        </div>
                        <p className="font-semibold text-slate-800 dark:text-zinc-100 text-sm truncate">{v.name}</p>
                      </div>
                      <StatusBadge status={v.status} />
                    </div>

                    {/* Info row */}
                    <div className="text-xs text-slate-500 dark:text-zinc-400 space-y-0.5">
                      <p className="truncate">{v.phone} · {v.purpose}</p>
                      <p className="truncate">
                        Host: {v.host_id?.name || '—'}
                        {v.entry_time && ` · In: ${formatTime(v.entry_time)}`}
                      </p>
                    </div>

                    {/* Action */}
                    {(v.status === 'pending' || v.status === 'approved') && (
                      <button
                        onClick={() => handleCheckIn(v._id)}
                        className="w-full py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
                      >
                        Check In
                      </button>
                    )}
                    {v.status === 'checked-in' && (
                      <button
                        onClick={() => handleCheckOut(v._id)}
                        className="w-full py-1.5 bg-zinc-600 hover:bg-zinc-700 text-white text-xs font-medium rounded-lg transition-colors"
                      >
                        Check Out
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Quick Add Form ── */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-slate-100 dark:border-zinc-700 shadow-sm">
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-zinc-700">
            <h2 className="font-semibold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
              <Plus size={18} className="text-blue-600" />
              Register Visitor
            </h2>
          </div>

          <form onSubmit={handleAddVisitor} className="p-4 sm:p-5 space-y-3">
            {[
              { key: 'name',    label: 'Full Name *',  placeholder: 'John Doe',          required: true },
              { key: 'phone',   label: 'Phone *',      placeholder: '+91 98765 43210',   required: true },
              { key: 'email',   label: 'Email',        placeholder: 'visitor@email.com', type: 'email' },
              { key: 'company', label: 'Company',      placeholder: 'Company name' },
              { key: 'purpose', label: 'Purpose *',    placeholder: 'Meeting, Delivery...', required: true },
            ].map(({ key, label, placeholder, required, type = 'text' }) => (
              <div key={key}>
                <label className={labelCls}>{label}</label>
                <input
                  type={type}
                  required={required}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className={inputCls}
                />
              </div>
            ))}

            <div>
              <label className={labelCls}>Host Employee *</label>
              <select
                required
                value={form.host_id}
                onChange={(e) => setForm({ ...form, host_id: e.target.value })}
                className={inputCls}
              >
                <option value="">Select employee...</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name}{emp.department ? ` (${emp.department})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Any additional notes..."
                rows={2}
                className={`${inputCls} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors"
            >
              {submitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Plus size={16} /> Register Visitor</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReceptionDashboard;
