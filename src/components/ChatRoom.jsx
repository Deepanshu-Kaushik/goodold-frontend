import { useEffect, useState } from "react";
import Card from "./Card";
import Friend from "./Friend";
import ChatBox from "./ChatBox";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function ChatRoom() {
  const [isChatOpen, setIsChatOpen] = useState(null);
  const [friendList, setFriendList] = useState();
  const { access_token: token, userId } = localStorage;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    !(async () => {
      setLoading(true);
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
      setLoading(false);
    })();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingOutlined className="text-5xl text-sky-600" />
      </div>
    );

  return (
    <div className="flex-grow p-3 overflow-hidden">
      <Card customStyle="h-full shadow-2xl shadow-blue-900 flex max-h-screen gap-4 justify-between">
        <div
          className={`md:flex flex-col gap-1 lg:w-[20%] ${
            isChatOpen ? "hidden" : "w-full"
          } `}
        >
          {!friendList?.hasOwnProperty("error") &&
            friendList?.map((friend) => (
              <div
                className={`cursor-pointer w-full p-2 rounded-lg hover:bg-slate-200 ${
                  isChatOpen?.userId === friend?.userId ? "bg-gray-200" : ""
                }`}
                onClick={() =>
                  setIsChatOpen((prev) =>
                    prev?.userId === friend?.userId ? null : friend
                  )
                }
                key={friend?.userId}
              >
                <Friend
                  userId={userId}
                  friendList={friendList}
                  setFriendList={setFriendList}
                  data={friend}
                  isHidden
                />
              </div>
            ))}
        </div>
        {isChatOpen && (
          <ChatBox friend={isChatOpen} setIsChatOpen={setIsChatOpen} />
        )}
      </Card>
    </div>
  );
}
