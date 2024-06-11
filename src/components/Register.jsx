import React, { useState } from "react";
import Card from "./Card";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    location: "",
    occupation: "",
    picture: null,
    email: "",
    password: "",
  });

  function handleOnChange(e) {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((formData) => ({
        ...formData,
        [name]: files[0],
      }));
    } else {
      setFormData((formData) => ({
        ...formData,
        [name]: value,
      }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      let userData = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
        {
          method: "POST",
          body: formDataToSend,
        }
      );
      userData = await userData.json();
      return navigate("/login");
    } catch (error) {
      console.error("Error during registration:", error);
    }
  }

  return (
    <div className="flex p-4 justify-center">
      <Card customWidth="w-[60%]">
        <h2>Welcome to Sociopedia, the Social Media for Sociopaths!</h2>
        <form
          className="flex flex-col my-4 gap-2"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="space-x-2 w-full flex">
            <input
              type="text"
              className="outline-sky-400 p-2 flex-1 border-2"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleOnChange}
            />
            <input
              type="text"
              className="outline-sky-400 p-2 flex-1 border-2"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleOnChange}
            />
          </div>
          <input
            type="text"
            placeholder="Location"
            name="location"
            className="outline-sky-400 p-2 border-2"
            value={formData.location}
            onChange={handleOnChange}
          />
          <input
            type="text"
            placeholder="Occupation"
            name="occupation"
            className="outline-sky-400 p-2 border-2"
            value={formData.occupation}
            onChange={handleOnChange}
          />
          <input
            type="file"
            name="picture"
            accept="image/jpeg, image/png, image/jpg"
            onChange={handleOnChange}
          />
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
            Register
          </button>
        </form>
        <Link to="/login" className="text-sm text-sky-400 underline">
          Already have an account? Sign Up here.
        </Link>
      </Card>
    </div>
  );
}
