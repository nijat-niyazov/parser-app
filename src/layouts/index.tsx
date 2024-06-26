import Header from '@/components/header';
import { Toaster } from '@/components/ui/toaster';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="text-black flex flex-col h-screen">
      <Header />
      {/* <h1>Yes</h1> */}

      <main className="flex-1">
        <Outlet />
      </main>

      <Toaster />
    </div>
  );
};

export default MainLayout;
