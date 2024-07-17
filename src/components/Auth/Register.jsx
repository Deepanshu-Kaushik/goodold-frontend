import { useEffect, useRef, useState } from "react";
import Card from "../Card";
import { Link, useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { z } from "zod";
import ErrorComponent from "../ErrorComponent";
import { useUserIdContext } from "../../contexts/UserIdContext";

export default function Register() {
  const { setUserId } = useUserIdContext();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const focusRef = useRef();
  const schema = z.object({
    firstName: z
      .string()
      .min(3, { message: "First name should be minimum of length 3." })
      .max(20, { message: "First name should be maximum of length 20." }),
    lastName: z
      .string()
      .min(3, { message: "Last name should be minimum of length 3." })
      .max(20, { message: "Last name should be maximum of length 20." }),
    location: z
      .string()
      .min(3, { message: "Location should be minimum of length 3." }),
    occupation: z
      .string()
      .min(3, { message: "Occupation should be minimum of length 3." }),
    email: z.string().email({ message: "Invalid email." }),
    password: z
      .string()
      .min(8, { message: "Password should be minimum of length 8." })
      .max(20, { message: "Password should be maximum of length 20." }),
  });
  useEffect(() => {
    const { token, userId } = localStorage;
    if (token && userId) return navigate("/");
    focusRef.current?.focus();
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
  const [formErrors, setFormErrors] = useState({});

  function handleOnChange(e) {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((formData) => ({
        ...formData,
        [name]: files[0],
      }));
      if (files[0]) setImage(URL.createObjectURL(files[0]));
    } else {
      setFormData((formData) => ({
        ...formData,
        [name]: value,
      }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const parsedUser = schema.safeParse(formData);
    if (!parsedUser.success) {
      const error = parsedUser.error;
      let newErrors = {};
      for (const issue of error.issues) {
        newErrors = {
          ...newErrors,
          [issue.path[0]]: issue.message,
        };
      }
      return setFormErrors(newErrors);
    }

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
      if (userData.status === 200) {
        userData = await userData.json();
        localStorage.setItem("token", userData.token);
        localStorage.setItem("userId", userData.user._id);
        setUserId(userData.user._iuseUserIdContextd);
        localStorage.setItem("userPicturePath", userData.user.userPicturePath);
        return navigate(`/`);
      } else if (userData.status === 400) {
        const newError = await userData.json();
        setFormErrors({
          email: newError.error,
        });
      } else if (userData.status === 403) {
        return navigate("/login");
      } else {
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
    setLoading(false);
  }

  return (
    <div className="flex p-4 justify-center select-none">
      <Card customStyle="w-[80%] md:w-[60%]">
        <h2>Welcome to Goodold!</h2>
        <form
          className="flex flex-col my-4 gap-2"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="flex flex-col items-center gap-2 mb-2">
            {image && (
              <img
                className="w-28 h-28 object-cover rounded-full border-2"
                src={image}
              />
            )}
            <label
              htmlFor="picture"
              className="bg-sky-800 hover:bg-sky-700 text-white rounded-sm cursor-pointer text-center p-4 py-2"
            >
              Upload profile picture
            </label>
          </div>
          <div className="gap-2 w-full flex flex-col ">
            <input
              type="text"
              className="outline-sky-400 p-2 flex-1 border-2"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleOnChange}
              autoComplete="off"
              ref={focusRef}
            />
            {formErrors.firstName && (
              <ErrorComponent>{formErrors.firstName}</ErrorComponent>
            )}
            <input
              type="text"
              className="outline-sky-400 p-2 flex-1 border-2"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              autoComplete="off"
              onChange={handleOnChange}
            />
            {formErrors.lastName && (
              <ErrorComponent>{formErrors.lastName}</ErrorComponent>
            )}
          </div>
          <input
            type="text"
            placeholder="Location"
            name="location"
            className="outline-sky-400 p-2 border-2"
            value={formData.location}
            autoComplete="off"
            onChange={handleOnChange}
          />
          {formErrors.location && (
            <ErrorComponent>{formErrors.location}</ErrorComponent>
          )}
          <input
            type="text"
            placeholder="Occupation"
            name="occupation"
            className="outline-sky-400 p-2 border-2"
            value={formData.occupation}
            autoComplete="off"
            onChange={handleOnChange}
          />
          {formErrors.occupation && (
            <ErrorComponent>{formErrors.occupation}</ErrorComponent>
          )}
          <input
            type="file"
            name="picture"
            id="picture"
            accept="image/jpeg, image/png, image/jpg"
            onChange={handleOnChange}
            hidden
          />
          <input
            type="text"
            placeholder="Email"
            name="email"
            className="outline-sky-400 p-2 border-2"
            value={formData.email}
            autoComplete="off"
            onChange={handleOnChange}
          />
          {formErrors.email && (
            <ErrorComponent>{formErrors.email}</ErrorComponent>
          )}
          <input
            type="password"
            placeholder="Password"
            name="password"
            className="outline-sky-400 p-2 border-2"
            value={formData.password}
            autoComplete="off"
            onChange={handleOnChange}
          />
          {formErrors.password && (
            <ErrorComponent>{formErrors.password}</ErrorComponent>
          )}
          {loading ? (
            <LoadingOutlined className="text-5xl text-sky-600" />
          ) : (
            <button
              type="submit"
              className="text-sky-50 font-bold text-lg bg-sky-800 hover:bg-sky-700 px-4 pt-2 pb-1.5 rounded-sm text-center self-center"
            >
              Register
            </button>
          )}
        </form>
        <Link
          to="/login"
          className="font-bold text-sky-800 hover:text-sky-600 underline"
        >
          Already have an account? Sign In here.
        </Link>
      </Card>
    </div>
  );
}
