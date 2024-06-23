import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RedirectPage from "./components/RedirectPage";
import HomePage from "./components/Homepage";
import Login from "./components/Login";
import Register from "./components/Register";
import Layout from "./components/Layout";
import ChatRoom from "./components/ChatRoom";
import ChatBox from "./components/ChatBox";

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
        children: [{ path: "/chat/:friendId", element: <ChatBox /> }],
      },
      // { path: "/:userId", element: <UserPage /> },
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
