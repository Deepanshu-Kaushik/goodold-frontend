import { ArrowLeftOutlined, LoadingOutlined, SendOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocketContext } from '../../contexts/SocketContext';
import formatDate from '../../utils/formatDate';
import { UserType } from '../../types/user-type';
import { MessageType } from '../../types/message-type';
import { ConversationType } from '../../types/conversation-type';

type ChatBoxType = {
  friend: UserType;
  setIsChatOpen: React.Dispatch<React.SetStateAction<ConversationType | null>>;
  isOnline: boolean;
  setConversations: React.Dispatch<React.SetStateAction<ConversationType[] | null>>;
  alreadyRead: boolean;
  messageSeenAt: Record<string, string>;
};

export default function ChatBox({
  friend,
  setIsChatOpen,
  isOnline,
  setConversations,
  alreadyRead,
  messageSeenAt,
}: ChatBoxType) {
  const { _id: friendId, firstName, lastName } = friend;
  const [loading, setLoading] = useState<boolean>(false);
  const [pendingMessage, setPendingMessage] = useState<boolean>(false);
  const { token, userId, userPicturePath } = localStorage;
  const [message, setMessage] = useState<string>('');
  const [allMessages, setAllMessages] = useState<MessageType[]>([]);
  const chatsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { socket } = useSocketContext();

  useEffect(() => {
    if (!socket) return;
    socket.on('newMessage', (newMessage: MessageType) => {
      setAllMessages((prev) => {
        const messages: MessageType[] = prev.slice();
        messages.push(newMessage);
        return messages;
      });
      setConversations((prev) => {
        const updatedConversations =
          prev?.map((convo) => {
            if (friendId && convo.participants._id === friendId) {
              delete messageSeenAt[friendId];
            }
            return convo;
          }) || null;
        return updatedConversations;
      });
      setTimeout(() => {
        if (chatsRef.current) {
          chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
          markAsRead();
        }
      }, 100);
    });

    socket.on('messageSeen', (messageSeenTime: string) => {
      setConversations((prev) => {
        const updatedConversations =
          prev?.map((convo) => {
            if (friendId && convo.participants._id === friendId) {
              messageSeenAt[friendId] = messageSeenTime;
            }
            return convo;
          }) || null;
        return updatedConversations;
      });
      setTimeout(() => {
        if (chatsRef.current) {
          chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
        }
      }, 100);
    });

    const markAsRead = async () => {
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
          return navigate('/login');
        } else {
          throw new Error('Something went wrong!');
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getAllMessages = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/message/${friendId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

    getAllMessages();
    !alreadyRead && markAsRead();
    return () => {
      socket.removeListener('newMessage');
    };
  }, [friendId]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPendingMessage(true);
    if (!message) return;
    const messageQuery = message;
    setMessage('');
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/message/send/${friendId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageQuery }),
      });

      if (response.status >= 200 && response.status <= 210) {
        const data = await response.json();
        setAllMessages((prev) => {
          const messages = prev.slice();
          messages.push(data);
          return messages;
        });
        setConversations((prev) => {
          const updatedConversations =
            prev?.map((convo) => {
              if (friendId && convo.participants._id === friendId) {
                delete messageSeenAt[friendId];
                convo.latestMessage = messageQuery;
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
    setTimeout(() => {
      if (chatsRef.current) chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
      setPendingMessage(false);
    }, 100);
  };

  return (
    <div className='flex-1 lg:max-w-[80%] flex flex-col justify-center overflow-x-hidden'>
      <div className='flex items-center gap-4'>
        <button className='md:hidden p-1 rounded-full hover:bg-slate-200' onClick={() => setIsChatOpen(null)}>
          <ArrowLeftOutlined />
        </button>
        <h1 className='font-bold text-xl md:text-3xl'>
          <div>
            {firstName} {lastName}
          </div>
          {isOnline ? (
            <div className='text-sm text-blue-600'>Online</div>
          ) : (
            <div className='text-sm text-blue-600'>Last online {formatDate(friend?.lastOnline)}</div>
          )}
        </h1>
      </div>
      <hr className='my-2' />
      <div className='flex flex-col overflow-y-auto h-full overflow-x-hidden' ref={chatsRef}>
        {!loading ? (
          allMessages?.map((message) => (
            <div key={message._id} className='flex flex-col w-full'>
              <div
                className={`flex m-1 md:m-2 gap-1 md:gap-2 ${
                  message?.senderId === userId ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <img
                  src={message?.senderId === userId ? userPicturePath : friend?.userPicturePath}
                  className='size-6 md:size-12 rounded-full object-cover'
                />
                <div
                  className={`${
                    message?.senderId === userId ? 'bg-sky-600 text-white' : 'bg-gray-200'
                  } p-3 rounded-xl max-w-[70%] break-words`}
                >
                  {message.message}
                </div>
              </div>
              <div
                className={`text-xs text-sky-600 ${
                  message?.senderId !== userId ? 'self-start ml-8 md:ml-16' : 'self-end mr-8 md:mr-16'
                }`}
              >
                {formatDate(message.createdAt)}
              </div>
            </div>
          ))
        ) : (
          <LoadingOutlined className='text-5xl text-sky-600' />
        )}
        {friendId && messageSeenAt[friendId] && (
          <div className='text-xs text-blue-600 self-end mr-8 md:mr-16 font-bold italic'>
            Seen {formatDate(messageSeenAt[friendId])}
          </div>
        )}
      </div>
      <form className='flex bg-gray-200 rounded-lg py-2 px-4 mt-4 items-center' onSubmit={handleSendMessage}>
        <input
          type='text'
          placeholder='Message...'
          autoFocus
          className='flex-1 bg-transparent outline-none p-1'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type='submit' className='flex' disabled={pendingMessage}>
          {pendingMessage ? (
            <LoadingOutlined className='text-blue-600' style={{ fontSize: '20px' }} />
          ) : (
            <SendOutlined className='text-blue-600' style={{ fontSize: '20px' }} />
          )}
        </button>
      </form>
    </div>
  );
}
