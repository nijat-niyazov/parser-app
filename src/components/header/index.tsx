import { cn } from '@/utils';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const { pathname } = useLocation();

  return (
    <header className="flex items-center justify-center gap-10  bg-sky-900 text-3xl py-1">
      <Link
        to="/"
        className={cn(`text-white p-2 opacity-50`, { 'font-bold bg-slate-200 rounded-lg opacity-100 text-gray-700': pathname === '/' })}
      >
        Home
      </Link>
      <Link
        to="/report"
        className={cn(`text-white p-2 opacity-50`, {
          'font-bold bg-slate-200 rounded-lg opacity-100 text-gray-700': pathname === '/report',
        })}
      >
        Report
      </Link>
    </header>
  );
};

export default Header;
