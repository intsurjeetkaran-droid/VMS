import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Building2, Eye, EyeOff, LogIn, Sun, Moon, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const roleRedirect = {
  admin: '/admin/dashboard',
  receptionist: '/reception/dashboard',
  employee: '/employee/dashboard',
};

const Login = () => {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form);
      const destination = roleRedirect[user.role] || '/';
      // Navigate first so AppLayout's Toaster is mounted, then show toast
      navigate(destination);
      setTimeout(() => {
        toast.success(`Welcome back, ${user.name}! 👋`, { duration: 5000 });
      }, 100);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  /* ── Light mode: soft blue-indigo gradient
     ── Dark mode:  deep zinc-blue gradient   */
  const bgClass = theme === 'dark'
    ? 'bg-gradient-to-br from-zinc-950 via-blue-950 to-zinc-950'
    : 'bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100';

  const inputCls = `w-full px-4 py-2.5 border rounded-xl text-sm transition
    bg-white dark:bg-zinc-700
    border-slate-200 dark:border-zinc-600
    text-slate-800 dark:text-zinc-100
    placeholder-slate-400 dark:placeholder-zinc-500
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`;

  return (
    <div className={`min-h-screen ${bgClass} flex items-center justify-center p-4 transition-colors duration-300`}>

      {/* ── Top bar: back link + theme toggle ── */}
      <div className="fixed top-0 left-0 right-0 flex items-center justify-between px-4 py-3 z-10">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm font-medium
            text-slate-600 hover:text-blue-600
            dark:text-zinc-400 dark:hover:text-blue-400
            transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors
            bg-white/60 hover:bg-white/90 text-slate-600
            dark:bg-zinc-800/60 dark:hover:bg-zinc-700 dark:text-zinc-300"
        >
          {theme === 'dark'
            ? <Sun size={17} className="text-yellow-400" />
            : <Moon size={17} />
          }
        </button>
      </div>

      <div className="w-full max-w-md">
        {/* ── Logo / header ── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-600/30">
            <Building2 size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">VMS</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-sm">Visitor Management System</p>
        </div>

        {/* ── Card ── */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 sm:p-8
          border border-slate-200 dark:border-zinc-700">

          <h2 className="text-xl font-semibold text-slate-800 dark:text-zinc-100 mb-6">
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com"
                className={inputCls}
              />
            </div>

            {/* Password + show/hide */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className={`${inputCls} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                    text-slate-400 hover:text-slate-600
                    dark:text-zinc-500 dark:hover:text-zinc-200
                    transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2
                bg-blue-600 hover:bg-blue-700 disabled:opacity-60
                text-white font-semibold py-2.5 rounded-xl transition-colors"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><LogIn size={18} /> Sign In</>
              )}
            </button>
          </form>
        </div>

        {/* ── Footer note ── */}
        <p className="text-center text-slate-500 dark:text-zinc-500 text-sm mt-6">
          Contact your administrator to get access
        </p>
      </div>
    </div>
  );
};

export default Login;
