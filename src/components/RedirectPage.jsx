import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HomePage from "./Homepage";

export default function RedirectPage() {
  const navigate = useNavigate();

  useEffect(() => {
    !(async function () {
      const { access_token: token, userId } = localStorage;
      if (!token || !userId) return navigate("/login");
    })();
  }, []);

  return <HomePage />;
}
