import { useState, useEffect } from 'react';
import { getVisitors, checkIn, checkOut, searchVisitors } from '../../services/visitorService';
import StatusBadge from '../../components/ui/StatusBadge';
import Spinner from '../../components/ui/Spinner';
import { formatDate, formatTime } from '../../utils/formatDate';
import { Search, X, LogIn, LogOut, Phone, Briefcase, User, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES = ['all', 'pending', 'approved', 'checked-in', 'checked-out', 'rejected'];

const VisitorsPage = () => {
  const [visitors, setVisitors]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchVisitors = async () => {
    try {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const res = await getVisitors(params);
      setVisitors(res.data.data.visitors);
    } catch { toast.error('Failed to load visitors'); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetchVisitors(); }, [statusFilter]);

  const handleSearch = async (val) => {
    setSearch(val);
    if (!val.trim()) { fetchVisitors(); return; }
    try {
      const res = await searchVisitors(val);
      setVisitors(res.data.data.visitors);
    } catch { toast.error('Search failed'); }
  };

  const handleCheckIn = async (id) => {
    try { await checkIn(id); toast.success('Visitor checked in'); fetchVisitors(); }
    catch (err) { toast.error(err.response?.data?.message || 'Check-in failed'); }
  };

  const handleCheckOut = async (id) => {
    try { await checkOut(id); toast.success('Visitor checked out'); fetchVisitors(); }
    catch (err) { toast.error(err.response?.data?.message || 'Check-out failed'); }
  };

  if (loading) return <div className="flex items-center justify-center h-full"><Spinner size="lg" /></div>;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-zinc-100">Visitors</h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm mt-0.5">
          {visitors.length} visitors · manage check-ins and check-outs
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search name or phone..."
            className="pl-8 pr-8 py-2 text-sm border border-slate-200 dark:border-zinc-600 rounded-xl
              bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 placeholder-slate-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-60"
          />
          {search && (
            <button onClick={() => handleSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                statusFilter === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
              }`}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Card Grid ── */}
      {visitors.length === 0 ? (
        <div className="text-center py-16 text-slate-400 dark:text-zinc-600">
          <User size={40} className="mx-auto mb-2 opacity-30" />
          <p>No visitors found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {visitors.map(v => (
            <div
              key={v._id}
              className={`bg-white dark:bg-zinc-800 rounded-2xl border shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow
                ${v.is_blacklisted
                  ? 'border-red-200 dark:border-red-900/40'
                  : 'border-slate-100 dark:border-zinc-700'
                }`}
            >
              {/* Top: avatar + name + status */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {v.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-zinc-100 truncate">{v.name}</p>
                    {v.is_blacklisted && (
                      <span className="text-xs text-red-500 font-medium">⚠ Blacklisted</span>
                    )}
                  </div>
                </div>
                <StatusBadge status={v.status} />
              </div>

              {/* Details */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400">
                  <Phone size={13} className="flex-shrink-0" />
                  <span>{v.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400">
                  <Briefcase size={13} className="flex-shrink-0" />
                  <span className="truncate">{v.purpose}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400">
                  <User size={13} className="flex-shrink-0" />
                  <span className="truncate">Host: {v.host_id?.name || '—'}</span>
                </div>
                {v.entry_time && (
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <Clock size={13} className="flex-shrink-0" />
                    <span>In: {formatTime(v.entry_time)}</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="pt-1 border-t border-slate-100 dark:border-zinc-700">
                {(v.status === 'pending' || v.status === 'approved') && (
                  <button
                    onClick={() => handleCheckIn(v._id)}
                    className="flex items-center justify-center gap-2 w-full py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    <LogIn size={15} /> Check In
                  </button>
                )}
                {v.status === 'checked-in' && (
                  <button
                    onClick={() => handleCheckOut(v._id)}
                    className="flex items-center justify-center gap-2 w-full py-2 bg-zinc-600 hover:bg-zinc-700 text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    <LogOut size={15} /> Check Out
                  </button>
                )}
                {(v.status === 'checked-out' || v.status === 'rejected') && (
                  <p className="text-center text-xs text-slate-400 dark:text-zinc-500 py-1">
                    {v.status === 'checked-out' ? `Left: ${formatDate(v.exit_time)}` : 'Visit rejected'}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VisitorsPage;
