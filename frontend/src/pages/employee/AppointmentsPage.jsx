/**
 * Employee Appointments Page — dark mode + responsive
 */
import { useState, useEffect } from 'react';
import { getAppointments, updateAppointmentStatus } from '../../services/appointmentService';
import Spinner from '../../components/ui/Spinner';
import { formatDate } from '../../utils/formatDate';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending:   'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
  approved:  'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  rejected:  'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
  completed: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-zinc-700 dark:text-zinc-400 dark:border-zinc-600',
};

const EmployeeAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await getAppointments();
      setAppointments(res.data.data.appointments);
    } catch {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatus = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      toast.success(`Appointment ${status}`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen dark:bg-zinc-900"><Spinner size="lg" /></div>;

  const pending = appointments.filter((a) => a.status === 'pending');
  const others  = appointments.filter((a) => a.status !== 'pending');

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
          <Calendar size={22} className="text-blue-600" /> My Appointments
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm mt-0.5">Review and respond to appointment requests</p>
      </div>

      {pending.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4 sm:p-5">
          <h2 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-4 flex items-center gap-2">
            <Calendar size={16} /> Pending Requests ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map((a) => (
              <div key={a._id} className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-yellow-100 dark:border-yellow-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-zinc-100">{a.visitor_name}</p>
                  <p className="text-sm text-slate-500 dark:text-zinc-400">{a.visitor_phone} · {a.purpose}</p>
                  <p className="text-xs text-slate-400 dark:text-zinc-500">Scheduled: {formatDate(a.scheduled_time)}</p>
                  {a.notes && <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">Note: {a.notes}</p>}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleStatus(a._id, 'approved')} className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-colors">
                    <CheckCircle size={15} /> Approve
                  </button>
                  <button onClick={() => handleStatus(a._id, 'rejected')} className="flex items-center gap-1.5 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 text-sm font-medium rounded-xl transition-colors">
                    <XCircle size={15} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-slate-100 dark:border-zinc-700 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-zinc-700">
          <h2 className="font-semibold text-slate-800 dark:text-zinc-100">Appointment History</h2>
        </div>
        {others.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Calendar size={36} className="mx-auto mb-2 opacity-30" />
            <p>No appointment history</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-zinc-700">
            {others.map((a) => (
              <div key={a._id} className="px-4 sm:px-5 py-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-slate-800 dark:text-zinc-100 truncate">{a.visitor_name}</p>
                  <p className="text-sm text-slate-500 dark:text-zinc-400 truncate">{a.purpose} · {formatDate(a.scheduled_time)}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize border flex-shrink-0 ${STATUS_COLORS[a.status]}`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeAppointmentsPage;
