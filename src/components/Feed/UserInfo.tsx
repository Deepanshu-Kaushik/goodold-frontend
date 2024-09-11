import { useState } from 'react';
import Card from '../Card';
import { LoadingOutlined, PushpinOutlined, UserAddOutlined, UserDeleteOutlined, WalletFilled } from '@ant-design/icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { UserType } from '../../types/user-type';
import { useNewMessageBoxContext } from '../../contexts/NewMessageBoxContext';
import FloatingChatBox from '../Chat/FloatingChatBox';
import onRemoveFriend from '../../services/on-add-remove-friend';
import { useFriendListContext } from '../../contexts/FriendListContext';
import onSendFriendRequestNotification from '../../services/on-send-friend-request-notification';
import onRemoveNotification from '../../services/on-remove-notification';
import { RiMessage2Fill } from 'react-icons/ri';
import { FaUserAltSlash } from 'react-icons/fa';
import { LuCheckCircle } from 'react-icons/lu';

type UserInfoType = {
  userData: UserType;
  setFriendList: React.Dispatch<React.SetStateAction<UserType[]>>;
};

export default function UserInfo({ userData, setFriendList }: UserInfoType) {
  const { profileId } = useParams();
  const { token, userId } = localStorage;
  const [loading, setLoading] = useState<boolean>(false);
  const { newMessageBox, setNewMessageBox } = useNewMessageBoxContext();
  const {
    friendList,
    setFriendList: setUserFriendList,
    pendingRequests,
    setPendingRequests,
    unAcceptedRequests,
    setUnAcceptedRequests,
  } = useFriendListContext();
  const friendsIds = friendList?.map((friend) => friend.userId) || [];
  const navigate = useNavigate();

  async function handleAddRemoveFriend(friendId: string) {
    setLoading(true);
    const removedFriend = await onRemoveFriend({
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
  }

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
    <Card customStyle='w-full dark:bg-lord-300'>
      <div className='flex flex-col gap-4'>
        <div className='flex items-start justify-between'>
          <div className='flex gap-4'>
            <img src={userData?.userPicturePath} className='size-12 rounded-full object-cover min-w-12' />
            <div className='flex flex-col'>
              <Link
                to={'/profile/' + userData?._id}
                className='font-medium text-slate-600 dark:text-white tracking-wider'
              >
                {userData?.firstName} {userData?.lastName}
              </Link>
              <div className='text-xs text-slate-600 dark:text-white'>{friendList?.length} friends</div>
            </div>
          </div>
          <div className='flex items-center'>
            {profileId && userId !== profileId && (
              <>
                <RiMessage2Fill
                  style={{ cursor: 'pointer' }}
                  title='Send a message'
                  className='text-3xl mx-1 md:mx-2 dark:text-white hover:text-dark-100 dark:hover:text-gray-400'
                  onClick={() => setNewMessageBox(true)}
                />
                {newMessageBox && (
                  <FloatingChatBox name={`${userData?.firstName} ${userData?.lastName}`} id={profileId} />
                )}
              </>
            )}
            {!loading ? (
              profileId &&
              userId !== profileId &&
              (friendsIds?.includes(profileId) ? (
                <UserDeleteOutlined
                  className='cursor-pointer mx-2 text-white bg-sky-800 hover:bg-red-600 p-3 rounded-full dark:bg-cyan-900 dark:hover:bg-red-900'
                  title='Unfriend'
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddRemoveFriend(profileId);
                  }}
                />
              ) : profileId && pendingRequests.includes(profileId) ? (
                <FaUserAltSlash
                  className='cursor-pointer mx-2 text-white text-2xl bg-red-600 hover:bg-red-800 size-10 p-2 rounded-full'
                  title='Cancel request'
                  onClick={(e) => {
                    e.preventDefault();
                    removeNotification(profileId);
                  }}
                />
              ) : profileId && unAcceptedRequests.includes(profileId) ? (
                <LuCheckCircle
                  className='cursor-pointer mx-2 p-1 text-green-600 hover:text-green-400 size-10 rounded-full'
                  title='Accept request'
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddRemoveFriend(profileId);
                  }}
                />
              ) : (
                <UserAddOutlined
                  className='cursor-pointer mx-2 text-white bg-sky-800 hover:bg-sky-600 p-3 rounded-full dark:bg-cyan-900 dark:hover:bg-cyan-600'
                  title='Add friend'
                  onClick={(e) => {
                    e.preventDefault();
                    handleSendFriendRequestNotification(profileId);
                  }}
                />
              ))
            ) : (
              <LoadingOutlined className='text-3xl text-sky-600 mx-3' />
            )}
          </div>
        </div>
        <hr className='dark:border-primary-200' />
        <div className='flex flex-col gap-2'>
          <div className='flex gap-4 dark:text-primary-100'>
            <PushpinOutlined />
            {userData?.location}
          </div>
          <div className='flex gap-4 dark:text-primary-100'>
            <WalletFilled />
            {userData?.occupation}
          </div>
        </div>
      </div>
    </Card>
  );
}
