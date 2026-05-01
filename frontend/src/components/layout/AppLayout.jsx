import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useTheme } from '../../context/ThemeContext';

const AppLayout = () => {
  const { theme } = useTheme();

  return (
    /* Full viewport height, no overflow on the outer wrapper */
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-zinc-900">

      {/* Sidebar — fixed height, never scrolls */}
      <Sidebar />

      {/* Main content — only this area scrolls */}
      <main className="flex-1 overflow-y-auto min-w-0">
        {/* Mobile spacer so content clears the hamburger button */}
        <div className="h-14 lg:hidden" />
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
