import { ArrowLeftOutlined, LoadingOutlined, SendOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocketContext } from '../../contexts/SocketContext';
import formatDate from '../../utils/formatDate';
import { UserType } from '../../types/user-type';
import { MessageType } from '../../types/message-type';
import { ConversationType } from '../../types/conversation-type';
import { MessageNotificationType } from '../../types/message-notification-type';
import markAsRead from '../../services/mark-as-read';
import getAllMessages from '../../services/get-all-messages';
import PreviewImage from './PreviewImage';
import onClearConversation from '../../services/on-clear-conversation';
import { GrAttachment } from 'react-icons/gr';
import { IoMdCloseCircle } from 'react-icons/io';
import { toast } from 'react-toastify';

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
  const [imageToDisplay, setImageToDisplay] = useState<string | null>(null);
  const [picture, setPicture] = useState<any>(null);
  const pictureRef = useRef<HTMLInputElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');

  useEffect(() => {
    if (!socket) return;
    let timerChatRef1: number;
    let timerChatRef2: number;
    socket.on('messageNotification', ({ newMessage, senderData: _ }: MessageNotificationType) => {
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
      timerChatRef1 = setTimeout(() => {
        if (chatsRef.current) {
          chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
          markAsRead({ userId, token, friendId, setConversations, navigate });
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
      timerChatRef2 = setTimeout(() => {
        if (chatsRef.current) {
          chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
        }
      }, 100);
    });

    getAllMessages({ setLoading, abortControllerRef, friendId, token, setAllMessages, chatsRef, navigate });
    !alreadyRead && markAsRead({ userId, token, friendId, setConversations, navigate });
    return () => {
      socket.removeListener('newMessage');
      clearTimeout(timerChatRef1);
      clearTimeout(timerChatRef2);
    };
  }, [friendId]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message && !picture) return;
    setPendingMessage(true);
    const messageQuery = message;
    const pictureToSend = picture;
    setMessage('');
    setPicture(null);
    setImageToDisplay(null);
    const chatDataToSend = new FormData();
    chatDataToSend.append('message', messageQuery);
    if (pictureToSend) chatDataToSend.append('picture', pictureToSend);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/message/send/${friendId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: chatDataToSend,
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
                if (messageQuery) convo.latestMessage = messageQuery;
                else convo.latestMessage = 'IMAGE';
              }
              return convo;
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
    } finally {
      setTimeout(() => {
        if (chatsRef.current) chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
        setPendingMessage(false);
      }, 100);
    }
  };

  const clearConversation = async () => {
    await onClearConversation({ token, userId, friendId, navigate, setLoading, setIsChatOpen });
  };

  return (
    <div className='flex-1 lg:max-w-[80%] flex flex-col justify-center overflow-x-hidden'>
      <div className='flex items-center gap-4 justify-between'>
        <button
          className='md:hidden p-1 rounded-full hover:bg-slate-200 dark:text-white dark:hover:bg-lord-100'
          onClick={() => setIsChatOpen(null)}
        >
          <ArrowLeftOutlined />
        </button>
        <h1 className='font-bold text-xl md:text-3xl flex-1'>
          <div className='dark:text-white tracking-wide'>
            {firstName} {lastName}
          </div>

          <div className='text-sm text-blue-600 tracking-wider'>
            {isOnline ? 'Online' : `Last online ${formatDate(friend?.lastOnline)}`}
          </div>
        </h1>
        <button
          className='text-blue-500 font-bold self-end tracking-widest'
          onClick={clearConversation}
          hidden={!allMessages.length}
          disabled={!allMessages.length}
          title='Delete messages for both participants'
        >
          Clear all
        </button>
      </div>
      <hr className='my-2 dark:border-primary-100' />
      <div className='flex flex-col overflow-y-auto h-full overflow-x-hidden' ref={chatsRef}>
        {!loading ? (
          allMessages?.map((message) => (
            <div key={message._id} className='flex flex-col w-full'>
              <div
                className={`flex m-1 md:m-2 gap-1 md:gap-2 ${
                  message?.senderId === userId ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {(message.message || message.chatPicturePath) && (
                  <img
                    src={message?.senderId === userId ? userPicturePath : friend?.userPicturePath}
                    className='size-6 md:size-12 rounded-full object-cover'
                  />
                )}
                <div
                  className={`max-w-[70%] gap-1 flex flex-col ${message?.senderId === userId ? 'items-end' : 'items-start'}`}
                >
                  {message.chatPicturePath && (
                    <img
                      src={message.chatPicturePath}
                      className='max-h-96 border-2 border-black cursor-pointer'
                      onClick={() => !!message.chatPicturePath && setPreviewImage(message.chatPicturePath)}
                    />
                  )}
                  {message.message && (
                    <div
                      className={`${
                        message?.senderId === userId
                          ? 'bg-sky-600 dark:bg-cyan-900 text-white'
                          : 'bg-gray-200 dark:bg-lord-200 dark:text-white'
                      } p-3 rounded-xl break-words w-fit`}
                    >
                      {message.message}
                    </div>
                  )}
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
      <form
        className='flex bg-gray-200 rounded-lg py-2 px-4 mt-4 items-center dark:bg-dark-600 dark:text-white'
        onSubmit={handleSendMessage}
        encType='multipart/form-data'
      >
        {imageToDisplay && (
          <div className='relative'>
            <img
              className='max-h-24 p-0.5 object-contain border-2 border-sky-600 cursor-pointer'
              src={imageToDisplay}
              onClick={() => setPreviewImage(imageToDisplay)}
            />
            <IoMdCloseCircle
              className='absolute -top-1 -right-1 text-xl cursor-pointer text-red-600 bg-white rounded-full'
              onClick={(e) => {
                e.preventDefault();
                setImageToDisplay(null);
                setPicture(null);
              }}
            />
          </div>
        )}
        <input
          type='text'
          placeholder='Message...'
          autoFocus
          className='flex-1 bg-transparent outline-none p-1 placeholder:text-sm dark:placeholder:text-white'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input
          ref={pictureRef}
          type='file'
          id='picture'
          name='picture'
          accept='image/jpeg, image/jpg, image/png'
          hidden
          onChange={(e) => {
            const { files } = e.target as HTMLInputElement;
            if (!files) return;
            setPicture(files[0]);
            setImageToDisplay(URL.createObjectURL(files[0]));
          }}
        />
        <div className='w-[1px] h-full bg-gray-700 dark:bg-primary-100' />
        <div className='flex justify-between items-center min-w-20 '>
          <button type='button' className='outline-none'>
            <label htmlFor='picture'>
              <GrAttachment className='ml-4 cursor-pointer' style={{ fontSize: '20px' }} />
            </label>
          </button>
          <button type='submit' className='flex outline-none' disabled={pendingMessage}>
            {pendingMessage ? (
              <LoadingOutlined className='text-blue-600' style={{ fontSize: '20px' }} />
            ) : (
              <SendOutlined className='text-blue-600' style={{ fontSize: '20px' }} />
            )}
          </button>
        </div>
      </form>
      {!!previewImage.length && <PreviewImage previewImage={previewImage} setPreviewImage={setPreviewImage} />}
    </div>
  );
}
