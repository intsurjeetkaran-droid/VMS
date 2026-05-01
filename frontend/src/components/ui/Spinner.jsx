const Spinner = ({ size = 'md' }) => {
  const sizeClass = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }[size];
  return (
    <div className={`${sizeClass} border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 rounded-full animate-spin`} />
  );
};

export const FullPageSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-900">
    <Spinner size="lg" />
  </div>
);

export default Spinner;
