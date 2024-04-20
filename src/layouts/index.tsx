import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const MainLayout = () => {
  return (
    <div className="text-black flex flex-col h-screen">
      <Header />
      {/* <h1>Yes</h1> */}

      <Outlet />
    </div>
  );
};

export default MainLayout;
