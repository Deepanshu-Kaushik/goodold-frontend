import React from "react";
import Card from "./Card";
import Friend from "./Friend";
import { Link } from "react-router-dom";

export default function FriendList({ userId, friendList, setFriendList }) {
  return (
    <>
      <Card customStyle="w-full">
        <h1 className="mb-4">Friend List</h1>
        {!friendList?.hasOwnProperty("error") && (
          <div className="flex flex-col gap-4">
            {friendList?.map((friend) => (
              <Link to={'/profile/'+friend?.userId} key={friend?.userId}>
                <Friend
                  userId={userId}
                  friendList={friendList}
                  setFriendList={setFriendList}
                  data={friend}
                />
              </Link>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
