import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RedirectPage() {
  const navigate = useNavigate();
  useEffect(() => {
    !(async function () {
      const token = localStorage.getItem("access_token");
      if (!token) return navigate("/login");
      try {
        const validateToken = await (
          await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          })
        ).json();
        if (validateToken.hasOwnProperty("error")) return navigate("/login");
        else return navigate(`/${validateToken.userId}`);
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, []);
}
