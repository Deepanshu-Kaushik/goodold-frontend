import React from "react";
import { useNavigate } from "react-router-dom";
import { UserAddOutlined, UserDeleteOutlined } from "@ant-design/icons";
import checkToken from "../utils/checkToken";
import apiRequest from "../utils/apiRequest";

export default function Friend({ userId, friendList, setFriendList, data }) {
  const navigate = useNavigate();
  const friendsIds = friendList?.map((friend) => friend.userId) || [];

  async function handleAddRemoveFriend(friendId) {
    if (userId === friendId) return;
    const token = localStorage.getItem("access_token");
    if (!token) return navigate("/login");
    const validateToken = await checkToken(token);
      if (validateToken.hasOwnProperty("error")) {
        localStorage.removeItem("access_token");
        return navigate("/login");
      }

    try {
      await apiRequest(
        `${import.meta.env.VITE_BACKEND_URL}/user/${userId}/${friendId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        setFriendList
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="flex items-center justify-between">
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
      {friendsIds.includes(data?.userId) ? (
        <UserDeleteOutlined
          className="cursor-pointer mx-2 text-cyan-700 bg-sky-200 p-3 rounded-full"
          hidden={userId === data?.userId ? true : false}
          onClick={() => handleAddRemoveFriend(data?.userId)}
        />
      ) : (
        <UserAddOutlined
          className="cursor-pointer mx-2 text-cyan-700 bg-sky-200 p-3 rounded-full"
          hidden={userId === data?.userId ? true : false}
          onClick={() => handleAddRemoveFriend(data?.userId)}
        />
      )}
    </div>
  );
}
