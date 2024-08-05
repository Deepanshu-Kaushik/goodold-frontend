import { useEffect, useState } from 'react';
import UserInfo from './UserInfo';
import CreatePost from './CreatePost';
import FriendList from '../Friends/FriendList';
import Feed from './Feed';
import { useNavigate } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import { useUserIdContext } from '../../contexts/UserIdContext';
import { UserType } from '../../types/user-type';
import { PostType } from '../../types/post-type';

export default function HomePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserType>({});
  const [friendList, setFriendList] = useState<UserType[]>([]);
  const [feed, setFeed] = useState<PostType[]>([]);
  const { token, userId } = localStorage;
  const { setUserId } = useUserIdContext();
  
  const fetchData = async (
    url: string,
    setter:
      | React.Dispatch<React.SetStateAction<UserType>>
      | React.Dispatch<React.SetStateAction<UserType[]>>
      | React.Dispatch<React.SetStateAction<PostType[]>>,
  ) => {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setter(data);
      } else if (response.status === 403) {
        localStorage.clear();
        setUserId(null);
        return navigate('/login');
      } else {
        throw new Error('Something went wrong!');
      }
    } catch (error) {
      console.log(error);
      localStorage.clear();
      setUserId(null);
    }
  };

  useEffect(() => {
    if (!token || !userId) {
      navigate('/login');
      return;
    }

    const getUserData = fetchData(
      `${import.meta.env.VITE_BACKEND_URL}/user/${userId}`,
      setUserData,
    );
    const getFriendList = fetchData(
      `${import.meta.env.VITE_BACKEND_URL}/user/${userId}/friends`,
      setFriendList,
    );
    const getFeed = fetchData(
      `${import.meta.env.VITE_BACKEND_URL}/posts`,
      setFeed,
    );

    Promise.all([getUserData, getFriendList, getFeed]);
  }, [userId]);

  if (!userData || !friendList || !feed) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <LoadingOutlined className='text-5xl text-sky-600' />
      </div>
    );
  }

  return (
    <div className='w-[90%] m-auto flex lg:flex-row flex-col py-6 gap-10 h-full'>
      <div className='flex flex-col gap-4 lg:w-[30%]'>
        <UserInfo
          userData={userData}
          friendList={friendList}
          setFriendList={setFriendList}
        />
        <FriendList
          userId={userId}
          friendList={friendList}
          setFriendList={setFriendList}
        />
      </div>
      <div className='flex flex-col flex-1 gap-4'>
        <CreatePost userData={userData} setFeed={setFeed} />
        <Feed
          friendList={friendList}
          setFriendList={setFriendList}
          feed={feed}
          setFeed={setFeed}
          userId={userId}
        />
      </div>
    </div>
  );
}
