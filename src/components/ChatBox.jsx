import {
  ArrowLeftOutlined,
  LoadingOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

export default function ChatBox({ friend, setIsChatOpen }) {
  const { userId: friendId, firstName, lastName } = friend;
  const [loading, setLoading] = useState(false);
  const [pendingMessage, setPendingMessage] = useState(false);
  const { access_token: token, userId, userPicturePath } = localStorage;
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const chatsRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io(import.meta.env.VITE_BACKEND_URL, {
      query: {
        userId,
      },
    });
    socket.on("newMessage", (newMessage) => {
      setAllMessages((prev) => {
        const messages = prev.slice();
        messages.push(newMessage);
        return messages;
      });
      setTimeout(() => {
        chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
      }, 10);
    });

    const getAllMessages = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/message/${friendId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status >= 200 && response.status <= 210) {
          const data = await response.json();
          setAllMessages(data);
          setLoading(false);
          chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
        } else if (response.status === 403) {
          return navigate("/login");
        } else {
          throw new Error("Something went wrong!");
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getAllMessages();
    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [friendId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setPendingMessage(true);
    if (!message) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/message/send/${friendId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }
      );

      if (response.status >= 200 && response.status <= 210) {
        const data = await response.json();
        setAllMessages((prev) => {
          const messages = prev.slice();
          messages.push(data);
          return messages;
        });
      } else if (response.status === 403) {
        return navigate("/login");
      } else {
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      console.log(error.message);
    }
    setMessage("");
    setTimeout(() => {
      chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
      setPendingMessage(false);
    }, 10);
  };

  return (
    <div className="flex-1 lg:max-w-[80%] flex flex-col justify-center">
      <div className="flex items-center gap-4">
        <button
          className="md:hidden p-1 rounded-full hover:bg-slate-200"
          onClick={() =>
            setIsChatOpen((prev) => (prev?.userId === friendId ? null : friend))
          }
        >
          <ArrowLeftOutlined />
        </button>
        <h1 className="font-bold text-xl md:text-3xl">
          {firstName} {lastName}
        </h1>
      </div>
      <hr className="my-2" />
      <div className="flex flex-col overflow-y-auto h-full" ref={chatsRef}>
        {!loading ? (
          allMessages?.map((message) => (
            <div
              key={message._id}
              className={`flex m-1 md:m-2 gap-1 md:gap-2 ${
                message?.senderId === userId ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <img
                src={
                  message?.senderId === userId
                    ? userPicturePath
                    : friend?.userPicturePath
                }
                className="size-6 md:size-12 rounded-full object-cover"
              />
              <div
                className={`${
                  message?.senderId === userId
                    ? "bg-sky-600 text-white"
                    : "bg-gray-200"
                } p-3 rounded-xl max-w-[70%]`}
              >
                {message.message}
              </div>
            </div>
          ))
        ) : (
          <LoadingOutlined className="text-5xl text-sky-600" />
        )}
      </div>
      <form
        className="flex bg-gray-200 rounded-lg py-2 px-4 mt-4 items-center"
        onSubmit={handleSendMessage}
      >
        <input
          type="text"
          placeholder="Message..."
          className="flex-1 bg-transparent outline-none p-1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="flex">
          {pendingMessage ? (
            <LoadingOutlined
              className="text-blue-600"
              style={{ fontSize: "20px" }}
            />
          ) : (
            <SendOutlined
              className="text-blue-600"
              style={{ fontSize: "20px" }}
            />
          )}
        </button>
      </form>
    </div>
  );
}
