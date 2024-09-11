import { NavigateFunction } from 'react-router-dom';
import { ConversationType } from '../types/conversation-type';

type NewMessageType = {
  id: string;
  token: string;
  sendMessage: string;
  setNewMessageBox: React.Dispatch<React.SetStateAction<boolean>>;
  navigate: NavigateFunction;
  setConversations: React.Dispatch<React.SetStateAction<ConversationType[] | null>>;
};

export default async ({ id, token, sendMessage, setNewMessageBox, navigate, setConversations }: NewMessageType) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/message/send/${id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: sendMessage }),
    });

    if (response.status >= 200 && response.status <= 210) {
      setNewMessageBox(false);
      setConversations((prev) => {
        const updatedConversations =
          prev?.map((convo) => {
            if (id && convo.participants._id === id) {
              delete convo.messageSeenAt[id];
              if (sendMessage) convo.latestMessage = sendMessage;
                else convo.latestMessage = 'IMAGE';
            }
            return convo;
          }) || null;
        return updatedConversations;
      });
    } else if (response.status === 403) {
      return navigate('/login');
    } else {
      throw new Error('Something went wrong!');
    }
  } catch (error) {
    console.log(error);
  }
};
