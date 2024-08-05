import { CloseCircleTwoTone, SendOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useNewMessageBoxContext } from '../../contexts/NewMessageBoxContext';
import { useNavigate } from 'react-router-dom';

type FloatingChatBoxType = {
  name: string;
  id: string;
};

export default function FloatingChatBox({ name, id }: FloatingChatBoxType) {
  const [message, setMessage] = useState<string>('');
  const { setNewMessageBox } = useNewMessageBoxContext();
  const navigate = useNavigate();
  const { token } = localStorage;

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/message/send/${id}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }),
        },
      );

      if (response.status >= 200 && response.status <= 210) {
        setNewMessageBox(false);
      } else if (response.status === 403) {
        return navigate('/login');
      } else {
        throw new Error('Something went wrong!');
      }
    } catch (error) {
      console.log(error);
    }
    setMessage('');
    setNewMessageBox(false);
  };

  return (
    <div className='h-dvh w-full absolute left-0 top-0 z-50 flex justify-center items-center backdrop-blur-sm'>
      <div className='bg-white z-50 rounded-md flex flex-col p-2 w-1/2 border border-black'>
        <div className='flex'>
          <h1 className='text-2xl text-center flex-1'>Send a message to {name}</h1>
          <CloseCircleTwoTone className='mx-2 text-2xl' onClick={() => setNewMessageBox(false)} />
        </div>
        <form
          className='flex bg-gray-200 rounded-lg py-2 px-4 mt-4 items-center'
          onSubmit={handleSendMessage}
        >
          <input
            type='text'
            placeholder='Message...'
            autoFocus
            className='flex-1 bg-transparent outline-none p-1'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <SendOutlined
            role='button'
            type='submit'
            className='text-blue-600'
            style={{ fontSize: '20px' }}
          />
        </form>
      </div>
    </div>
  );
}
