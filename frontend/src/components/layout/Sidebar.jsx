import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';
import {
  LayoutDashboard, Users, UserCheck,
  BarChart2, LogOut, Building2, Calendar,
  ShieldOff, Menu, X,
} from 'lucide-react';

const navByRole = {
  admin: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/users',     label: 'Users',      icon: Users },
    { to: '/admin/visitors',  label: 'Visitors',   icon: UserCheck },
    { to: '/admin/reports',   label: 'Reports',    icon: BarChart2 },
    { to: '/admin/security',  label: 'Security',   icon: ShieldOff },
  ],
  receptionist: [
    { to: '/reception/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
    { to: '/reception/visitors',     label: 'Visitors',     icon: UserCheck },
    { to: '/reception/appointments', label: 'Appointments', icon: Calendar },
  ],
  employee: [
    { to: '/employee/dashboard',     label: 'Dashboard',    icon: LayoutDashboard },
    { to: '/employee/visitors',      label: 'My Visitors',  icon: UserCheck },
    { to: '/employee/appointments',  label: 'Appointments', icon: Calendar },
  ],
};

/* ── Shared class strings ── */
const sidebarBase = `
  flex flex-col h-full
  bg-white dark:bg-zinc-900
  border-r border-slate-200 dark:border-zinc-800
`;

const SidebarContent = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navItems = navByRole[user?.role] || [];

  return (
    <div className={sidebarBase}>

      {/* ── Logo ── */}
      <div className="px-5 py-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 size={18} className="text-white" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">VMS</span>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* ── User info ── */}
      <div className="px-4 py-4 border-b border-slate-200 dark:border-zinc-800 flex-shrink-0">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 dark:text-zinc-100 truncate leading-tight">
              {user?.name}
            </p>
            <span className="text-xs capitalize text-blue-600 dark:text-blue-400 font-medium">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* ── Nav links ── */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        <p className="px-3 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-600">
          Navigation
        </p>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-zinc-100'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* ── Logout ── */}
      <div className="px-3 py-3 border-t border-slate-200 dark:border-zinc-800 flex-shrink-0">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium
            text-slate-600 dark:text-zinc-400
            hover:bg-red-50 dark:hover:bg-red-900/20
            hover:text-red-600 dark:hover:text-red-400
            transition-colors"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </div>
  );
};

/* ── Sidebar wrapper — sticky on desktop, drawer on mobile ── */
const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 w-10 h-10
          bg-white dark:bg-zinc-800
          border border-slate-200 dark:border-zinc-700
          text-slate-700 dark:text-zinc-300
          rounded-xl flex items-center justify-center shadow-sm"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-64 z-50
          transform transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop sidebar — sticky, full height, never scrolls */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 flex-shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
