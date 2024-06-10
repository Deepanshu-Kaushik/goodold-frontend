import React from "react";
import Card from "./Card";
import Friend from "./Friend";

export default function FriendList({ userId, friendList, setFriendList }) {
  return (
    <div>
      <Card customWidth="w-full">
        <h1>Friend List</h1>
        {!friendList?.hasOwnProperty("error") && (
          <div className="flex flex-col gap-4">
            {friendList?.map((friend) => (
              <Friend
                key={friend?.userId}
                userId={userId}
                friendList={friendList}
                setFriendList={setFriendList}
                data={friend}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
