/**
 * Admin Dashboard — dark mode + responsive
 */
import { useState, useEffect } from 'react';
import { getDashboardStats, getDailyReport, getRecentLogs } from '../../services/reportService';
import StatCard from '../../components/ui/StatCard';
import Spinner from '../../components/ui/Spinner';
import { formatDate } from '../../utils/formatDate';
import { Users, UserCheck, Clock, CheckCircle, XCircle, BarChart2 } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [sRes, cRes, lRes] = await Promise.all([
          getDashboardStats(),
          getDailyReport(7),
          getRecentLogs(10),
        ]);
        setStats(sRes.data.data.stats);
        setChartData(cRes.data.data.report.map((r) => ({ date: r._id, visitors: r.count })));
        setLogs(lRes.data.data.logs);
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const tooltipStyle = {
    contentStyle: {
      borderRadius: '12px',
      border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
      background: theme === 'dark' ? '#1e293b' : '#fff',
      color: theme === 'dark' ? '#f1f5f9' : '#1e293b',
      fontSize: '13px',
    },
  };

  if (loading) return <div className="flex items-center justify-center h-screen dark:bg-zinc-900"><Spinner size="lg" /></div>;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-zinc-100">Admin Dashboard</h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm mt-0.5">System-wide overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard label="Total Visitors" value={stats.total}     icon={Users}        color="blue" />
        <StatCard label="Inside Now"     value={stats.checkedIn} icon={UserCheck}     color="green" />
        <StatCard label="Waiting"        value={stats.pending}   icon={Clock}         color="yellow" />
        <StatCard label="Completed"      value={stats.checkedOut} icon={CheckCircle}  color="gray" />
        <StatCard label="Rejected"       value={stats.rejected}  icon={XCircle}       color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-800 rounded-2xl border border-slate-100 dark:border-zinc-700 shadow-sm p-5">
          <h2 className="font-semibold text-slate-800 dark:text-zinc-100 mb-4 flex items-center gap-2">
            <BarChart2 size={18} className="text-blue-600" />
            Visitors — Last 7 Days
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#f1f5f9'} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: theme === 'dark' ? '#94a3b8' : '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: theme === 'dark' ? '#94a3b8' : '#64748b' }} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="visitors" stroke="#3b82f6" fill="url(#colorVisitors)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent logs */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-slate-100 dark:border-zinc-700 shadow-sm">
          <div className="p-5 border-b border-slate-100 dark:border-zinc-700">
            <h2 className="font-semibold text-slate-800 dark:text-zinc-100">Recent Activity</h2>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-zinc-700 max-h-72 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-center py-8 text-slate-400 text-sm">No activity yet</p>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      log.type === 'checkin'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-zinc-700 dark:text-zinc-400'
                    }`}>
                      {log.type === 'checkin' ? '↓ Check In' : '↑ Check Out'}
                    </span>
                    <span className="text-sm font-medium text-slate-700 dark:text-zinc-200 truncate">{log.visitor_id?.name}</span>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">
                    by {log.performed_by?.name} · {formatDate(log.timestamp)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
