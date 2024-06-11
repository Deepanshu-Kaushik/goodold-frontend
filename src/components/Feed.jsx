import React, { useState } from "react";
import Card from "./Card";
import {
  CommentOutlined,
  HeartFilled,
  HeartOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import Friend from "./Friend";
import { useNavigate } from "react-router-dom";
import checkToken from "../utils/checkToken";
import apiRequest from "../utils/apiRequest";

export default function Feed({
  userId,
  friendList,
  setFriendList,
  feed,
  setFeed,
}) {
  const [commentsShown, setCommentsShown] = useState([]);
  const navigate = useNavigate();

  async function handleLikeDislike(postId) {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return navigate("/login");
      const validateToken = await checkToken(token);
      if (validateToken.hasOwnProperty("error")) {
        localStorage.removeItem("access_token");
        return navigate("/login");
      }
      await apiRequest(
        `${import.meta.env.VITE_BACKEND_URL}/posts/${postId}/like`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
          }),
        },
        (updatedPost) =>
          setFeed((feed) =>
            feed.map((post) => {
              if (post.postId === updatedPost.postId) return updatedPost;
              else return post;
            })
          )
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="space-y-4 my-2 w-full" key={feed?.length}>
      {feed?.map((post) => (
        <Card key={post.postId} customWidth="w-full">
          <div className="flex flex-col gap-4">
            <Friend
              userId={userId}
              friendList={friendList}
              setFriendList={setFriendList}
              data={post}
            />
            <h3 className="text-sm text-slate-600">{post?.description}</h3>
            <img
              src={post?.postPicturePath}
              className="object-contain max-h-[800px] rounded-xl"
            />
            <div className="mx-3 flex justify-between items-center text-gray-500">
              <div className="flex items-center space-x-6">
                <button
                  className="flex items-center space-x-1"
                  onClick={() => handleLikeDislike(post.postId)}
                >
                  {Object.keys(post?.likes).includes(userId) ? (
                    <HeartFilled style={{ fontSize: "20px", color: "red" }} />
                  ) : (
                    <HeartOutlined style={{ fontSize: "20px" }} />
                  )}
                  <span>{Object.keys(post?.likes).length}</span>
                </button>
                <button
                  className="flex items-center space-x-1"
                  onClick={() =>
                    setCommentsShown((prevIds) => {
                      if (prevIds.includes(post.postId))
                        return [...prevIds].filter((id) => id !== post.postId);
                      else return [...prevIds, post.postId];
                    })
                  }
                >
                  <CommentOutlined style={{ fontSize: "20px" }} />
                  <span>{post?.comments.length}</span>
                </button>
              </div>
              <button>
                <ShareAltOutlined style={{ fontSize: "20px" }} />
              </button>
            </div>
          </div>
          {commentsShown.includes(post.postId) && (
            <div className="mt-4">
              {post.comments.map((comment, index) => (
                <div key={index}>
                  <hr />
                  <div className="text-xs m-2 text-gray-400 font-semibold">
                    {comment}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
