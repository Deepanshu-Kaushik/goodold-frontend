import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = () => {
  return (
    <div className='h-dvh flex flex-col overflow-y-auto bg-application-grey dark:bg-dark-600'>
      <Navbar />
      <Outlet />
      <ToastContainer
        closeOnClick
        closeButton={false}
        newestOnTop
        pauseOnHover={false}
        autoClose={2000}
        theme='colored'
      />
    </div>
  );
};

export default Layout;
