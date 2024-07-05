import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAddOutlined, UserDeleteOutlined } from "@ant-design/icons";

export default function Friend({
  friendList,
  userId: profileId,
  setFriendList,
  data,
  isHidden = false,
}) {
  const navigate = useNavigate();
  const { access_token: token, userId } = localStorage;
  const friendsIds = friendList?.map((friend) => friend.userId) || [];

  async function handleAddRemoveFriend(friendId) {
    if (userId === friendId) return;
    if (!token || !userId) return navigate("/login");

    let url;
    if (userId === profileId)
      url = `${import.meta.env.VITE_BACKEND_URL}/user/${userId}/${friendId}`;
    else url = `${import.meta.env.VITE_BACKEND_URL}/user/${friendId}/${userId}`;

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status >= 200 && response.status <= 210) {
        const data = await response.json();
        setFriendList(data);
      } else if (response.status === 403) {
        return navigate("/login");
      } else {
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="flex items-center justify-between select-none">
      <div className="flex gap-4 items-center">
        <img
          src={data?.userPicturePath}
          className="size-12 rounded-full object-cover"
        />
        <div>
          <div className="font-medium text-slate-600">
            {data?.firstName} {data?.lastName}
          </div>
          <div className="text-xs text-slate-600">{data.location}</div>
        </div>
      </div>
      {friendsIds.includes(userId === profileId ? data?.userId : userId) ? (
        <UserDeleteOutlined
          className="cursor-pointer mx-2 text-cyan-700 bg-sky-200 p-3 rounded-full"
          hidden={userId === data?.userId || isHidden ? true : false}
          onClick={(e) => {
            e.preventDefault();
            handleAddRemoveFriend(data?.userId);
          }}
        />
      ) : (
        <UserAddOutlined
          className="cursor-pointer mx-2 text-cyan-700 bg-sky-200 p-3 rounded-full"
          hidden={userId === data?.userId || isHidden ? true : false}
          onClick={(e) => {
            e.preventDefault();
            handleAddRemoveFriend(data?.userId);
          }}
        />
      )}
    </div>
  );
}
