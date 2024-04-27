import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const { pathname } = useLocation();

  return (
    <header className="flex items-center justify-center gap-10 p-2 bg-sky-900 text-3xl">
      <Link to="/" className={`text-white ${pathname === '/' ? 'font-bold ' : 'opacity-50'}`}>
        Home
      </Link>
      <Link to="/report" className={`text-white ${pathname === '/report' ? 'font-bold ' : 'opacity-50'}`}>
        Report
      </Link>
    </header>
  );
};

export default Header;
