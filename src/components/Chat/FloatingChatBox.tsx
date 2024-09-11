import { SendOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useNewMessageBoxContext } from '../../contexts/NewMessageBoxContext';
import { useNavigate } from 'react-router-dom';
import newMessage from '../../services/new-message';
import { useConversationsContext } from '../../contexts/ConversationsContext';
import { IoMdCloseCircle } from 'react-icons/io';

type FloatingChatBoxType = {
  name: string;
  id: string;
};

export default function FloatingChatBox({ name, id }: FloatingChatBoxType) {
  const [message, setMessage] = useState<string>('');
  const { setNewMessageBox } = useNewMessageBoxContext();
  const navigate = useNavigate();
  const { token } = localStorage;
  const { setConversations } = useConversationsContext();

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message) return;
    const sendMessage = message;
    setMessage('');
    newMessage({ id, token, sendMessage, setNewMessageBox, navigate, setConversations });
    setNewMessageBox(false);
  };

  return (
    <div
      className='h-dvh w-full absolute left-0 top-0 z-50 flex justify-center items-center backdrop-blur-lg'
      onClick={() => setNewMessageBox(false)}
    >
      <div
        className='bg-white z-50 rounded-md flex flex-col p-2 w-1/2 dark:bg-lord-300 ring-1'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex'>
          <h1 className='text-2xl text-center flex-1 dark:text-white tracking-wide'>Message {name}</h1>
          <IoMdCloseCircle className='text-2xl text-red-600 bg-white rounded-full cursor-pointer' onClick={() => setNewMessageBox(false)} />
        </div>
        <form
          className='flex bg-gray-200 rounded-lg py-2 px-4 mt-4 items-center dark:border dark:bg-dark-600 dark:border-lord-100 dark:text-white'
          onSubmit={handleSendMessage}
        >
          <input
            type='text'
            placeholder='Message...'
            autoFocus
            className='flex-1 bg-transparent outline-none p-1 w-full dark:placeholder:text-white'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <SendOutlined role='button' type='submit' className='text-blue-600' style={{ fontSize: '20px' }} />
        </form>
      </div>
    </div>
  );
}
