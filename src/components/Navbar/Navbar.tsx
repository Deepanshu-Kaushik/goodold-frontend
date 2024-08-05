import { BellTwoTone, MessageTwoTone, SunFilled } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import { useUserIdContext } from '../../contexts/UserIdContext';
import { useConversationsContext } from '../../contexts/ConversationsContext';

export default function Navbar() {
  const location = useLocation();
  const { setUserId } = useUserIdContext();
  const { unreadCountTotal } = useConversationsContext();
  let isNotAuthenticated = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className='flex-col md:flex-row flex gap-4 md:gap-8 justify-around items-center p-3 md:p-5 bg-white select-none w-full sticky top-0 shadow-md z-50'>
      <div
        className={`flex flex-col md:flex-row gap-2 md:gap-8 md:w-[50%] items-center ${
          !isNotAuthenticated ? 'justify-start' : 'justify-center'
        }`}
      >
        <Link to='/' className='text-sky-800 hover:text-sky-500 text-2xl md:text-3xl font-bold'>
          Goodold
        </Link>
        {!isNotAuthenticated && <SearchBar />}
      </div>
      {!isNotAuthenticated && (
        <div className='flex justify-evenly gap-4 md:gap-10 items-center'>
          <div className='actions flex justify-around gap-8 items-center'>
            <SunFilled
              style={{ cursor: 'not-allowed' }}
              className='text-lg md:text-2xl'
              disabled
              title='Thamm ja bete'
            />
            <Link to='/chat' className='flex items-center justify-center rounded-full relative size-6'>
              {unreadCountTotal > 0 ? (
                <div className='bg-red-500 size-full font-semibold text-xs rounded-full text-white flex justify-center items-center'>
                  {unreadCountTotal}
                </div>
              ) : (
                <MessageTwoTone style={{ cursor: 'pointer' }} className='text-lg md:text-2xl' />
              )}
            </Link>
            <BellTwoTone className='text-lg md:text-2xl' style={{ cursor: 'not-allowed' }} title='Thamm ja bete' />
          </div>
          <Link
            to='/login'
            className='bg-[#e34432] text-white rounded-md p-1 py-0.5 md:p-3 md:py-1 border border-black hover:shadow-lg hover:shadow-red-900'
            onClick={() => {
              localStorage.clear();
              setUserId(null);
            }}
          >
            Logout
          </Link>
        </div>
      )}
    </div>
  );
}
