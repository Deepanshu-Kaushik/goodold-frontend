import React, { useEffect, useState } from "react";
import Card from "./Card";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const { access_token: token, userId } = localStorage;
    if (token && userId) return navigate("/");
  }, []);

  const [formData, setFormData] = useState({ email: "", password: "" });

  function handleOnChange(e) {
    setFormData((formData) => ({
      ...formData,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status <= 210) {
        const userData = await response.json();
        localStorage.setItem("access_token", userData.token);
        localStorage.setItem("userId", userData.user._id);
        return navigate(`/`);
      } else if (response.status === 403) {
        return navigate("/login");
      } else {
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="flex p-4 justify-center">
      <Card customWidth="w-[60%]">
        <h2>Welcome to Sociopedia, the Social Media for Sociopaths!</h2>
        <form className="flex flex-col my-4 gap-2" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email"
            name="email"
            className="outline-sky-400 p-2 border-2"
            value={formData.email}
            onChange={handleOnChange}
          />
          <input
            type="text"
            placeholder="Password"
            name="password"
            className="outline-sky-400 p-2 border-2"
            value={formData.password}
            onChange={handleOnChange}
          />
          <button
            type="submit"
            className="text-sky-50 font-bold text-sm bg-sky-400 hover:bg-sky-300 px-4 pt-2 pb-1.5 rounded-sm text-center"
          >
            Login
          </button>
        </form>
        <Link to="/register" className="text-sm text-sky-400 underline">
          Don't have an account? Sign Up here.
        </Link>
      </Card>
    </div>
  );
}
