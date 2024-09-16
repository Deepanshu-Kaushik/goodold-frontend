import { useState } from 'react';
import Card from '../Card';
import { Link, useNavigate } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import formatDate from '../../utils/formatDate';
import onAddFriend from '../../services/on-add-remove-friend';
import { useFriendListContext } from '../../contexts/FriendListContext';
import onClearAllNotifications from '../../services/on-clear-all-notifications';
import DeleteNotificationPopup from './DeleteNotificationPopup';
import onDeleteNotification from '../../services/on-delete-notification';
import { useNotificationsContext } from '../../contexts/NotificationContext';
import { toast } from 'react-toastify';

export default function Notifications() {
  const { token, userId } = localStorage;
  const navigate = useNavigate();
  const { notifications, setNotifications, loading, setLoading } = useNotificationsContext();
  const { setFriendList } = useFriendListContext();
  const [deleteNotificationPopup, setDeleteNotificationPopup] = useState<string>('');

  const handleAcceptFriendRequest = (friendId: string | undefined) => {
    onAddFriend({
      friendId,
      userId,
      token,
      setUserFriendList: setFriendList,
      navigate,
      setLoading,
      setNotifications,
    });
  };

  const handleDeclineFriendRequest = (notificationId: string) => {
    onDeleteNotification({
      token,
      userId,
      navigate,
      setNotifications,
      notificationId,
    });
  };

  const handleClearAllNotifications = async () => {
    await onClearAllNotifications({ token, userId, navigate, setLoading, setNotifications });
  };

  return (
    <div className='flex-grow pt-1 overflow-hidden'>
      <Card customStyle='h-full max-h-screen' className='dark:bg-lord-300'>
        <div className='flex items-center justify-between'>
          <h1 className='font-semibold text-xl dark:text-white tracking-widest'>Notifications</h1>
          <button
            className='text-blue-500 font-bold self-end tracking-widest'
            onClick={handleClearAllNotifications}
            hidden={!notifications.length}
          >
            Clear all
          </button>
        </div>
        <hr className='mb-2 dark:border-primary-100' />
        {loading ? (
          <LoadingOutlined className='text-5xl text-sky-600 w-full' />
        ) : (
          <div className='flex flex-col w-full gap-2'>
            {notifications.map((notification) => (
              <Link
                key={notification._id}
                to={
                  notification.typeOfNotification !== 'friend-request'
                    ? `/profile/${notification.userId}#${notification.postId}`
                    : `/profile/${notification.createrId}`
                }
                onContextMenuCapture={(e) => {
                  e.preventDefault();
                  setDeleteNotificationPopup(notification._id);
                }}
                className={`flex gap-2 md:gap-4 min-h-12 max-h-20 max-w-full items-center hover:bg-gray-200 dark:hover:bg-dark-400 p-2 rounded cursor-pointer ${!notification.notificationRead && 'bg-slate-300 dark:bg-dark-300'}`}
              >
                <div className='size-8 md:size-12 rounded-full min-w-8'>
                  <img src={notification.userPicturePath} className='size-full rounded-full object-cover ' />
                </div>
                <div className='flex-1 min-w-[130px] text-gray-500'>
                  <h3 className='text-black font-semibold overflow-hidden text-ellipsis whitespace-nowrap dark:text-white'>
                    {notification.notificationText}
                  </h3>
                  {notification.typeOfNotification === 'comment' && (
                    <div className='overflow-hidden text-ellipsis whitespace-nowrap dark:text-primary-100'>
                      {notification.commentOnPost}
                    </div>
                  )}
                  {notification.typeOfNotification === 'friend-request' && !notification.acceptedFriendRequest && (
                    <div className='flex gap-2 text-white'>
                      <button
                        className='bg-blue-600 px-2 py-1 dark:bg-cyan-900 dark:hover:bg-cyan-600'
                        onClick={(e) => {
                          e.preventDefault();
                          handleAcceptFriendRequest(notification.createrId);
                          toast.success('Accepted friend request');
                        }}
                      >
                        Accept
                      </button>
                      <button
                        className='bg-red-600 dark:bg-red-900 dark:hover:bg-red-700 px-2 py-1'
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeclineFriendRequest(notification._id);
                          toast.success('Declined friend request');
                        }}
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
                <div className='flex text-right gap-1 self-center items-center max-w-12 md:max-w-max'>
                  <div className='text-xs md:text-base text-gray-600 dark:text-primary-100'>
                    {formatDate(notification.createdAt)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {deleteNotificationPopup && (
          <DeleteNotificationPopup
            notificationId={deleteNotificationPopup}
            setNotifications={setNotifications}
            setDeleteNotificationPopup={setDeleteNotificationPopup}
          />
        )}
      </Card>
    </div>
  );
}
