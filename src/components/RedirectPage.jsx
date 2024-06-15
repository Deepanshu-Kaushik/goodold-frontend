import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HomePage from "./Homepage";

export default function RedirectPage() {
  const navigate = useNavigate();

  useEffect(() => {
    !(async function () {
      const token = localStorage.getItem("access_token");
      if (!token) return navigate("/login");
    })();
  }, []);

  return <HomePage />;
}
