import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RedirectPage from "./components/RedirectPage";
import HomePage from "./components/Homepage";
import Login from "./components/Login";
import Register from "./components/Register";
import Layout from "./components/Layout";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <RedirectPage /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: ":userId", element: <HomePage /> },
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
