import React from "react";
import Card from "./Card";
import {
  PushpinOutlined,
  SettingOutlined,
  WalletFilled,
} from "@ant-design/icons";

export default function UserInfo({ userData, friends }) {
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
              <div className="font-medium text-slate-600">
                {userData?.firstName} {userData?.lastName}
              </div>
              <div className="text-xs text-slate-600">{friends} friends</div>
            </div>
          </div>
          <SettingOutlined className="cursor-pointer" />
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
