import React, { useRef, useState } from "react";
import Card from "./Card";
import {
  AudioFilled,
  FileGifOutlined,
  FileImageOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import checkToken from "../utils/checkToken";
import apiRequest from "../utils/apiRequest";

export default function CreatePost({ userData, setFeed }) {
  const pictureRef = useRef();
  const navigate = useNavigate();
  const [showImageTab, setShowImageTab] = useState(false);
  const [newPost, setNewPost] = useState({
    description: "",
    picture: null,
  });

  const handleNewPost = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return navigate("/login");
      const validateToken = await checkToken(token);
      if (validateToken.hasOwnProperty("error")) {
        localStorage.removeItem("access_token");
        return navigate("/login");
      }

      const postDataToSend = new FormData();
      postDataToSend.append("userId", userData._id);
      for (const key in newPost) {
        postDataToSend.append(key, newPost[key]);
      }

      const useFeed = (newFeed) => {
        setFeed(newFeed);
        setNewPost({ description: "", picture: null });
        pictureRef.current.value = "";
      };

      await apiRequest(
        `${import.meta.env.VITE_BACKEND_URL}/posts`,
        {
          method: "POST",
          body: postDataToSend,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        useFeed
      );
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
