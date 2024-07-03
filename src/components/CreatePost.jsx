import { useRef, useState } from "react";
import Card from "./Card";
import {
  AudioFilled,
  FileGifOutlined,
  FileImageOutlined,
  LoadingOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function CreatePost({ userData, setFeed }) {
  const [loading, setLoading] = useState(false);
  const pictureRef = useRef();
  const navigate = useNavigate();
  const [showImageTab, setShowImageTab] = useState(false);
  const [newPost, setNewPost] = useState({
    description: "",
    picture: null,
  });

  const handleNewPost = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { access_token: token, userId } = localStorage;
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
        setShowImageTab(false);
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
          />
        </div>
        {showImageTab && (
          <input
            ref={pictureRef}
            type="file"
            name="picture"
            accept="image/jpeg, image/jpg, image/png"
            onChange={(e) =>
              setNewPost((post) => ({
                ...post,
                [e.target.name]: e.target.files[0],
              }))
            }
          />
        )}
        <hr className="mb-2" />
        <div className="grid grid-cols-2 md:flex gap-2 justify-items-center md:justify-between w-full mx-2">
          <button
            type="button"
            className="flex gap-x-1 text-gray-500 text-sm "
            onClick={() => setShowImageTab((prev) => !prev)}
          >
            <FileImageOutlined style={{ fontSize: "20px" }} />
            <span>Image</span>
          </button>
          <button type="button" className="flex gap-x-1 text-gray-500 text-sm ">
            <FileGifOutlined style={{ fontSize: "20px" }} />
            <span>Clip</span>
          </button>
          <button type="button" className="flex gap-x-1 text-gray-500 text-sm ">
            <PaperClipOutlined style={{ fontSize: "20px" }} />
            <span>Attachment</span>
          </button>
          <button type="button" className="flex gap-x-1 text-gray-500 text-sm ">
            <AudioFilled style={{ fontSize: "20px" }} />
            <span>Audio</span>
          </button>
        </div>
        {loading ? (
          <LoadingOutlined className="text-5xl text-sky-600" />
        ) : (
          <button
            type="submit"
            className="text-sky-50 font-bold text-sm bg-sky-400 hover:bg-sky-300 px-4 pt-2 pb-1.5 rounded-full"
          >
            POST
          </button>
        )}
      </form>
    </Card>
  );
}
