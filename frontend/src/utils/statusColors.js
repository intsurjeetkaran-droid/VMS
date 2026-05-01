/**
 * Status → Tailwind color class mappings
 * Full dark mode support for all statuses
 * Used across visitor cards, badges, and the live board
 */
export const statusColors = {
  pending: {
    bg:     'bg-yellow-100 dark:bg-yellow-900/30',
    text:   'text-yellow-800 dark:text-yellow-300',
    dot:    'bg-yellow-400 dark:bg-yellow-400',
    border: 'border-yellow-300 dark:border-yellow-700',
  },
  approved: {
    bg:     'bg-blue-100 dark:bg-blue-900/30',
    text:   'text-blue-800 dark:text-blue-300',
    dot:    'bg-blue-500 dark:bg-blue-400',
    border: 'border-blue-300 dark:border-blue-700',
  },
  'checked-in': {
    bg:     'bg-green-100 dark:bg-green-900/30',
    text:   'text-green-800 dark:text-green-300',
    dot:    'bg-green-500 dark:bg-green-400',
    border: 'border-green-300 dark:border-green-700',
  },
  'checked-out': {
    bg:     'bg-zinc-100 dark:bg-zinc-700/50',
    text:   'text-zinc-600 dark:text-zinc-400',
    dot:    'bg-zinc-400 dark:bg-zinc-500',
    border: 'border-zinc-300 dark:border-zinc-600',
  },
  rejected: {
    bg:     'bg-red-100 dark:bg-red-900/30',
    text:   'text-red-800 dark:text-red-300',
    dot:    'bg-red-500 dark:bg-red-400',
    border: 'border-red-300 dark:border-red-700',
  },
};

export const getStatusColor = (status) =>
  statusColors[status] || statusColors.pending;

export const statusLabel = {
  pending:       'Waiting',
  approved:      'Approved',
  'checked-in':  'Checked In',
  'checked-out': 'Completed',
  rejected:      'Rejected',
};
