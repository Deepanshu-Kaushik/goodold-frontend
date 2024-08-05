import { useState } from 'react';
import Card from '../Card';
import ChatBox from './ChatBox';
import { LoadingOutlined } from '@ant-design/icons';
import ErrorComponent from '../ErrorComponent';
import { useSocketContext } from '../../contexts/SocketContext';
import { useUserIdContext } from '../../contexts/UserIdContext';
import { ConversationType } from '../../types/conversation-type';
import { useConversationsContext } from '../../contexts/ConversationsContext';

export default function ChatRoom() {
  const [isChatOpen, setIsChatOpen] = useState<ConversationType | null>(null);
  const { userId } = useUserIdContext();
  const { onlineUsers } = useSocketContext();
  const { conversations, setConversations, loading } = useConversationsContext();

  if (loading)
    return (
      <div className='flex justify-center items-center h-screen'>
        <LoadingOutlined className='text-5xl text-sky-600' />
      </div>
    );

  return (
    <div className='flex-grow p-3 overflow-hidden'>
      <Card customStyle='h-full shadow-2xl shadow-blue-900 flex max-h-screen gap-4 justify-between'>
        <div
          className={`md:flex flex-col gap-1 lg:w-[20%] overflow-x-clip overflow-y-auto ${isChatOpen ? 'hidden' : 'w-full'} `}
        >
          {conversations?.length ? (
            conversations?.map((conversation) => (
              <div
                className={`cursor-pointer w-full p-2 relative rounded-lg hover:bg-slate-200 ${
                  isChatOpen?._id === conversation.participants?._id ? 'bg-gray-200' : ''
                }`}
                onClick={() =>
                  setIsChatOpen((prev) =>
                    prev?.participants._id === conversation?.participants?._id ? null : conversation,
                  )
                }
                key={conversation.participants?._id}
              >
                <div className='flex gap-4 items-center'>
                  <div className='relative size-12 rounded-full'>
                    <img
                      src={conversation?.participants?.userPicturePath}
                      className='size-full rounded-full object-cover'
                    />
                    {typeof conversation?.participants?._id === 'string' &&
                      onlineUsers?.includes(conversation?.participants?._id) && (
                        <div className='absolute bottom-0 right-0 bg-green-500 size-4 rounded-full' title='Online'/>
                      )}
                  </div>
                  <div className='flex items-center justify-between w-full flex-1'>
                    <div className='flex-1'>
                      <div className='font-medium text-slate-600'>
                        {conversation?.participants?.firstName} {conversation?.participants?.lastName}
                      </div>
                      <div className='text-gray-400 text-sm max-w-24 max-h-6 truncate'>
                        {conversation?.latestMessage}
                      </div>
                    </div>
                    <div className='size-5 rounded-full flex justify-center items-center'>
                      {userId && conversation?.numberOfUnread[userId] > 0 && (
                        <div className='bg-blue-500 size-full font-semibold text-xs rounded-full text-white flex justify-center items-center'>
                          {conversation?.numberOfUnread[userId]}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <ErrorComponent className='text-3xl'>Please search for a profile, and send them a message.</ErrorComponent>
          )}
        </div>
        {isChatOpen && (
          <ChatBox
            friend={isChatOpen.participants}
            setIsChatOpen={setIsChatOpen}
            isOnline={
              typeof isChatOpen.participants._id === 'string' && onlineUsers.includes(isChatOpen.participants._id)
            }
            setConversations={setConversations}
            alreadyRead={userId && isChatOpen?.numberOfUnread[userId] === 0 ? true : false}
            messageSeenAt={isChatOpen.messageSeenAt}
          />
        )}
      </Card>
    </div>
  );
}
