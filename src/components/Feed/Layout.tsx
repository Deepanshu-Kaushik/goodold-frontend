import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';

const Layout = () => {
  return (
    <div className='h-dvh flex flex-col overflow-y-auto bg-application-grey dark:bg-dark-600'>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
