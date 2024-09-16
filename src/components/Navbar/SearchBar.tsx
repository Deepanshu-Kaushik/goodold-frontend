import { SearchOutlined } from '@ant-design/icons';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';
import { Link } from 'react-router-dom';
import { UserType } from '../../types/user-type';
import { toast } from 'react-toastify';

export default function SearchBar() {
  const { token } = localStorage;
  const [searchProfile, setSearchProfile] = useState('');
  const [foundUsers, setFoundUsers] = useState<UserType[]>([{}]);
  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchProfile('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchRef]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFoundUsers([{ _id: '0', firstName: 'Loading....' }]);
    setSearchProfile(value);
    fetchSearchResults(value);
  };

  const fetchSearchResults = useCallback(
    debounce(async (text) => {
      if (!text.trim()) return;
      try {
        const results = await fetch(`${import.meta.env.VITE_BACKEND_URL}/search-user`, {
          method: 'POST',
          body: JSON.stringify({ query: text.trim() }),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await results.json();
        if (data.length) setFoundUsers(data);
        else setFoundUsers([{ _id: '0', firstName: 'No user found!' }]);
      } catch (error) {
        toast.error(error as string);
        console.error('Error fetching search results:', error);
        setFoundUsers([{ _id: '0', firstName: 'Error fetching results' }]);
      }
    }, 1000),
    [],
  );

  return (
    <div className='relative z-50' ref={searchRef}>
      <div
        className='bg-application-grey dark:outline-dark-100 dark:bg-dark-600 dark:text-white p-0.5 md:p-2 rounded-xl flex items-center'
        title='Search for a profile'
      >
        <input
          className='bg-inherit outline-none ml-2 placeholder:text-sm dark:placeholder:text-white'
          type='text'
          placeholder='Search...'
          value={searchProfile}
          onChange={handleInputChange}
        />
        <SearchOutlined
          style={{
            paddingRight: '10px',
            cursor: 'pointer',
          }}
          className='dark:text-white'
        />
      </div>
      {searchProfile.trim() && (
        <div className='absolute flex flex-col bg-white w-full top-12 rounded-lg shadow-xl shadow-slate-400 dark:text-white border-slate-300 max-h-screen overflow-y-auto dark:shadow-slate-700 dark:bg-dark-500'>
          {foundUsers?.map((ele) =>
            ele?._id !== '0' ? (
              <Link
                to={'/profile/' + ele?._id}
                key={ele?._id}
                className='hover:bg-slate-200 dark:hover:bg-dark-400 p-4 py-2 gap-2 w-full flex items-center dark:font-semibold'
                onClick={() => setSearchProfile('')}
              >
                <img src={ele.userPicturePath} className='size-8 rounded-full object-cover' />
                <h1>
                  {ele.firstName} {ele.lastName}
                </h1>
              </Link>
            ) : (
              <span
                key={ele?._id}
                className='text-red-600 dark:text-red-500 tracking-widest dark:font-bold w-full text-center p-2'
              >
                {ele.firstName}
              </span>
            ),
          )}
        </div>
      )}
    </div>
  );
}
