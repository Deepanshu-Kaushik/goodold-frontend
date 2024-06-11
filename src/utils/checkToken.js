import { useNavigate } from "react-router-dom";

export default async (token) => {
  try {
    return await (
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })
    ).json();
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};
