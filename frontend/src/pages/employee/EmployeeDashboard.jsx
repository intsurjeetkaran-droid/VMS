/**
 * Employee Dashboard — dark mode + responsive
 */
import { useState, useEffect } from 'react';
import { getVisitors, updateStatus } from '../../services/visitorService';
import { getDashboardStats } from '../../services/reportService';
import StatusBadge from '../../components/ui/StatusBadge';
import StatCard from '../../components/ui/StatCard';
import Spinner from '../../components/ui/Spinner';
import { formatDate } from '../../utils/formatDate';
import { UserCheck, Clock, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const EmployeeDashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [vRes, sRes] = await Promise.all([getVisitors(), getDashboardStats()]);
      setVisitors(vRes.data.data.visitors);
      setStats(sRes.data.data.stats);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatus = async (id, status) => {
    try {
      await updateStatus(id, status);
      toast.success(`Visitor ${status}`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen dark:bg-zinc-900"><Spinner size="lg" /></div>;

  const pending = visitors.filter((v) => v.status === 'pending');
  const others  = visitors.filter((v) => v.status !== 'pending');

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-zinc-100">My Visitors</h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm mt-0.5">Approve or reject visitor requests</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total"            value={stats.total}      icon={UserCheck}  color="blue" />
        <StatCard label="Pending Approval" value={stats.pending}    icon={Clock}      color="yellow" />
        <StatCard label="Inside Now"       value={stats.checkedIn}  icon={CheckCircle} color="green" />
        <StatCard label="Rejected"         value={stats.rejected}   icon={XCircle}    color="red" />
      </div>

      {/* Pending approvals */}
      {pending.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4 sm:p-5">
          <h2 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-4 flex items-center gap-2">
            <Clock size={18} />
            Pending Approval ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map((v) => (
              <div key={v._id} className="bg-white dark:bg-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-yellow-100 dark:border-yellow-900/30">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-zinc-100">{v.name}</p>
                  <p className="text-sm text-slate-500 dark:text-zinc-400">{v.phone} · {v.purpose}</p>
                  <p className="text-xs text-slate-400 dark:text-zinc-500">{formatDate(v.createdAt)}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleStatus(v._id, 'approved')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    <CheckCircle size={15} /> Approve
                  </button>
                  <button
                    onClick={() => handleStatus(v._id, 'rejected')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 text-sm font-medium rounded-xl transition-colors"
                  >
                    <XCircle size={15} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-slate-100 dark:border-zinc-700 shadow-sm">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-zinc-700">
          <h2 className="font-semibold text-slate-800 dark:text-zinc-100">Visit History</h2>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-zinc-700">
          {others.length === 0 ? (
            <p className="text-center py-10 text-slate-400">No visit history yet</p>
          ) : (
            others.map((v) => (
              <div key={v._id} className="px-4 sm:px-5 py-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-slate-800 dark:text-zinc-100 truncate">{v.name}</p>
                  <p className="text-sm text-slate-500 dark:text-zinc-400 truncate">{v.purpose}</p>
                  <p className="text-xs text-slate-400 dark:text-zinc-500">{formatDate(v.createdAt)}</p>
                </div>
                <StatusBadge status={v.status} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
