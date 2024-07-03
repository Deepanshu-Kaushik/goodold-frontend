import { useEffect, useState } from "react";
import Card from "./Card";
import { Link, useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { access_token: token, userId } = localStorage;
    if (token && userId) return navigate("/");
  }, []);

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
    setLoading(true);

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
      localStorage.setItem("access_token", userData.token);
      localStorage.setItem("userId", userData.user._id);
      localStorage.setItem("userPicturePath", userData.user.userPicturePath);
      return navigate(`/`);
    } catch (error) {
      console.error("Error during registration:", error);
    }
    setLoading(false);
  }

  return (
    <div className="flex p-4 justify-center">
      <Card customStyle="w-[60%]">
        <h2>Welcome to Goodold!</h2>
        <form
          className="flex flex-col my-4 gap-2"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="gap-2 w-full flex flex-col md:flex-row">
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
          {loading ? (
            <LoadingOutlined className="text-5xl text-sky-600" />
          ) : (
            <button
              type="submit"
              className="text-sky-50 font-bold text-sm bg-sky-400 hover:bg-sky-300 px-4 pt-2 pb-1.5 rounded-sm text-center"
            >
              Register
            </button>
          )}
        </form>
        <Link to="/login" className="text-sm text-sky-400 underline">
          Already have an account? Sign In here.
        </Link>
      </Card>
    </div>
  );
}
