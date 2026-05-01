import { useState, useEffect } from 'react';
import { getBlacklist, unblacklistVisitor, blacklistVisitor } from '../../services/securityService';
import { getVisitors } from '../../services/visitorService';
import Spinner from '../../components/ui/Spinner';
import { useConfirm } from '../../components/ui/ConfirmModal';
import { formatDateOnly } from '../../utils/formatDate';
import { ShieldOff, ShieldCheck, AlertTriangle, X, Phone, Briefcase, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const SecurityPage = () => {
  const [blacklist, setBlacklist]   = useState([]);
  const [visitors, setVisitors]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeTab, setActiveTab]   = useState('blacklist');
  const [reasonModal, setReasonModal] = useState(null);
  const [reason, setReason]         = useState('');
  const { confirm, ConfirmModal }   = useConfirm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bRes, vRes] = await Promise.all([getBlacklist(), getVisitors()]);
      setBlacklist(bRes.data.data.blacklist);
      setVisitors(vRes.data.data.visitors.filter(v => !v.is_blacklisted));
    } catch { toast.error('Failed to load security data'); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleUnblacklist = async (id, name) => {
    const ok = await confirm({
      title: `Remove ${name} from blacklist?`,
      message: 'This visitor will be allowed to check in again.',
      confirmLabel: 'Remove', danger: false,
    });
    if (!ok) return;
    try { await unblacklistVisitor(id); toast.success(`${name} removed from blacklist`); fetchData(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleBlacklist = async () => {
    if (!reason.trim()) { toast.error('Please provide a reason'); return; }
    try {
      await blacklistVisitor(reasonModal.id, reason);
      toast.success(`${reasonModal.name} has been blacklisted`);
      setReasonModal(null); setReason(''); fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (loading) return <div className="flex items-center justify-center h-full"><Spinner size="lg" /></div>;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <ConfirmModal />

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
          <ShieldOff size={22} className="text-red-500" /> Security
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm mt-0.5">Manage blacklisted visitors and access control</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 dark:border-zinc-700">
        {[
          { key: 'blacklist', label: `Blacklist (${blacklist.length})` },
          { key: 'visitors',  label: 'Blacklist a Visitor' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === t.key
                ? 'border-red-500 text-red-600 dark:text-red-400'
                : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Blacklist tab (cards) ── */}
      {activeTab === 'blacklist' && (
        blacklist.length === 0 ? (
          <div className="text-center py-16 text-slate-400 dark:text-zinc-600">
            <ShieldCheck size={40} className="mx-auto mb-2 text-green-400" />
            <p className="font-medium text-slate-600 dark:text-zinc-300">No blacklisted visitors</p>
            <p className="text-sm mt-1">The system is clean</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {blacklist.map(v => (
              <div key={v._id} className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
                    <p className="font-semibold text-slate-800 dark:text-zinc-100 truncate">{v.name}</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-zinc-300">
                    <Phone size={13} className="flex-shrink-0" />
                    <span>{v.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400">
                    <Briefcase size={13} className="flex-shrink-0" />
                    <span className="truncate">{v.purpose || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400">
                    <Calendar size={13} className="flex-shrink-0" />
                    <span>{formatDateOnly(v.createdAt)}</span>
                  </div>
                </div>
                {v.notes && (
                  <div className="bg-red-100/50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                    <p className="text-xs text-red-700 dark:text-red-400 font-medium">Reason:</p>
                    <p className="text-xs text-red-600 dark:text-red-300 mt-0.5">{v.notes}</p>
                  </div>
                )}
                <button
                  onClick={() => handleUnblacklist(v._id, v.name)}
                  className="flex items-center justify-center gap-1.5 w-full py-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 text-sm font-medium rounded-xl transition-colors"
                >
                  <ShieldCheck size={14} /> Remove from Blacklist
                </button>
              </div>
            ))}
          </div>
        )
      )}

      {/* ── Blacklist a visitor tab (cards) ── */}
      {activeTab === 'visitors' && (
        <>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-xl flex items-center gap-2 text-yellow-800 dark:text-yellow-300 text-sm">
            <AlertTriangle size={16} className="flex-shrink-0" />
            Blacklisting a visitor will block all future check-ins for their phone number.
          </div>
          {visitors.length === 0 ? (
            <div className="text-center py-16 text-slate-400 dark:text-zinc-600">
              <ShieldCheck size={40} className="mx-auto mb-2 opacity-30" />
              <p>No visitors available to blacklist</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {visitors.map(v => (
                <div key={v._id} className="bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {v.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-zinc-100 truncate">{v.name}</p>
                    </div>
                  </div>
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
                      <Calendar size={13} className="flex-shrink-0" />
                      <span>{formatDateOnly(v.createdAt)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setReasonModal({ id: v._id, name: v.name })}
                    className="flex items-center justify-center gap-1.5 w-full py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 text-sm font-medium rounded-xl transition-colors mt-1"
                  >
                    <ShieldOff size={14} /> Blacklist Visitor
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
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

export default SecurityPage;
