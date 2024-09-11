import { useNavigate } from 'react-router-dom';
import { NotificationsType } from '../../types/notifications-type';
import onDeleteNotification from '../../services/on-delete-notification';

type DeleteNotificationPopupType = {
  notificationId: string;
  setNotifications: React.Dispatch<React.SetStateAction<NotificationsType[]>>;
  setDeleteNotificationPopup: React.Dispatch<React.SetStateAction<string>>;
};

export default function DeleteNotificationPopup({
  notificationId,
  setNotifications,
  setDeleteNotificationPopup,
}: DeleteNotificationPopupType) {
  const { token, userId } = localStorage;
  const navigate = useNavigate();

  function closePopup() {
    setDeleteNotificationPopup('');
  }
  async function deleteNotification() {
    await onDeleteNotification({ token, userId, navigate, setNotifications, notificationId });
    setDeleteNotificationPopup('');
  }

  return (
    <div
      className='h-dvh w-full absolute left-0 bottom-0 z-50 flex justify-center items-end backdrop-blur-sm text-red-500 font-bold text-xl md:text-2xl'
      onClick={closePopup}
    >
      <div
        className='w-full border border-t-black border-l-0 border-r-0 border-b-0 bg-black flex justify-center'
        onClick={(e) => e.stopPropagation()}
      >
        <button className='my-4 outline-none' onClick={deleteNotification}>
          Delete Notification
        </button>
      </div>
    </div>
  );
}
