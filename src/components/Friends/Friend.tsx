import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingOutlined, UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
import { UserType } from '../../types/user-type';
import onAddRemoveFriend from '../../services/on-add-remove-friend';
import { useFriendListContext } from '../../contexts/FriendListContext';
import onSendFriendRequestNotification from '../../services/on-send-friend-request-notification';
import onRemoveNotification from '../../services/on-remove-notification';
import { FaUserAltSlash } from 'react-icons/fa';
import { LuCheckCircle } from 'react-icons/lu';
import { toast } from 'react-toastify';

type FriendType = {
  setFriendList: React.Dispatch<React.SetStateAction<UserType[]>>;
  data: UserType;
  isOnline?: boolean;
};

export default function Friend({ setFriendList, data, isOnline }: FriendType) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { token, userId } = localStorage;
  const {
    friendList,
    setFriendList: setUserFriendList,
    pendingRequests,
    setPendingRequests,
    unAcceptedRequests,
    setUnAcceptedRequests,
  } = useFriendListContext();
  const friendsIds = friendList?.map((friend) => friend.userId) || [];

  const handleAddRemoveFriend = async (friendId: string | undefined) => {
    setLoading(true);
    const removedFriend = await onAddRemoveFriend({
      friendId,
      userId,
      token,
      setUserFriendList,
      navigate,
      setLoading,
    });
    if (removedFriend) setFriendList((friendList) => friendList.filter((friend) => friend.userId !== userId));
    else setUnAcceptedRequests((unAcceptedRequests) => unAcceptedRequests.filter((request) => request !== friendId));
    setLoading(false);
  };

  async function removeNotification(friendId: string | undefined) {
    const typeOfNotification = 'friend-request';
    await onRemoveNotification({
      token,
      userId,
      navigate,
      friendId,
      typeOfNotification,
    });
    setPendingRequests((pendingRequests) => pendingRequests.filter((request) => request !== friendId));
  }

  const handleSendFriendRequestNotification = async (friendId: string | undefined) => {
    if (!friendId) return;
    setLoading(true);
    await onSendFriendRequestNotification({ token, userId, navigate, friendId });
    setPendingRequests((pendingRequests) => {
      const newPendingRequests = pendingRequests.slice();
      newPendingRequests.push(friendId);
      return newPendingRequests;
    });
    setLoading(false);
  };

  return (
    <div className='flex items-center justify-between select-none w-full'>
      <div className='flex gap-4 items-center'>
        <div className='relative'>
          <img src={data?.userPicturePath} className='size-12 rounded-full object-cover' />
          {isOnline && <div className='absolute bottom-0 right-0 bg-green-500 size-4 rounded-full' />}
        </div>
        <div className='flex-1'>
          <div className='font-medium text-slate-600 dark:text-white'>
            {data?.firstName} {data?.lastName}
          </div>
          <div className='text-xs text-slate-600 dark:text-primary-100'>{data.location}</div>
        </div>
      </div>
      {!loading ? (
        <>
          {friendsIds.includes(data?.userId) ? (
            <UserDeleteOutlined
              className='cursor-pointer mx-2 text-white bg-sky-800 hover:bg-red-600 p-3 rounded-full dark:bg-cyan-900 dark:hover:bg-red-900'
              title='Unfriend'
              hidden={userId === data?.userId}
              onClick={async (e) => {
                e.preventDefault();
                await handleAddRemoveFriend(data?.userId);
                toast.success('Removed friend successfully');
              }}
            />
          ) : data.userId && pendingRequests.includes(data.userId) ? (
            <FaUserAltSlash
              className='cursor-pointer mx-2 text-white text-2xl bg-red-600 hover:bg-red-800 size-10 p-2 rounded-full'
              title='Cancel request'
              onClick={async (e) => {
                e.preventDefault();
                await removeNotification(data.userId);
                toast.success('Cancelled friend request');
              }}
            />
          ) : data.userId && unAcceptedRequests.includes(data.userId) ? (
            <LuCheckCircle
              className='cursor-pointer mx-2 p-1 text-green-600 hover:text-green-400 size-10 rounded-full'
              title='Accept request'
              onClick={async (e) => {
                e.preventDefault();
                await handleAddRemoveFriend(data.userId);
                toast.success('Accepted friend request');
              }}
            />
          ) : (
            <UserAddOutlined
              className='cursor-pointer mx-2 text-white bg-sky-800 hover:bg-sky-600 p-3 rounded-full dark:bg-cyan-900 dark:hover:bg-cyan-600'
              title='Add friend'
              hidden={userId === data?.userId}
              onClick={async (e) => {
                e.preventDefault();
                await handleSendFriendRequestNotification(data.userId);
                toast.success('Sent friend request successfully');
              }}
            />
          )}
        </>
      ) : (
        <LoadingOutlined className='text-3xl text-sky-600 mx-3' />
      )}
    </div>
  );
}
