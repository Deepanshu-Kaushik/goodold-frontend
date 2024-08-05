import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const Layout = () => {
  return (
    <div className='h-dvh flex flex-col overflow-y-auto'>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
