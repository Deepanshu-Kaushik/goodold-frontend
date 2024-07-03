import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RedirectPage from "./components/RedirectPage";
import Login from "./components/Login";
import Register from "./components/Register";
import Layout from "./components/Layout";
import ChatRoom from "./components/ChatRoom";
import ProfilePage from "./components/ProfilePage";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <RedirectPage /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      {
        path: "/chat",
        element: <ChatRoom />,
      },
      { path: "/profile/:profileId", element: <ProfilePage /> },
    ],
  },
]);

export default function App() {
  return (
    <div className="app">
      <RouterProvider router={routes} />
    </div>
  );
}
