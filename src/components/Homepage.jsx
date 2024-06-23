import React, { useEffect, useState } from "react";
import UserInfo from "./UserInfo";
import CreatePost from "./CreatePost";
import FriendList from "./FriendList";
import Feed from "./Feed";
import { useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";

export default function HomePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [friendList, setFriendList] = useState(null);
  const [feed, setFeed] = useState(null);
  const { access_token: token, userId } = localStorage;

  const fetchData = async (url, setter) => {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setter(data);
      } else if (response.status === 403) {
        return navigate("/login");
      } else {
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (!token || !userId) {
      navigate("/login");
      return;
    }

    const getUserData = fetchData(
      `${import.meta.env.VITE_BACKEND_URL}/user/${userId}`,
      setUserData
    );
    const getFriendList = fetchData(
      `${import.meta.env.VITE_BACKEND_URL}/user/${userId}/friends`,
      setFriendList
    );
    const getFeed = fetchData(
      `${import.meta.env.VITE_BACKEND_URL}/posts`,
      setFeed
    );

    Promise.all([getUserData, getFriendList, getFeed]);
  }, [userId]);

  if (!userData || !friendList || !feed) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingOutlined className="text-5xl text-sky-600" />
      </div>
    );
  }

  return (
    <div className="w-[90%] m-auto flex lg:flex-row flex-col py-6 gap-10">
      <div className="flex flex-col gap-4 lg:w-[30%]">
        <UserInfo userData={userData} friends={friendList?.length} />
        <FriendList
          userId={userId}
          friendList={friendList}
          setFriendList={setFriendList}
        />
      </div>
      <div className="flex flex-col flex-1 gap-4">
        <CreatePost userData={userData} setFeed={setFeed} />
        <Feed
          friendList={friendList}
          setFriendList={setFriendList}
          feed={feed}
          setFeed={setFeed}
        />
      </div>
    </div>
  );
}
