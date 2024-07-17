import { useState } from "react";
import Card from "../Card";
import {
  CheckCircleFilled,
  CommentOutlined,
  DeleteFilled,
  EditFilled,
  HeartFilled,
  HeartOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import Friend from "../Friends/Friend";
import { Link, useNavigate } from "react-router-dom";

export default function Feed({
  friendList,
  setFriendList,
  feed,
  setFeed,
  userId: profileId,
}) {
  const [commentsShown, setCommentsShown] = useState([]);
  const [loading, setLoading] = useState(null);
  const [isEditing, setIsEditing] = useState();
  const [description, setDescription] = useState("");
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const { token, userId } = localStorage;
  const loadingState = [
    "like-button",
    "delete-button",
    "edit-button",
    "comment-button",
  ];

  async function handleLikeDislike(postId) {
    try {
      if (!token || !userId) return navigate("/login");
      setLoading(loadingState[0]);
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
    setLoading(null);
  }

  async function handlePostDelete(postId) {
    try {
      if (!token || !userId) return navigate("/login");
      setLoading(loadingState[1]);
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
    setLoading(null);
  }

  async function handlePostEdit(postId) {
    if (!description) return;
    setLoading(loadingState[2]);
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
    setLoading(null);
  }

  async function handleNewComment(e, postId) {
    e.preventDefault();
    if (!comment) return;
    setLoading(loadingState[3]);
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
    setLoading(false);
  }

  return (
    <div className="space-y-4 my-2 w-full pb-6" key={feed?.length}>
      {feed?.map((post) => (
        <Card key={post.postId} customStyle="w-full">
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
                {!(loading === loadingState[0]) ? (
                  <button
                    className="flex items-center space-x-1 w-[50%]"
                    onClick={() => handleLikeDislike(post.postId)}
                  >
                    {Object.keys(post?.likes).includes(userId) ? (
                      <HeartFilled style={{ fontSize: "20px", color: "red" }} />
                    ) : (
                      <HeartOutlined style={{ fontSize: "20px" }} />
                    )}
                    <span>{Object.keys(post?.likes).length}</span>
                  </button>
                ) : (
                  <LoadingOutlined
                    style={{ fontSize: "24px" }}
                    className="mx-1 w-[50%] text-sky-600"
                  />
                )}
                <button
                  className="flex items-center space-x-1 w-[50%]"
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
              <div className="flex gap-2 items-center">
                {!(loading === loadingState[1]) ? (
                  userId === post?.userId && (
                    <DeleteFilled
                      className="cursor-pointer text-red-700 bg-red-200 p-3 rounded-full w-1/2"
                      onClick={() => handlePostDelete(post?.postId)}
                    />
                  )
                ) : (
                  <LoadingOutlined
                    style={{ fontSize: "24px" }}
                    className="mx-1 w-[50%] text-sky-600"
                  />
                )}
                {userId === post?.userId && !isEditing && (
                  <EditFilled
                    className="cursor-pointer text-yellow-700 bg-yellow-200 p-3 rounded-full w-1/2"
                    onClick={() => setIsEditing(post?.postId)}
                  />
                )}
                {!(loading === loadingState[2]) ? (
                  userId === post?.userId &&
                  isEditing === post?.postId && (
                    <CheckCircleFilled
                      className="w-1/2 rounded-full"
                      onClick={() => handlePostEdit(post?.postId)}
                      style={{ fontSize: "36px", color: "green" }}
                    />
                  )
                ) : (
                  <LoadingOutlined
                    style={{ fontSize: "24px" }}
                    className="mx-1 w-[50%] text-sky-600"
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
                  className="flex md:flex-row flex-col justify-between gap-2 my-3 -mb-2"
                  onSubmit={(e) => handleNewComment(e, post.postId)}
                >
                  <input
                    type="text"
                    name="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    autoComplete="off"
                    className="outline-sky-800 p-1 w-full flex-1 border-2 border-sky-600"
                  />
                  {!(loading === loadingState[3]) ? (
                    <button className="text-sky-50 text-sm bg-sky-800 hover:bg-sky-600 px-2 rounded-sm">
                      Comment
                    </button>
                  ) : (
                    <LoadingOutlined className="text-2xl text-sky-600" />
                  )}
                </form>
              </>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
