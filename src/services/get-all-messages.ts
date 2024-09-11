import { NavigateFunction } from 'react-router-dom';
import { MessageType } from '../types/message-type';

type GetAllMessages = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  abortControllerRef: React.MutableRefObject<AbortController | null>;
  friendId: string | undefined;
  token: string;
  setAllMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  chatsRef: React.RefObject<HTMLDivElement>;
  navigate: NavigateFunction;
};

export default async ({
  setLoading,
  abortControllerRef,
  friendId,
  token,
  setAllMessages,
  chatsRef,
  navigate,
}: GetAllMessages) => {
  setLoading(true);
  if (abortControllerRef.current) abortControllerRef.current.abort();
  const controller = new AbortController();
  abortControllerRef.current = controller;

  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/message/${friendId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
    });

    if (response.status >= 200 && response.status <= 210) {
      const data: MessageType[] = await response.json();
      setAllMessages(data);
      setLoading(false);
      setTimeout(() => {
        if (chatsRef.current) {
          chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
        }
      }, 100);
    } else if (response.status === 403) {
      return navigate('/login');
    } else {
      throw new Error('Something went wrong!');
    }
  } catch (error) {
    console.log(error);
  }
};
