import React, { useState } from "react";
import Card from "./Card";
import {
  AudioFilled,
  FileGifOutlined,
  FileImageOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function CreatePost({ userData, setFeed }) {
  const navigate = useNavigate();
  const [showImageTab, setShowImageTab] = useState(false);
  const [newPost, setNewPost] = useState({
    description: "",
    picture: null,
  });

  const handleNewPost = async (e) => {
    e.preventDefault();
    const postDataToSend = new FormData();
    newPost.userId = userData._id;
    for (const key in newPost) {
      postDataToSend.append(key, newPost[key]);
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) return navigate("/login");
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
      if (response.status === 200) {
        const newFeed = await response.json();
        setFeed(newFeed);
      } else if (response.status === 403) return navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Card customWidth="w-full">
      <form
        className="flex flex-col gap-4"
        encType="multipart/form-data"
        onSubmit={handleNewPost}
      >
        <div className="flex gap-4 items-center">
          <img
            src={userData?.userPicturePath}
            className="size-14 rounded-full object-cover"
          />
          <input
            className="application-grey outline-none ml-2 placeholder:text-sm py-4 px-6 rounded-full flex-1"
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
        <div className="flex gap-2 justify-between mx-2">
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
          <button
            type="submit"
            className="text-sky-50 font-bold text-sm bg-sky-400 hover:bg-sky-300 px-4 pt-2 pb-1.5 rounded-full"
          >
            POST
          </button>
        </div>
      </form>
    </Card>
  );
}
