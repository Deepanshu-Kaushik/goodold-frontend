import { useState } from "react";
import Card from "./Card";
import {
  CheckCircleFilled,
  CommentOutlined,
  DeleteFilled,
  EditFilled,
  HeartFilled,
  HeartOutlined,
} from "@ant-design/icons";
import Friend from "./Friend";
import { Link, useNavigate } from "react-router-dom";

export default function Feed({
  friendList,
  setFriendList,
  feed,
  setFeed,
  userId: profileId,
}) {
  const [commentsShown, setCommentsShown] = useState([]);
  const [isEditing, setIsEditing] = useState();
  const [description, setDescription] = useState("");
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const { access_token: token, userId } = localStorage;

  async function handleLikeDislike(postId) {
    try {
      if (!token || !userId) return navigate("/login");

      const response = await fetch(
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
        }
      );

      if (response.status >= 200 && response.status <= 210) {
        const updatedPost = await response.json();
        setFeed((feed) =>
          feed.map((post) => {
            if (post.postId === updatedPost.postId) return updatedPost;
            else return post;
          })
        );
      } else if (response.status === 403) {
        return navigate("/login");
      } else {
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async function handlePostEdit(postId) {
    if (!description) return;

    try {
      if (!token || !userId) return navigate("/login");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/posts/${postId}/edit`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            description,
          }),
        }
      );

      if (response.status >= 200 && response.status <= 210) {
        const updatedPost = await response.json();
        setFeed((feed) =>
          feed.map((post) => {
            if (post.postId === updatedPost.postId) return updatedPost;
            else return post;
          })
        );
        setIsEditing(null);
        setDescription("");
      } else if (response.status === 403) {
        return navigate("/login");
      } else {
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async function handlePostDelete(postId) {
    try {
      if (!token || !userId) return navigate("/login");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/posts/${postId}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
          }),
        }
      );

      if (response.status >= 200 && response.status <= 210) {
        setFeed((feed) => feed.filter((post) => postId !== post.postId));
      } else if (response.status === 403) {
        return navigate("/login");
      } else {
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async function handleNewComment(e, postId) {
    e.preventDefault();
    if (!comment) return;

    try {
      if (!token || !userId) return navigate("/login");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/posts/${postId}/comment`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment,
          }),
        }
      );

      if (response.status >= 200 && response.status <= 210) {
        const updatedPost = await response.json();
        setFeed((feed) =>
          feed.map((post) => {
            if (post.postId === updatedPost.postId) return updatedPost;
            else return post;
          })
        );
        setComment("");
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
    <div className="space-y-4 my-2 w-full pb-6" key={feed?.length}>
      {feed?.map((post) => (
        <Card key={post.postId} customStyle="w-full ">
          <div className="flex flex-col gap-4">
            <Link
              to={"/profile/" + post?.userId}
              className="hover:bg-slate-200 p-2 w-full rounded-lg"
            >
              <Friend
                userId={profileId}
                friendList={friendList}
                setFriendList={setFriendList}
                data={post}
              />
            </Link>
            {!(isEditing === post?.postId) ? (
              <h3 className="text-sm text-slate-600">{post?.description}</h3>
            ) : (
              <input
                type="text"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={post?.description}
                className="outline-sky-400 p-2 border-2"
                autoComplete="off"
              />
            )}
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
              <div className="flex gap-2">
                {userId === post?.userId && (
                  <DeleteFilled
                    className="cursor-pointer text-red-700 bg-red-200 p-3 rounded-full"
                    onClick={() => handlePostDelete(post?.postId)}
                  />
                )}
                {userId === post?.userId && !isEditing && (
                  <EditFilled
                    className="cursor-pointer text-yellow-700 bg-yellow-200 p-3 rounded-full"
                    onClick={() => setIsEditing(post?.postId)}
                  />
                )}
                {userId === post?.userId && isEditing === post?.postId && (
                  <CheckCircleFilled
                    className="rounded-full"
                    onClick={() => handlePostEdit(post?.postId)}
                    style={{ fontSize: "36px", color: "green" }}
                  />
                )}
              </div>
            </div>
          </div>
          {commentsShown.includes(post.postId) && (
            <div className={post.comments.length ? "mt-4" : ""}>
              <>
                {post.comments.map((comment, index) => (
                  <div key={index}>
                    <hr />
                    <div className="text-xs m-2 text-gray-400 font-semibold">
                      {comment}
                    </div>
                  </div>
                ))}
                <form
                  className="flex md:flex-row flex-col items-center justify-between gap-2 my-2"
                  onSubmit={(e) => handleNewComment(e, post.postId)}
                >
                  <input
                    type="text"
                    name="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    autoComplete="off"
                    className="outline-sky-400 p-2 w-full flex-1 border-2"
                  />
                  <button className="text-sky-50 text-sm bg-sky-400 hover:bg-sky-300 p-2 rounded-full">
                    Comment
                  </button>
                </form>
              </>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
