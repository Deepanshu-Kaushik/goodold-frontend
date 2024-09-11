import { NavigateFunction } from 'react-router-dom';
import { PostType } from '../types/post-type';
import { loadingState } from '../constants/loading-state';

interface CommonFeedType {
  token: string;
  userId: string | undefined;
  postId: string | undefined;
  navigate: NavigateFunction;
  setFeed: React.Dispatch<React.SetStateAction<PostType[]>>;
}

interface OnHandleLikeDislike_PostDeleteType extends CommonFeedType {
  setLoading: React.Dispatch<React.SetStateAction<string | null>>;
}

interface OnHandlePostEditType extends CommonFeedType {
  description: string;
  setIsEditing: React.Dispatch<React.SetStateAction<string | undefined | null>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
}

interface OnHandleNewCommentType extends CommonFeedType {
  comment: string;
}

interface OnHandleCommentDeleteType {
  token: string;
  userId: string | undefined;
  commentId: string;
  navigate: NavigateFunction;
  setFeed: React.Dispatch<React.SetStateAction<PostType[]>>;
}

async function onHandleLikeDislike({
  token,
  userId,
  postId,
  navigate,
  setLoading,
  setFeed,
}: OnHandleLikeDislike_PostDeleteType) {
  try {
    if (!token || !userId) return navigate('/login');
    if (!postId) return;
    setLoading(loadingState[0]);
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts/${postId}/like`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
      }),
    });

    if (response.status >= 200 && response.status <= 210) {
      const updatedPost = await response.json();
      setFeed((feed) =>
        feed.map((post) => {
          if (post.postId === updatedPost.postId) return updatedPost;
          else return post;
        }),
      );
    } else if (response.status === 403) {
      return navigate('/login');
    } else {
      throw new Error('Something went wrong!');
    }
  } catch (error) {
    console.log(error);
  }
}

async function onHandlePostDelete({
  token,
  userId,
  postId,
  navigate,
  setLoading,
  setFeed,
}: OnHandleLikeDislike_PostDeleteType) {
  try {
    if (!token || !userId) return navigate('/login');
    setLoading(loadingState[1]);
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts/${postId}/delete`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
      }),
    });

    if (response.status >= 200 && response.status <= 210) {
      setFeed((feed) => feed.filter((post) => postId !== post.postId));
    } else if (response.status === 403) {
      return navigate('/login');
    } else {
      throw new Error('Something went wrong!');
    }
  } catch (error) {
    console.log(error);
  }
}

async function onHandlePostEdit({
  token,
  userId,
  postId,
  navigate,
  description,
  setFeed,
  setIsEditing,
  setDescription,
}: OnHandlePostEditType) {
  try {
    if (!token || !userId) return navigate('/login');
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts/${postId}/edit`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        description,
      }),
    });

    if (response.status >= 200 && response.status <= 210) {
      const updatedPost = await response.json();
      setFeed((feed) =>
        feed.map((post) => {
          if (post.postId === updatedPost.postId) return updatedPost;
          else return post;
        }),
      );
      setIsEditing(null);
      setDescription('');
    } else if (response.status === 403) {
      return navigate('/login');
    } else {
      throw new Error('Something went wrong!');
    }
  } catch (error) {
    console.log(error);
  }
}

async function onHandleNewComment({ token, userId, navigate, postId, comment, setFeed }: OnHandleNewCommentType) {
  try {
    if (!token || !userId) return navigate('/login');
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts/${postId}/comment`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        comment,
        userId,
      }),
    });

    if (response.status >= 200 && response.status <= 210) {
      const { updatedPost, newComment } = await response.json();
      setFeed((feed) =>
        feed.map((post) => {
          if (post.postId === updatedPost.postId) return updatedPost;
          else return post;
        }),
      );
      return newComment;
    } else if (response.status === 403) {
      return navigate('/login');
    } else {
      throw new Error('Something went wrong!');
    }
  } catch (error) {
    console.log(error);
  }
}

async function onHandleCommentDeleteType({ token, navigate, commentId, setFeed, userId }: OnHandleCommentDeleteType) {
  try {
    if (!token || !userId) return navigate('/login');
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts/${commentId}/comment-delete`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
      }),
    });

    if (response.status >= 200 && response.status <= 210) {
      const { updatedPost } = await response.json();
      setFeed((feed) =>
        feed.map((post) => {
          if (post.postId === updatedPost._id) return updatedPost;
          else return post;
        }),
      );
    } else if (response.status === 403) {
      return navigate('/login');
    } else {
      throw new Error('Something went wrong!');
    }
  } catch (error) {
    console.log(error);
  }
}

export { onHandleLikeDislike, onHandleNewComment, onHandlePostDelete, onHandlePostEdit, onHandleCommentDeleteType };
