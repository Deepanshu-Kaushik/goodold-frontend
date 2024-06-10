import React, { useEffect, useState } from "react";
import UserInfo from "./UserInfo";
import CreatePost from "./CreatePost";
import FriendList from "./FriendList";
import Feed from "./Feed";
import { useNavigate, useParams } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState();
  const [friendList, setFriendList] = useState();
  const [feed, setFeed] = useState();
  const token = localStorage.getItem("access_token");
  
  const { userId } = useParams();
  useEffect(() => {
    if (!token) return navigate("/");
    !(async function () {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) setUserData(await response.json());
        else if (response.status === 403) return navigate("/login");
      } catch (error) {
        setUserData({ error: error.message });
      }
    })();
    !(async function () {
      let response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/${userId}/friends`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        const friendList = await response.json();
        setFriendList(friendList);
      } else if (response.status === 403) return navigate("/login");
    })();
    !(async function () {
      let response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const feed = await response.json();
        setFeed(feed);
      } else if (response.status === 403) return navigate("/login");
    })();
  }, [userId]);

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
