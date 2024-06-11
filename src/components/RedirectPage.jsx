import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import checkToken from "../utils/checkToken";

export default function RedirectPage() {
  const navigate = useNavigate();
  useEffect(() => {
    !(async function () {
      const token = localStorage.getItem("access_token");
      if (!token) return navigate("/login");
      try {
        const validateToken = await checkToken(token);
        if (validateToken.hasOwnProperty("error")) {
          localStorage.removeItem("access_token");
          return navigate("/login");
        }
        return navigate(`/${validateToken.userId}`);
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, []);
}
