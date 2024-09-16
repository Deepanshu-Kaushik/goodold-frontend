import { NavigateFunction } from 'react-router-dom';
import { ConversationType } from '../types/conversation-type';
import { toast } from 'react-toastify';

type MarkAsReadType = {
  userId: string;
  token: string;
  friendId: string | undefined;
  setConversations: React.Dispatch<React.SetStateAction<ConversationType[] | null>>;
  navigate: NavigateFunction;
};

const markAsRead = async ({ userId, token, friendId, setConversations, navigate }: MarkAsReadType) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/message/message-read/${userId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ friendId }),
    });

    if (response.status >= 200 && response.status <= 210) {
      const data: ConversationType = await response.json();
      setConversations((prev) => {
        const updatedConversations =
          prev?.map((convo) => {
            if (convo._id === data._id) {
              return data;
            } else {
              return convo;
            }
          }) || null;
        return updatedConversations;
      });
    } else if (response.status === 403) {
      toast.error('You need to re-login');
      return navigate('/login');
    } else {
      throw new Error('Something went wrong!');
    }
  } catch (error) {
    toast.error(error as string);
    console.log(error);
  }
};

export default markAsRead;
