import { NavigateFunction } from 'react-router-dom';
import { MessageType } from '../types/message-type';

type OnClearConversationType = {
  token: string;
  userId: string;
  friendId: string | undefined;
  navigate: NavigateFunction;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setAllMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
};

export default async function onClearConversationT({
  token,
  userId,
  friendId,
  navigate,
  setLoading,
  setAllMessages,
}: OnClearConversationType) {
  setLoading(true);
  try {
    if (!token || !userId) return navigate('/login');
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/message/clear-conversation`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        senderId: userId,
        receiverId: friendId,
      }),
    });
    if (response.status >= 200 && response.status <= 210) {
      setAllMessages([]);
      window.location.reload();
    } else if (response.status === 403) {
      return navigate('/login');
    } else {
      throw new Error('Something went wrong!');
    }
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
}
