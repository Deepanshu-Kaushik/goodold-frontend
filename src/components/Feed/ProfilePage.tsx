import { useEffect, useState } from 'react';
import UserInfo from './UserInfo';
import FriendList from '../Friends/FriendList';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import CreatePost from './CreatePost';
import Feed from './Feed';
import { UserType } from '../../types/user-type';
import { PostType } from '../../types/post-type';
import { useFriendListContext } from '../../contexts/FriendListContext';
import { toast } from 'react-toastify';

const fetchData = async (
  url: string,
  setter:
    | React.Dispatch<React.SetStateAction<UserType>>
    | React.Dispatch<React.SetStateAction<UserType[]>>
    | React.Dispatch<React.SetStateAction<PostType[]>>,
  token: string,
  navigate: NavigateFunction,
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
      toast.error('You need to re-login');
      return navigate('/login');
    } else if (response.status === 404) {
      const { error } = await response.json();
      throw error;
    } else {
      throw new Error('Something went wrong!');
    }
  } catch (error) {
    toast.error(error as string);
    console.log(error);
  }
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserType>({});
  const [friendList, setProfileFriendList] = useState<UserType[]>([]);
  const { setFriendList } = useFriendListContext();
  const [feed, setFeed] = useState<PostType[]>([]);
  const { token, userId } = localStorage;
  const { profileId } = useParams();

  useEffect(() => {
    if (!token || !userId) {
      navigate('/login');
      return;
    }

    const getUserData = fetchData(
      `${import.meta.env.VITE_BACKEND_URL}/user/${profileId}`,
      setUserData,
      token,
      navigate,
    );
    const getFeed = fetchData(`${import.meta.env.VITE_BACKEND_URL}/posts/${profileId}`, setFeed, token, navigate);
    const getFriends = fetchData(
      `${import.meta.env.VITE_BACKEND_URL}/user/${profileId}/friends`,
      (data: any) => setProfileFriendList(data.formattedFriends),
      token,
      navigate,
    );

    Promise.all([getUserData, getFeed, getFriends]);
  }, [profileId]);

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
        <UserInfo userData={userData} setFriendList={setFriendList} numberOfFriends={friendList.length} />
        <FriendList friendList={friendList} setFriendList={setFriendList} />
      </div>
      <div className='flex flex-col flex-1 gap-4'>
        {userId === profileId && <CreatePost userData={userData} setFeed={setFeed} />}
        <Feed setFriendList={setFriendList} feed={feed} setFeed={setFeed} />
      </div>
    </div>
  );
}
