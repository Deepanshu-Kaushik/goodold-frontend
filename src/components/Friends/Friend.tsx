import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LoadingOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons';
import { UserType } from '../../types/user-type';

type FriendType = {
  friendList: UserType[];
  userId: string | undefined;
  setFriendList: React.Dispatch<React.SetStateAction<UserType[]>>;
  data: UserType;
  isOnline?: boolean;
};

export default function Friend({
  friendList,
  userId: profileId,
  setFriendList,
  data,
  isOnline,
}: FriendType) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { token, userId } = localStorage;
  const friendsIds = friendList?.map((friend) => friend.userId) || [];

  async function handleAddRemoveFriend(friendId: string | undefined) {
    if (userId === friendId) return;
    if (!token || !userId) return navigate('/login');
    setLoading(true);
    let url;
    if (userId === profileId)
      url = `${import.meta.env.VITE_BACKEND_URL}/user/${userId}/${friendId}`;
    else url = `${import.meta.env.VITE_BACKEND_URL}/user/${friendId}/${userId}`;

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status >= 200 && response.status <= 210) {
        const data = await response.json();
        setFriendList(data);
      } else if (response.status === 403) {
        return navigate('/login');
      } else {
        throw new Error('Something went wrong!');
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <div className='flex items-center justify-between select-none'>
      <div className='flex gap-4 items-center'>
        <div className='relative'>
          <img
            src={data?.userPicturePath}
            className='size-12 rounded-full object-cover'
          />
          {isOnline && (
            <div className='absolute bottom-0 right-0 bg-green-500 size-4 rounded-full' />
          )}
        </div>
        <div className='flex-1'>
          <div className='font-medium text-slate-600'>
            {data?.firstName} {data?.lastName}
          </div>
          <div className='text-xs text-slate-600'>{data.location}</div>
        </div>
      </div>
      {!loading ? (
        <>
          {friendsIds.includes(userId === profileId ? data?.userId : userId) ? (
            <UserDeleteOutlined
              className='cursor-pointer mx-2 text-white bg-sky-800 hover:bg-sky-600 p-3 rounded-full'
              hidden={userId === data?.userId}
              onClick={(e) => {
                e.preventDefault();
                handleAddRemoveFriend(data?.userId);
              }}
            />
          ) : (
            <UserAddOutlined
              className='cursor-pointer mx-2 text-white bg-sky-800 hover:bg-sky-600 p-3 rounded-full'
              hidden={userId === data?.userId}
              onClick={(e) => {
                e.preventDefault();
                handleAddRemoveFriend(data?.userId);
              }}
            />
          )}
        </>
      ) : (
        <>
          <LoadingOutlined className='text-3xl text-sky-600 mx-3' />
        </>
      )}
    </div>
  );
}
