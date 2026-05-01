/**
 * StatCard — consistent color palette, full dark mode
 * Light: soft tinted backgrounds
 * Dark: zinc-based with colored tint overlays
 */
const colorMap = {
  blue: {
    wrap: 'bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/50',
    text: 'text-blue-600 dark:text-blue-400',
    icon: 'bg-blue-100/80 dark:bg-blue-900/40',
  },
  green: {
    wrap: 'bg-green-50 dark:bg-green-950/40 border-green-100 dark:border-green-900/50',
    text: 'text-green-600 dark:text-green-400',
    icon: 'bg-green-100/80 dark:bg-green-900/40',
  },
  yellow: {
    wrap: 'bg-yellow-50 dark:bg-yellow-950/40 border-yellow-100 dark:border-yellow-900/50',
    text: 'text-yellow-600 dark:text-yellow-400',
    icon: 'bg-yellow-100/80 dark:bg-yellow-900/40',
  },
  gray: {
    wrap: 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-100 dark:border-zinc-700',
    text: 'text-zinc-500 dark:text-zinc-400',
    icon: 'bg-zinc-100/80 dark:bg-zinc-700/60',
  },
  red: {
    wrap: 'bg-red-50 dark:bg-red-950/40 border-red-100 dark:border-red-900/50',
    text: 'text-red-600 dark:text-red-400',
    icon: 'bg-red-100/80 dark:bg-red-900/40',
  },
};

const StatCard = ({ label, value, icon: Icon, color = 'blue', trend }) => {
  const c = colorMap[color] || colorMap.blue;
  return (
    <div className={`rounded-2xl border p-4 sm:p-5 flex items-center gap-3 sm:gap-4 ${c.wrap} ${c.text}`}>
      {Icon && (
        <div className={`p-2.5 sm:p-3 rounded-xl flex-shrink-0 ${c.icon}`}>
          <Icon size={20} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs sm:text-sm font-medium opacity-70 truncate">{label}</p>
        <p className="text-2xl sm:text-3xl font-bold mt-0.5">{value ?? '—'}</p>
        {trend && <p className="text-xs mt-1 opacity-60">{trend}</p>}
      </div>
    </div>
  );
};

export default StatCard;
