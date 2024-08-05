import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RedirectPage from './components/Feed/RedirectPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Layout from './components/Feed/Layout';
import ChatRoom from './components/Chat/ChatRoom';
import ProfilePage from './components/Feed/ProfilePage';
import { SocketContextProvider } from './contexts/SocketContext';
import { UserIdContextProvider } from './contexts/UserIdContext';
import { ConversationsContextProvider } from './contexts/ConversationsContext';
import { NewMessageBoxContextProvider } from './contexts/NewMessageBoxContext';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <RedirectPage /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      {
        path: '/chat',
        element: <ChatRoom />,
      },
      { path: '/profile/:profileId', element: <ProfilePage /> },
    ],
  },
]);

export default function App() {
  return (
    <div className='app'>
      <NewMessageBoxContextProvider>
        <UserIdContextProvider>
          <SocketContextProvider>
            <ConversationsContextProvider>
              <RouterProvider router={routes} />
            </ConversationsContextProvider>
          </SocketContextProvider>
        </UserIdContextProvider>
      </NewMessageBoxContextProvider>
    </div>
  );
}
