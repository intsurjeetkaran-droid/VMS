/**
 * Employee Visitors Page — dark mode + responsive
 */
import { useState, useEffect } from 'react';
import { getVisitors, updateStatus } from '../../services/visitorService';
import StatusBadge from '../../components/ui/StatusBadge';
import Spinner from '../../components/ui/Spinner';
import { formatDate } from '../../utils/formatDate';
import { CheckCircle, XCircle, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const EmployeeVisitorsPage = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchData = async () => {
    try {
      const res = await getVisitors();
      setVisitors(res.data.data.visitors);
    } catch {
      toast.error('Failed to load visitors');
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

  const filtered = filter === 'all' ? visitors : visitors.filter((v) => v.status === filter);

  if (loading) return <div className="flex items-center justify-center h-screen dark:bg-zinc-900"><Spinner size="lg" /></div>;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-zinc-100">My Visitors</h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm mt-0.5">All visitors assigned to you</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'approved', 'checked-in', 'checked-out', 'rejected'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
              filter === s
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-600'
            }`}
          >
            {s === 'all' ? 'All' : s}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-slate-100 dark:border-zinc-700 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Users size={40} className="mx-auto mb-2 opacity-30" />
            <p>No visitors found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-zinc-700">
            {filtered.map((v) => (
              <div key={v._id} className="px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-zinc-700/30 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {v.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-zinc-100 truncate">{v.name}</p>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 truncate">{v.phone} · {v.purpose}</p>
                    <p className="text-xs text-slate-400 dark:text-zinc-500">{formatDate(v.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusBadge status={v.status} />
                  {v.status === 'pending' && (
                    <>
                      <button onClick={() => handleStatus(v._id, 'approved')} className="flex items-center gap-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 text-xs font-medium rounded-lg transition-colors">
                        <CheckCircle size={13} /> Approve
                      </button>
                      <button onClick={() => handleStatus(v._id, 'rejected')} className="flex items-center gap-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 text-xs font-medium rounded-lg transition-colors">
                        <XCircle size={13} /> Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeVisitorsPage;
