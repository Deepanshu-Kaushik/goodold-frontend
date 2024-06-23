import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "./Card";
import io from "socket.io-client";

export default function ChatBox() {
  const { friendId } = useParams();
  const { userId } = localStorage;
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.emit("join-room", userId, friendId);

    socket.on("response-message", (message) => {
      setAllMessages((prev) => {
        const oldArray = [...prev].slice();
        oldArray.push(message);
        return oldArray;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [friendId, userId]);

  const handleSendMessage = () => {
    const socket = io("http://localhost:3001");
    socket.emit("send-message", message);
    setMessage("");
  };

  return (
    <div className="flex-1">
      <Card className="w-full">
        <div className="overflow-y-auto w-[90%] border-2 h-96 flex flex-col" key={friendId}>
          {allMessages?.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </div>
        <div className="flex gap-4 justify-around my-4">
          <input
            type="text"
            name="message"
            id="message"
            className="ring ring-sky-400 flex-1"
            placeholder="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-sky-400 text-white rounded-full"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </Card>
    </div>
  );
}
