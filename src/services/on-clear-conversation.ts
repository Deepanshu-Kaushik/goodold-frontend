import { NavigateFunction } from 'react-router-dom';
import { ConversationType } from '../types/conversation-type';
import { toast } from 'react-toastify';

type OnClearConversationType = {
  token: string;
  userId: string;
  friendId: string | undefined;
  navigate: NavigateFunction;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsChatOpen: React.Dispatch<React.SetStateAction<ConversationType | null>>;
};

export default async function onClearConversation({
  token,
  userId,
  friendId,
  navigate,
  setLoading,
  setIsChatOpen,
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
      setIsChatOpen(null);
      toast.success('Cleared the conversation successfully');
    } else if (response.status === 403) {
      toast.error('You need to re-login');
      return navigate('/login');
    } else {
      throw new Error('Something went wrong!');
    }
  } catch (error) {
    toast.error(error as string);
    console.log(error);
  } finally {
    setLoading(false);
  }
}
