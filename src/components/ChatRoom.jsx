import React, { useEffect, useState } from "react";
import Card from "./Card";
import Friend from "./Friend";
import { Link, Outlet } from "react-router-dom";

export default function ChatRoom() {
  const [friendList, setFriendList] = useState();
  const { access_token: token, userId } = localStorage;

  useEffect(() => {
    !(async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/user/${userId}/friends`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
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
    })();
  }, []);

  return (
    <div className="flex">
      <Card customWidth="w-[30%] h-screen">
        <h1>Chat Rooms</h1>
        {!friendList?.hasOwnProperty("error") && (
          <div className="flex flex-col gap-4">
            {friendList?.map((friend) => (
              <Link key={friend?.userId} to={friend?.userId}>
                <Friend
                  userId={userId}
                  friendList={friendList}
                  setFriendList={setFriendList}
                  data={friend}
                  isHidden
                />
              </Link>
            ))}
          </div>
        )}
      </Card>
      <Outlet />
    </div>
  );
}
