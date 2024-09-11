import { NavigateFunction } from 'react-router-dom';

type OnSendCommentNotificationType = {
  token: string;
  userId: string;
  navigate: NavigateFunction;
  postOwnerId: string | undefined;
  postId: string | undefined;
  commentOnPost: string;
  commentId: string;
};

export default async function onSendCommentNotification({
  token,
  userId,
  navigate,
  postOwnerId,
  postId,
  commentOnPost,
  commentId,
}: OnSendCommentNotificationType) {
  try {
    if (!token || !userId) return navigate('/login');
    if (!postOwnerId || !postId || userId === postOwnerId || !commentOnPost.length) return;
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/notification/comment`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: postOwnerId,
        createrId: userId,
        postId,
        commentOnPost,
        commentId,
      }),
    });

    if (response.status === 403) {
      return navigate('/login');
    } else if (!(response.status >= 200 && response.status <= 210)) {
      throw new Error('Something went wrong!');
    }
  } catch (error) {
    console.log(error);
  }
}
