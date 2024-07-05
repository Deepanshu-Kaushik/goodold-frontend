import React from "react";
import Card from "./Card";
import {
  PushpinOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  WalletFilled,
} from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";

export default function UserInfo({ userData, friendList, setFriendList }) {
  const { profileId } = useParams();
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
    <Card customStyle="w-full">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <img
              src={userData?.userPicturePath}
              className="size-12 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <Link
                to={"/profile/" + userData?._id}
                className="font-medium text-slate-600"
              >
                {userData?.firstName} {userData?.lastName}
              </Link>
              <div className="text-xs text-slate-600">
                {friendList?.length} friends
              </div>
            </div>
          </div>
          {profileId &&
            userId !== profileId &&
            (!friendsIds?.includes(userId) ? (
              <UserAddOutlined
                className="cursor-pointer mx-2 text-cyan-700 bg-sky-200 p-3 rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddRemoveFriend(profileId);
                }}
              />
            ) : (
              <UserDeleteOutlined
                className="cursor-pointer mx-2 text-cyan-700 bg-sky-200 p-3 rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddRemoveFriend(profileId);
                }}
              />
            ))}
        </div>
        <hr />
        <div className="flex flex-col gap-2">
          <div className="flex gap-4">
            <PushpinOutlined />
            {userData?.location}
          </div>
          <div className="flex gap-4">
            <WalletFilled />
            {userData?.occupation}
          </div>
        </div>
        <hr />
        <div className="text-sm text-gray-400">
          <div className="flex justify-between">
            <h1>Who's viewed your profile</h1>
            <div className="text-gray-600 font-semibold text-xs">
              {userData?.viewedProfile}
            </div>
          </div>
          <div className="flex justify-between">
            <h1>Impressions of your post</h1>
            <div className="text-gray-600 font-semibold text-xs">
              {userData?.impressions}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
