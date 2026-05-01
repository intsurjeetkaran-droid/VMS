import { useNavigate } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-900">
      <div className="text-center px-4">
        <ShieldOff size={48} className="mx-auto text-red-400 mb-4" />
        <h1 className="text-2xl font-bold text-slate-800 dark:text-zinc-100">Access Denied</h1>
        <p className="text-slate-500 dark:text-zinc-400 mt-2">You don't have permission to view this page.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
