export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export const formatTime = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit',
  });
};

export const formatDateOnly = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};
