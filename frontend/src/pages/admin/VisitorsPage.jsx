import { useState, useEffect } from 'react';
import { getVisitors, searchVisitors } from '../../services/visitorService';
import { blacklistVisitor } from '../../services/securityService';
import StatusBadge from '../../components/ui/StatusBadge';
import Spinner from '../../components/ui/Spinner';
import { formatDate } from '../../utils/formatDate';
import { Search, ShieldOff, X, Phone, User, Briefcase, Clock, LogIn, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const VisitorsPage = () => {
  const [visitors, setVisitors]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reasonModal, setReasonModal] = useState(null);
  const [reason, setReason]           = useState('');

  const fetchVisitors = async () => {
    try {
      const res = await getVisitors(statusFilter !== 'all' ? { status: statusFilter } : {});
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

  const handleBlacklist = async () => {
    if (!reason.trim()) { toast.error('Provide a reason'); return; }
    try {
      await blacklistVisitor(reasonModal.id, reason);
      toast.success(`${reasonModal.name} blacklisted`);
      setReasonModal(null); setReason(''); fetchVisitors();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const statuses = ['all', 'pending', 'approved', 'checked-in', 'checked-out', 'rejected'];

  if (loading) return <div className="flex items-center justify-center h-full"><Spinner size="lg" /></div>;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-zinc-100">All Visitors</h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm mt-0.5">{visitors.length} visitors found</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search name or phone..."
            className="pl-8 pr-8 py-2 text-sm border border-slate-200 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-60"
          />
          {search && <button onClick={() => handleSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={14} /></button>}
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map(s => (
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
                  ? 'border-red-200 dark:border-red-900/40 bg-red-50/30 dark:bg-red-900/5'
                  : 'border-slate-100 dark:border-zinc-700'
                }`}
            >
              {/* Top row: avatar + name + status */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {v.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-zinc-100 truncate">{v.name}</p>
                    {v.is_blacklisted && (
                      <span className="text-xs text-red-500 font-medium flex items-center gap-1">
                        <ShieldOff size={11} /> Blacklisted
                      </span>
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
              </div>

              {/* Times */}
              {(v.entry_time || v.exit_time) && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {v.entry_time && (
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg px-2.5 py-1.5">
                      <p className="text-[10px] text-green-600 dark:text-green-400 font-medium flex items-center gap-1"><LogIn size={10} /> Entry</p>
                      <p className="text-xs text-green-700 dark:text-green-300 font-medium mt-0.5">{formatDate(v.entry_time)}</p>
                    </div>
                  )}
                  {v.exit_time && (
                    <div className="bg-slate-50 dark:bg-zinc-700/50 rounded-lg px-2.5 py-1.5">
                      <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium flex items-center gap-1"><LogOut size={10} /> Exit</p>
                      <p className="text-xs text-slate-600 dark:text-zinc-300 font-medium mt-0.5">{formatDate(v.exit_time)}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Footer: date + blacklist action */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-zinc-700">
                <span className="text-xs text-slate-400 dark:text-zinc-500 flex items-center gap-1">
                  <Clock size={11} /> {formatDate(v.createdAt)}
                </span>
                {!v.is_blacklisted && (
                  <button
                    onClick={() => setReasonModal({ id: v._id, name: v.name })}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded-lg transition-colors"
                    title="Blacklist visitor"
                  >
                    <ShieldOff size={12} /> Blacklist
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reason Modal */}
      {reasonModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-100 dark:border-zinc-700">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-zinc-700">
              <h3 className="font-semibold text-slate-800 dark:text-zinc-100">Blacklist Visitor</h3>
              <button onClick={() => { setReasonModal(null); setReason(''); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 p-1"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                Reason for blacklisting <strong className="text-slate-700 dark:text-zinc-200">{reasonModal.name}</strong>
              </p>
              <textarea
                value={reason} onChange={e => setReason(e.target.value)}
                placeholder="e.g. Security threat, aggressive behavior..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-700 text-slate-800 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
              <div className="flex gap-3">
                <button onClick={() => { setReasonModal(null); setReason(''); }} className="flex-1 py-2.5 border border-slate-200 dark:border-zinc-600 rounded-xl text-sm font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors">Cancel</button>
                <button onClick={handleBlacklist} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors">Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorsPage;
