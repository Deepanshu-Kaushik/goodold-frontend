import { MoonFilled, SunFilled } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import { useUserIdContext } from '../../contexts/UserIdContext';
import { useConversationsContext } from '../../contexts/ConversationsContext';
import { useNotificationsContext } from '../../contexts/NotificationContext';
import { useEffect } from 'react';
import { useThemeContext } from '../../contexts/ThemeContext';
import { IoNotifications } from 'react-icons/io5';
import { RiMessage2Fill } from 'react-icons/ri';
import { FaPowerOff } from 'react-icons/fa';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUserId } = useUserIdContext();
  const { unreadCountTotal } = useConversationsContext();
  const { unreadNotificationsCount, setLocation } = useNotificationsContext();
  const { darkTheme, setDarkTheme } = useThemeContext();
  useEffect(() => {
    setLocation(location);
  }, [location, setLocation]);
  let isNotAuthenticated = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className='flex-col md:flex-row flex gap-4 md:gap-8 justify-around items-center p-3 md:p-5 bg-white select-none w-full sticky top-0 shadow-md z-50 dark:bg-lord-300 dark:shadow-gray-700'>
      <div
        className={`flex flex-col md:flex-row gap-2 md:gap-8 md:w-[50%] items-center ${
          !isNotAuthenticated ? 'justify-start' : 'justify-center flex-1'
        }`}
      >
        <Link
          to='/'
          className='text-sky-800 hover:text-sky-500 text-2xl md:text-3xl font-bold dark:text-cyan-700 dark:hover:text-cyan-600'
        >
          Goodold
        </Link>
        {!isNotAuthenticated && <SearchBar />}
      </div>
      <div className='flex justify-between gap-4 md:gap-10 items-center'>
        <div className='flex justify-around gap-8 items-center'>
          {darkTheme ? (
            <SunFilled
              style={{ cursor: 'pointer' }}
              title='Light mode'
              className='text-white text-2xl hover:text-dark-100'
              onClick={() => setDarkTheme((prev) => !prev)}
            />
          ) : (
            <MoonFilled
              style={{ cursor: 'pointer' }}
              title='Dark mode'
              className='text-2xl hover:text-gray-600'
              onClick={() => setDarkTheme((prev) => !prev)}
            />
          )}
          {!isNotAuthenticated && (
            <Link to='/chat' className='flex items-center justify-center rounded-full relative size-6' title='Chat'>
              {unreadCountTotal > 0 ? (
                <div className='bg-red-500 size-full font-semibold text-xs rounded-full text-white flex justify-center items-center'>
                  {unreadCountTotal}
                </div>
              ) : (
                <RiMessage2Fill
                  style={{ cursor: 'pointer' }}
                  className='text-5xl dark:text-white hover:text-dark-100 dark:hover:text-gray-400'
                  title='Chat room'
                />
              )}
            </Link>
          )}
          {!isNotAuthenticated && (
            <Link
              to='/notifications'
              className='flex items-center justify-center rounded-full relative size-6'
              title='Chat'
            >
              {unreadNotificationsCount > 0 ? (
                <div className='bg-red-500 size-full font-semibold text-xs rounded-full text-white flex justify-center items-center'>
                  {unreadNotificationsCount}
                </div>
              ) : (
                <IoNotifications
                  className='text-5xl dark:text-white hover:text-dark-100 dark:hover:text-gray-400'
                  style={{ cursor: 'pointer' }}
                  title='Notifications'
                />
              )}
            </Link>
          )}
        </div>
        {!isNotAuthenticated && (
          <FaPowerOff
            className='text-white absolute right-4 rounded-md size-8 p-1 bg-red-600 cursor-pointer'
            title='Logout'
            onClick={() => {
              localStorage.clear();
              setUserId(null);
              navigate('/login');
            }}
          />
        )}
      </div>
    </div>
  );
}
