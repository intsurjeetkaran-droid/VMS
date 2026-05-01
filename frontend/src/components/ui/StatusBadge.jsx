import { getStatusColor, statusLabel } from '../../utils/statusColors';

const StatusBadge = ({ status, size = 'sm' }) => {
  const colors = getStatusColor(status);
  const sizeClass = size === 'lg' ? 'px-3 py-1.5 text-sm' : 'px-2 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${colors.bg} ${colors.text} ${colors.border} ${sizeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {statusLabel[status] || status}
    </span>
  );
};

export default StatusBadge;
