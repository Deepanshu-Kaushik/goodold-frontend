import React, { useEffect, useState } from "react";
import UserInfo from "./UserInfo";
import CreatePost from "./CreatePost";
import FriendList from "./FriendList";
import Feed from "./Feed";
import { useNavigate, useParams } from "react-router-dom";
import checkToken from "../utils/checkToken";

export default function HomePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [friendList, setFriendList] = useState(null);
  const [feed, setFeed] = useState(null);
  const token = localStorage.getItem("access_token");

  const { userId } = useParams();

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
        navigate("/login");
      } else {
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      handleTokenError();
    }
  };

  const handleTokenError = async () => {
    try {
      const validateToken = await checkToken(token);
      if (validateToken.hasOwnProperty("error")) {
        localStorage.removeItem("access_token");
        navigate("/login");
      }
    } catch (error) {
      localStorage.removeItem("access_token");
      navigate("/login");
    }
  };

  useEffect(() => {
    if (!token) {
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
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[90%] m-auto flex lg:flex-row flex-col pt-6 gap-10">
      <div className="flex-1 lg:w-[20%]">
        <UserInfo userData={userData} friends={friendList?.length} />
      </div>
      <div className="flex flex-col flex-1 gap-4">
        <CreatePost userData={userData} setFeed={setFeed} />
        <Feed
          userId={userId}
          friendList={friendList}
          setFriendList={setFriendList}
          feed={feed}
          setFeed={setFeed}
        />
      </div>
      <div className="flex-1 lg:w-[20%]">
        <FriendList
          userId={userId}
          friendList={friendList}
          setFriendList={setFriendList}
        />
      </div>
    </div>
  );
}
