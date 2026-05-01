import { useState, useEffect } from 'react';
import { getAppointments, createAppointment, deleteAppointment } from '../../services/appointmentService';
import { getEmployees } from '../../services/userService';
import Spinner from '../../components/ui/Spinner';
import { useConfirm } from '../../components/ui/ConfirmModal';
import { formatDate } from '../../utils/formatDate';
import { Calendar, Plus, Trash2, X, Phone, Briefcase, User, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_STYLE = {
  pending:   { cls: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300', dot: 'bg-yellow-400' },
  approved:  { cls: 'bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-300',   dot: 'bg-blue-500'   },
  rejected:  { cls: 'bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400',     dot: 'bg-red-500'    },
  completed: { cls: 'bg-zinc-100   text-zinc-600   dark:bg-zinc-700      dark:text-zinc-400',    dot: 'bg-zinc-400'   },
};

const INIT = {
  visitor_name: '', visitor_phone: '', visitor_email: '',
  purpose: '', host_id: '', scheduled_time: '', notes: '',
};

const inputCls = `w-full px-3 py-2 text-sm rounded-xl border
  border-slate-200 dark:border-zinc-600
  bg-white dark:bg-zinc-700
  text-slate-800 dark:text-zinc-100
  placeholder-slate-400 dark:placeholder-zinc-500
  focus:outline-none focus:ring-2 focus:ring-blue-500`;

const labelCls = 'block text-xs font-medium text-slate-600 dark:text-zinc-400 mb-1';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [employees, setEmployees]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [showModal, setShowModal]       = useState(false);
  const [form, setForm]                 = useState(INIT);
  const [submitting, setSubmitting]     = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const { confirm, ConfirmModal }       = useConfirm();

  const fetchData = async () => {
    try {
      const [aRes, eRes] = await Promise.all([getAppointments(), getEmployees()]);
      setAppointments(aRes.data.data.appointments);
      setEmployees(eRes.data.data.employees);
    } catch { toast.error('Failed to load appointments'); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createAppointment(form);
      toast.success('Appointment created');
      setShowModal(false); setForm(INIT); fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create appointment'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: 'Delete appointment?',
      message: 'This action cannot be undone.',
      confirmLabel: 'Delete', danger: true,
    });
    if (!ok) return;
    try { await deleteAppointment(id); toast.success('Appointment deleted'); fetchData(); }
    catch { toast.error('Failed to delete'); }
  };

  const filtered = statusFilter === 'all'
    ? appointments
    : appointments.filter(a => a.status === statusFilter);

  if (loading) return <div className="flex items-center justify-center h-full"><Spinner size="lg" /></div>;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <ConfirmModal />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
            <Calendar size={22} className="text-blue-600" /> Appointments
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm mt-0.5">
            {appointments.length} total appointments
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors self-start sm:self-auto shadow-sm"
        >
          <Plus size={16} /> New Appointment
        </button>
      </div>

      {/* Status filter pills */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'approved', 'rejected', 'completed'].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
              statusFilter === s
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
            }`}
          >
            {s === 'all' ? `All (${appointments.length})` : `${s} (${appointments.filter(a => a.status === s).length})`}
          </button>
        ))}
      </div>

      {/* ── Card Grid ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400 dark:text-zinc-600">
          <Calendar size={40} className="mx-auto mb-2 opacity-30" />
          <p>No appointments found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(a => {
            const ss = STATUS_STYLE[a.status] || STATUS_STYLE.pending;
            return (
              <div
                key={a._id}
                className="bg-white dark:bg-zinc-800 rounded-2xl border border-slate-100 dark:border-zinc-700 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
              >
                {/* Top: avatar + name + status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {a.visitor_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-zinc-100 truncate">{a.visitor_name}</p>
                    </div>
                  </div>
                  {/* Status badge */}
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${ss.cls}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${ss.dot}`} />
                    {a.status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400">
                    <Phone size={13} className="flex-shrink-0" />
                    <span>{a.visitor_phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400">
                    <Briefcase size={13} className="flex-shrink-0" />
                    <span className="truncate">{a.purpose}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400">
                    <User size={13} className="flex-shrink-0" />
                    <span className="truncate">Host: {a.host_id?.name || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                    <Clock size={13} className="flex-shrink-0" />
                    <span>{formatDate(a.scheduled_time)}</span>
                  </div>
                </div>

                {/* Notes */}
                {a.notes && (
                  <div className="bg-slate-50 dark:bg-zinc-700/50 rounded-lg px-3 py-2">
                    <p className="text-xs text-slate-500 dark:text-zinc-400 italic">"{a.notes}"</p>
                  </div>
                )}

                {/* Footer: delete */}
                <div className="flex items-center justify-end pt-1 border-t border-slate-100 dark:border-zinc-700">
                  <button
                    onClick={() => handleDelete(a._id)}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Create Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-100 dark:border-zinc-700">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-zinc-700 sticky top-0 bg-white dark:bg-zinc-800 z-10">
              <h3 className="font-semibold text-slate-800 dark:text-zinc-100">New Appointment</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 p-1 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Visitor Name *</label>
                  <input type="text" required value={form.visitor_name} onChange={e => setForm({...form, visitor_name: e.target.value})} placeholder="John Doe" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Phone *</label>
                  <input type="text" required value={form.visitor_phone} onChange={e => setForm({...form, visitor_phone: e.target.value})} placeholder="+91 98765 43210" className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Email</label>
                  <input type="email" value={form.visitor_email} onChange={e => setForm({...form, visitor_email: e.target.value})} placeholder="visitor@email.com" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Purpose *</label>
                  <input type="text" required value={form.purpose} onChange={e => setForm({...form, purpose: e.target.value})} placeholder="Meeting, Interview..." className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Host Employee *</label>
                <select required value={form.host_id} onChange={e => setForm({...form, host_id: e.target.value})} className={inputCls}>
                  <option value="">Select employee...</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp._id}>{emp.name}{emp.department ? ` (${emp.department})` : ''}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Scheduled Date & Time *</label>
                <input type="datetime-local" required value={form.scheduled_time} onChange={e => setForm({...form, scheduled_time: e.target.value})} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Notes</label>
                <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Additional notes..." rows={2} className={`${inputCls} resize-none`} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-slate-200 dark:border-zinc-600 rounded-xl text-sm font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors">
                  {submitting ? 'Creating...' : 'Create Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;
