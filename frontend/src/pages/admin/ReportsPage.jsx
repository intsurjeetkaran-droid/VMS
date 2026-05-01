/**
 * Admin Reports Page — dark mode + responsive
 */
import { useState, useEffect } from 'react';
import { getDailyReport, getRecentLogs } from '../../services/reportService';
import Spinner from '../../components/ui/Spinner';
import { formatDate } from '../../utils/formatDate';
import { BarChart2, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

const ReportsPage = () => {
  const [chartData, setChartData] = useState([]);
  const [logs, setLogs] = useState([]);
  const [days, setDays] = useState(7);
  const [logsLimit, setLogsLimit] = useState(20);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  const fetchData = async (d = days, l = logsLimit) => {
    setLoading(true);
    try {
      const [cRes, lRes] = await Promise.all([getDailyReport(d), getRecentLogs(l)]);
      setChartData(cRes.data.data.report.map((r) => ({ date: r._id, visitors: r.count })));
      setLogs(lRes.data.data.logs);
    } catch {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const tooltipStyle = {
    contentStyle: {
      borderRadius: '12px',
      border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0',
      background: theme === 'dark' ? '#1e293b' : '#fff',
      color: theme === 'dark' ? '#f1f5f9' : '#1e293b',
      fontSize: '13px',
    },
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-zinc-100">Reports & Logs</h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm mt-0.5">Visitor analytics and activity audit trail</p>
        </div>
        <button
          onClick={() => fetchData()}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-zinc-600 rounded-xl text-sm text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-slate-100 dark:border-zinc-700 shadow-sm p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <h2 className="font-semibold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
            <BarChart2 size={18} className="text-blue-600" />
            Daily Visitor Trend
          </h2>
          <div className="flex gap-2">
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                onClick={() => { setDays(d); fetchData(d, logsLimit); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  days === d
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-600'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#f1f5f9'} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: theme === 'dark' ? '#94a3b8' : '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: theme === 'dark' ? '#94a3b8' : '#64748b' }} allowDecimals={false} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="visitors" stroke="#3b82f6" fill="url(#grad)" strokeWidth={2.5} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-slate-100 dark:border-zinc-700 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="font-semibold text-slate-800 dark:text-zinc-100">Activity Log</h2>
          <select
            value={logsLimit}
            onChange={(e) => { setLogsLimit(Number(e.target.value)); fetchData(days, Number(e.target.value)); }}
            className="text-sm border border-slate-200 dark:border-zinc-600 rounded-lg px-3 py-1.5 bg-white dark:bg-zinc-700 text-slate-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 self-start sm:self-auto"
          >
            {[20, 50, 100].map((n) => <option key={n} value={n}>Last {n}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-zinc-700">
            {logs.length === 0 ? (
              <p className="text-center py-10 text-slate-400 dark:text-zinc-600">No logs yet</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-4 sm:p-5">
                {logs.map((log, i) => (
                  <div key={i} className="bg-slate-50 dark:bg-zinc-700/40 rounded-xl p-4 flex flex-col gap-2 border border-slate-100 dark:border-zinc-700">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        log.type === 'checkin'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400'
                      }`}>
                        {log.type === 'checkin' ? '↓ Check In' : '↑ Check Out'}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-zinc-500">{formatDate(log.timestamp)}</span>
                    </div>
                    <p className="font-medium text-slate-800 dark:text-zinc-100 text-sm">{log.visitor_id?.name || '—'}</p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">{log.visitor_id?.phone || '—'}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-zinc-600">
                      <span className="text-xs text-slate-500 dark:text-zinc-400">by {log.performed_by?.name || '—'}</span>
                      <span className="text-xs capitalize text-slate-400 dark:text-zinc-500">{log.performed_by?.role || '—'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
