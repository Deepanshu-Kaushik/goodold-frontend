import { useRef, useState } from "react";
import Card from "../Card";
import {
  AudioFilled,
  FileGifOutlined,
  LoadingOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function CreatePost({ userData, setFeed }) {
  const [loading, setLoading] = useState(false);
  const pictureRef = useRef();
  const navigate = useNavigate();
  const [image, setImage] = useState(false);
  const [newPost, setNewPost] = useState({
    description: "",
    picture: null,
  });

  const handleNewPost = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token, userId } = localStorage;
      if (!token || !userId) return navigate("/login");

      const postDataToSend = new FormData();
      postDataToSend.append("userId", userData._id);
      for (const key in newPost) {
        postDataToSend.append(key, newPost[key]);
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/posts`,
        {
          method: "POST",
          body: postDataToSend,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status >= 200 && response.status <= 210) {
        const data = await response.json();
        setFeed((posts) => {
          const postsArray = Object.values(posts);
          postsArray.unshift(data);
          return postsArray;
        });

        setNewPost({ description: "", picture: null });
        pictureRef.current.value = "";
        setImage(false);
      } else if (response.status === 403) {
        return navigate("/login");
      } else {
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      console.log(error.message);
    }
    setLoading(false);
  };

  return (
    <Card customStyle="w-full">
      <form
        className="flex flex-col gap-4"
        encType="multipart/form-data"
        onSubmit={handleNewPost}
      >
        <div className="flex md:flex-row flex-col gap-4 items-center justify-center">
          <img
            src={userData?.userPicturePath}
            className="size-14 rounded-full object-cover"
          />
          <input
            className="application-grey outline-none placeholder:text-sm py-4 px-6 rounded-full flex-1 w-full"
            type="text"
            name="description"
            placeholder="What's on your mind..."
            value={newPost.description}
            onChange={(e) =>
              setNewPost((post) => ({
                ...post,
                [e.target.name]: e.target.value,
              }))
            }
            autoComplete="off"
          />
        </div>
        <input
          ref={pictureRef}
          type="file"
          id="picture"
          name="picture"
          accept="image/jpeg, image/jpg, image/png"
          hidden
          onChange={(e) => {
            setNewPost((post) => ({
              ...post,
              [e.target.name]: e.target.files[0],
            }));
            setImage(URL.createObjectURL(e.target.files[0]));
          }}
        />
        {image && (
          <img
            className="max-h-[800px] p-0.5 object-contain border-2 border-sky-600"
            src={image}
          />
        )}
        <hr className="mb-2" />
        <div className="flex flex-col md:flex-row gap-4 justify-evenly items-center">
          <div className="flex-grow flex items-center gap-2 md:gap-4">
            <button type="button">
              <label
                htmlFor="picture"
                className="bg-blue-800 hover:bg-blue-600 text-white rounded-sm cursor-pointer text-center p-2 py-1 md:p-4 md:py-2"
              >
                Upload Image
              </label>
            </button>
            <button type="button">
              <label
                htmlFor=""
                className="bg-blue-800 hover:bg-blue-600 text-white rounded-sm cursor-pointer text-center p-2 py-1 md:p-4 md:py-2"
              >
                Upload Clip
              </label>
            </button>
          </div>
          {loading ? (
            <LoadingOutlined className="text-5xl text-sky-600" />
          ) : (
            <button
              type="submit"
              className="bg-sky-800 hover:bg-sky-600 text-white p-4 py-2 rounded-sm"
            >
              POST
            </button>
          )}
        </div>
      </form>
    </Card>
  );
}
