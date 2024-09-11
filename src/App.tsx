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
import { FriendListContextContextProvider } from './contexts/FriendListContext';
import Notifications from './components/Notifications';
import { NotificationsContextProvider } from './contexts/NotificationContext';
import { ThemeContextProvider } from './contexts/ThemeContext';

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
      { path: '/notifications', element: <Notifications /> },
    ],
  },
]);

export default function App() {
  return (
    <div className='app'>
      <ThemeContextProvider>
        <NewMessageBoxContextProvider>
          <UserIdContextProvider>
            <SocketContextProvider>
              <ConversationsContextProvider>
                <FriendListContextContextProvider>
                  <NotificationsContextProvider>
                    <RouterProvider router={routes} />
                  </NotificationsContextProvider>
                </FriendListContextContextProvider>
              </ConversationsContextProvider>
            </SocketContextProvider>
          </UserIdContextProvider>
        </NewMessageBoxContextProvider>
      </ThemeContextProvider>
    </div>
  );
}
