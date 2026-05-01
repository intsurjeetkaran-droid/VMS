import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  Building2, Shield, Users, ClipboardList, BarChart2,
  CheckCircle, Bell, Calendar, Sun, Moon, Menu, X,
  ArrowRight, Star, Zap, Lock, Clock, TrendingUp,
  UserCheck, ChevronDown,
} from 'lucide-react';

// ── Data ──────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: UserCheck,
    title: 'Smart Check-in',
    desc: 'One-click check-in with live visitor board. No paperwork, no delays — just tap and go.',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: Shield,
    title: 'Security & Blacklist',
    desc: 'Block unwanted visitors by phone number. Instant alerts when a blacklisted person attempts entry.',
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-900/20',
  },
  {
    icon: Calendar,
    title: 'Appointment System',
    desc: 'Pre-book visits with scheduled time slots. Employees approve or reject before arrival.',
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    icon: BarChart2,
    title: 'Reports & Analytics',
    desc: 'Daily visitor trends, activity logs, and audit trails. Full visibility for management.',
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    icon: Bell,
    title: 'Real-time Notifications',
    desc: 'Instant toast alerts for every action — check-ins, approvals, rejections, and more.',
    color: 'text-yellow-500',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
  },
  {
    icon: Lock,
    title: 'Role-Based Access',
    desc: 'Admin, Receptionist, and Employee roles with strict permission boundaries.',
    color: 'text-slate-500',
    bg: 'bg-slate-50 dark:bg-zinc-700/40',
  },
];

const stats = [
  { value: '30+', label: 'Visitors Tracked', icon: Users },
  { value: '3',   label: 'Access Roles',     icon: Shield },
  { value: '100%', label: 'Paperless',       icon: CheckCircle },
  { value: '24/7', label: 'Audit Logs',      icon: Clock },
];

const roles = [
  {
    role: 'Admin',
    icon: Shield,
    color: 'from-purple-600 to-purple-800',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    perms: [
      'Full system control',
      'Manage all users & roles',
      'View reports & analytics',
      'Security & blacklist management',
      'System-wide visitor oversight',
    ],
  },
  {
    role: 'Receptionist',
    icon: ClipboardList,
    color: 'from-blue-600 to-blue-800',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    perms: [
      'Register new visitors',
      'One-click check-in / check-out',
      'Assign host employees',
      'Manage appointments',
      'Search visitors by name or phone',
    ],
  },
  {
    role: 'Employee',
    icon: Users,
    color: 'from-green-600 to-green-800',
    badge: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    perms: [
      'Approve or reject visitors',
      'View own visitor history',
      'Manage appointment requests',
      'Receive visit notifications',
      'Track visit timeline',
    ],
  },
];

const steps = [
  { step: '01', title: 'Visitor Arrives',    desc: 'Receptionist registers the visitor and assigns a host employee.',       icon: Users },
  { step: '02', title: 'Host Notified',      desc: 'The assigned employee gets a request to approve or reject the visit.',  icon: Bell },
  { step: '03', title: 'Check-in',           desc: 'Once approved, receptionist checks the visitor in with one click.',     icon: UserCheck },
  { step: '04', title: 'Visit Logged',       desc: 'Every action is logged with timestamp for full audit trail.',           icon: ClipboardList },
];

const testimonials = [
  {
    name: 'Rajesh Mehta',
    role: 'Facility Manager, TechCorp India',
    text: 'VMS completely replaced our paper register. Check-ins are 10x faster and we have full visibility of who is in the building at any time.',
    stars: 5,
  },
  {
    name: 'Sunita Sharma',
    role: 'HR Head, Infosys Ltd',
    text: 'The role-based access is exactly what we needed. Employees only see their own visitors, and the approval flow is seamless.',
    stars: 5,
  },
  {
    name: 'Vikram Nair',
    role: 'Security Officer, HDFC Bank',
    text: 'The blacklist feature alone is worth it. We can instantly block a visitor across all entry points just by their phone number.',
    stars: 5,
  },
];

const faqs = [
  {
    q: 'How does the check-in process work?',
    a: 'The receptionist registers the visitor, assigns a host employee, and the employee approves or rejects. Once approved, the receptionist checks the visitor in with a single click — no forms to fill again.',
  },
  {
    q: 'Can visitors pre-book appointments?',
    a: 'Yes. Receptionists can create appointments with a scheduled date and time. The host employee then approves or rejects the appointment before the visitor arrives.',
  },
  {
    q: 'What happens when a blacklisted visitor tries to check in?',
    a: 'The system blocks the check-in and shows an error. Blacklisting works by phone number, so it applies to all future visits from that number.',
  },
  {
    q: 'Is the system mobile-friendly?',
    a: 'Fully responsive. The sidebar collapses to a hamburger menu on mobile, and all tables and forms adapt to any screen size.',
  },
  {
    q: 'Can I switch between light and dark mode?',
    a: 'Yes. The theme toggle is in the sidebar header. Your preference is saved and persists across sessions.',
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 dark:border-zinc-700 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
      >
        <span className="font-medium text-slate-800 dark:text-zinc-100 pr-4">{q}</span>
        <ChevronDown
          size={18}
          className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-6 py-4 bg-slate-50 dark:bg-zinc-800/50 border-t border-slate-100 dark:border-zinc-700">
          <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
};

// -- Navbar --------------------------------------------------------------------

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#roles', label: 'Roles' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-sm border-b border-slate-100 dark:border-zinc-800'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 size={18} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-lg">VMS</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-slate-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {theme === 'dark' ? <Sun size={17} className="text-yellow-400" /> : <Moon size={17} />}
            </button>
            <Link
              to="/login"
              className="hidden sm:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              Sign In <ArrowRight size={14} />
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800 px-4 py-4 space-y-1">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            Sign In <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </nav>
  );
};

// -- Hero Section --------------------------------------------------------------

const Hero = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-zinc-950 dark:via-blue-950 dark:to-zinc-950 pt-16">
    {/* Animated background blobs � lighter in light mode */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-400/20 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-300/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
    </div>

    {/* Grid pattern overlay */}
    <div className="absolute inset-0 opacity-[0.03] dark:opacity-5" style={{
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)',
      backgroundSize: '50px 50px'
    }} />

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-600/20 border border-blue-300 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-medium px-4 py-2 rounded-full mb-8">
        <Zap size={12} className="text-yellow-500 dark:text-yellow-400" />
        Smart Visitor Management System
      </div>

      {/* Headline */}
      <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
        Manage Every Visitor
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-purple-400">
          Smarter & Faster
        </span>
      </h1>

      <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
        A real-time visitor tracking system with role-based access, one-click check-in,
        appointment scheduling, and complete audit logs � all in one place.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
        <Link
          to="/login"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-2xl transition-colors shadow-lg shadow-blue-600/30 text-sm"
        >
          Get Started Free <ArrowRight size={16} />
        </Link>
        <a
          href="#features"
          className="flex items-center gap-2 bg-slate-900/10 hover:bg-slate-900/15 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white font-medium px-8 py-3.5 rounded-2xl transition-colors border border-slate-300 dark:border-white/20 text-sm"
        >
          Explore Features
        </a>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
        {stats.map(({ value, label, icon: Icon }) => (
          <div key={label} className="bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 backdrop-blur-sm shadow-sm">
            <Icon size={20} className="text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Scroll indicator */}
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 animate-bounce">
      <span className="text-xs">Scroll</span>
      <ChevronDown size={16} />
    </div>
  </section>
);

// -- Features Section ----------------------------------------------------------

const Features = () => (
  <section id="features" className="py-20 sm:py-28 bg-white dark:bg-zinc-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-16">
        <span className="inline-block text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">Features</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Everything you need to manage visitors
        </h2>
        <p className="text-slate-500 dark:text-zinc-400 max-w-xl mx-auto">
          From check-in to check-out, every step is tracked, logged, and secured.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map(({ icon: Icon, title, desc, color, bg }) => (
          <div
            key={title}
            className="group p-6 rounded-2xl border border-slate-100 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4`}>
              <Icon size={22} className={color} />
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-zinc-100 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// -- How It Works Section ------------------------------------------------------

const HowItWorks = () => (
  <section id="how-it-works" className="py-20 sm:py-28 bg-slate-50 dark:bg-zinc-800/50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <span className="inline-block text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">Process</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          How it works
        </h2>
        <p className="text-slate-500 dark:text-zinc-400 max-w-xl mx-auto">
          A simple 4-step flow from visitor arrival to logged exit.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {/* Connector line � desktop only */}
        <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 dark:from-blue-900 dark:via-blue-600 dark:to-blue-900" />

        {steps.map(({ step, title, desc, icon: Icon }, i) => (
          <div key={step} className="relative flex flex-col items-center text-center">
            {/* Step circle */}
            <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col items-center justify-center shadow-lg shadow-blue-600/20 mb-5">
              <Icon size={24} className="text-white mb-0.5" />
              <span className="text-blue-200 text-xs font-bold">{step}</span>
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-zinc-100 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// -- Roles Section -------------------------------------------------------------

const Roles = () => (
  <section id="roles" className="py-20 sm:py-28 bg-white dark:bg-zinc-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <span className="inline-block text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">Access Control</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Built for every team member
        </h2>
        <p className="text-slate-500 dark:text-zinc-400 max-w-xl mx-auto">
          Three distinct roles, each with the exact permissions they need � nothing more, nothing less.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map(({ role, icon: Icon, color, badge, perms }) => (
          <div key={role} className="rounded-2xl border border-slate-100 dark:border-zinc-700 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Card header */}
            <div className={`bg-gradient-to-br ${color} p-6`}>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <Icon size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">{role}</h3>
              <span className={`inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-full ${badge}`}>
                {role} Access
              </span>
            </div>
            {/* Permissions */}
            <div className="bg-white dark:bg-zinc-800 p-6 space-y-3">
              {perms.map((p) => (
                <div key={p} className="flex items-start gap-2.5">
                  <CheckCircle size={15} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-600 dark:text-zinc-300">{p}</span>
                </div>
              ))}
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 mt-4 w-full py-2.5 bg-slate-50 dark:bg-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-600 text-slate-700 dark:text-zinc-200 text-sm font-medium rounded-xl transition-colors border border-slate-200 dark:border-zinc-600"
              >
                Login as {role} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// -- Testimonials Section ------------------------------------------------------

const Testimonials = () => (
  <section id="testimonials" className="py-20 sm:py-28 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-900 dark:to-zinc-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <span className="inline-block text-xs font-semibold text-blue-200 uppercase tracking-widest mb-3">Testimonials</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Trusted by facility teams
        </h2>
        <p className="text-blue-200 max-w-xl mx-auto">
          See what security and HR professionals say about VMS.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map(({ name, role, text, stars }) => (
          <div key={name} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors">
            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {Array.from({ length: stars }).map((_, i) => (
                <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-blue-100 text-sm leading-relaxed mb-5">"{text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{name}</p>
                <p className="text-blue-300 text-xs">{role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// -- FAQ Section ---------------------------------------------------------------

const FAQ = () => (
  <section id="faq" className="py-20 sm:py-28 bg-slate-50 dark:bg-zinc-800/50">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <span className="inline-block text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">FAQ</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Frequently asked questions
        </h2>
        <p className="text-slate-500 dark:text-zinc-400">
          Everything you need to know before getting started.
        </p>
      </div>
      <div className="space-y-3">
        {faqs.map((item) => (
          <FaqItem key={item.q} {...item} />
        ))}
      </div>
    </div>
  </section>
);

// -- CTA Section ---------------------------------------------------------------

const CTA = () => (
  <section className="py-20 sm:py-28 bg-white dark:bg-zinc-900">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-10 sm:p-16 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
            <Building2 size={32} className="text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to go paperless?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
            Start managing your visitors smarter today. No setup fees, no complexity.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-700 font-semibold px-8 py-3.5 rounded-2xl transition-colors shadow-lg text-sm"
            >
              Sign In Now <ArrowRight size={16} />
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-3.5 rounded-2xl transition-colors border border-white/30 text-sm"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// -- Footer --------------------------------------------------------------------

const Footer = () => (
  <footer className="bg-zinc-900 dark:bg-zinc-950 text-slate-400 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 size={18} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg">VMS</span>
          </div>
          <p className="text-sm leading-relaxed">
            A smart, real-time visitor tracking system with secure logging and modern UI.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {['#features', '#how-it-works', '#roles', '#testimonials', '#faq'].map((href) => (
              <li key={href}>
                <a href={href} className="hover:text-blue-400 transition-colors capitalize">
                  {href.replace('#', '').replace(/-/g, ' ')}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Developer */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Developer</h4>
          <p className="text-sm">Built by <span className="text-blue-400 font-medium">Surjeet Karan</span></p>
          <p className="text-sm mt-1">Full Stack Developer</p>
          <div className="mt-4 flex gap-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            >
              Sign In <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <p>� 2026 VMS � Visitor Management System. Built by <span className="text-blue-400">Surjeet Karan</span>.</p>
        <p className="text-zinc-600">All rights reserved.</p>
      </div>
    </div>
  </footer>
);

// -- Main Landing Page ---------------------------------------------------------

const Landing = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Roles />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
};

export default Landing;

