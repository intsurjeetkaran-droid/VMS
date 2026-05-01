import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors
        text-slate-500 hover:text-slate-700 hover:bg-slate-100
        dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800
        ${className}`}
    >
      {theme === 'dark'
        ? <Sun size={17} className="text-yellow-500" />
        : <Moon size={17} />
      }
    </button>
  );
};

export default ThemeToggle;
