import { useEffect, useState } from 'react';
import Card from '../Card';
import {
  CommentOutlined,
  DeleteFilled,
  EditFilled,
  HeartFilled,
  HeartOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import Friend from '../Friends/Friend';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserType } from '../../types/user-type';
import { PostType } from '../../types/post-type';
import { loadingState } from '../../constants/loading-state';
import {
  onHandleCommentDeleteType,
  onHandleLikeDislike,
  onHandleNewComment,
  onHandlePostDelete,
  onHandlePostEdit,
} from '../../services/feed-handlers';
import onSendLikeNotification from '../../services/on-send-like-notification';
import onSendCommentNotification from '../../services/on-send-comment-notification';
import onRemoveNotification from '../../services/on-remove-notification';
import formatDate from '../../utils/formatDate';
import { FaCheck } from 'react-icons/fa';
import { TbHttpDelete } from 'react-icons/tb';
import { toast } from 'react-toastify';

type FeedType = {
  setFriendList: React.Dispatch<React.SetStateAction<UserType[]>>;
  feed: PostType[];
  setFeed: React.Dispatch<React.SetStateAction<PostType[]>>;
};

export default function Feed({ setFriendList, feed, setFeed }: FeedType) {
  const [commentsShown, setCommentsShown] = useState<any[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | undefined | null>(null);
  const [description, setDescription] = useState('');
  const [comment, setComment] = useState('');
  const navigate = useNavigate();
  const { token, userId } = localStorage;
  const { hash } = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [hash]);

  async function handleLikeDislike(postId: string | undefined) {
    await onHandleLikeDislike({ token, userId, postId, navigate, setLoading, setFeed });
    setLoading(null);
  }

  async function sendLikeNotification(postOwnerId: string | undefined, postId: string | undefined) {
    await onSendLikeNotification({ token, userId, navigate, postOwnerId, postId });
  }

  async function removeNotification(postOwnerId: string | undefined, postId: string | undefined) {
    const typeOfNotification = 'like';
    await onRemoveNotification({ token, userId, navigate, postOwnerId, postId, typeOfNotification });
  }

  async function handlePostDelete(postId: string | undefined) {
    await onHandlePostDelete({ token, userId, postId, navigate, setLoading, setFeed });
    setLoading(null);
  }

  async function handlePostEdit(postId: string | undefined) {
    if (!description) {
      setIsEditing(null);
      return;
    }
    setLoading(loadingState[2]);
    await onHandlePostEdit({ token, userId, postId, navigate, description, setFeed, setIsEditing, setDescription });
    setLoading(null);
  }

  async function handleNewComment(
    e: React.FormEvent<HTMLFormElement>,
    postId: string | undefined,
    postOwnerId: string | undefined,
  ) {
    e.preventDefault();
    if (!comment) return;
    setLoading(loadingState[3]);
    const newComment = comment;
    setComment('');
    const createdComment = await onHandleNewComment({ token, userId, navigate, postId, comment: newComment, setFeed });
    await sendCommentNotification(postOwnerId, postId, createdComment._id);
    setLoading(null);
  }

  async function sendCommentNotification(
    postOwnerId: string | undefined,
    postId: string | undefined,
    commentId: string,
  ) {
    await onSendCommentNotification({
      token,
      userId,
      navigate,
      postOwnerId,
      postId,
      commentOnPost: comment,
      commentId,
    });
  }

  async function handleCommentDelete(commentId: string) {
    await onHandleCommentDeleteType({ token, navigate, commentId, setFeed, userId });
  }

  return (
    <div className='space-y-4 my-2 w-full pb-6' key={feed?.length}>
      {feed?.map((post) => (
        <Card key={post.postId} customStyle='w-full dark:bg-lord-300'>
          <div className='flex flex-col gap-4'>
            <Link
              to={'/profile/' + post?.userId}
              className='hover:bg-slate-200 p-2 w-full rounded-lg dark:hover:bg-dark-400'
            >
              <Friend setFriendList={setFriendList} data={post} />
            </Link>
            {!(isEditing === post?.postId) ? (
              <h3 className='text-sm text-slate-600 dark:text-white'>{post?.description}</h3>
            ) : (
              <input
                type='text'
                name='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoFocus
                placeholder={post?.description}
                className='outline-sky-400 p-2 border-2 dark:outline-dark-600 dark:bg-dark-600 dark:placeholder:text-white dark:border-lord-200 dark:text-white'
                autoComplete='off'
              />
            )}
            <img id={post.postId} src={post?.postPicturePath} className='object-contain max-h-[800px] rounded-xl' />
            <div className='mx-3 flex justify-between items-center text-gray-500'>
              <div className='flex items-center space-x-6'>
                {!(loading === loadingState[0]) ? (
                  <button
                    className='flex items-center space-x-1 w-[50%]'
                    onClick={() => handleLikeDislike(post.postId)}
                  >
                    {post?.likes && Object.keys(post.likes).includes(userId) ? (
                      <HeartFilled
                        style={{ fontSize: '20px', color: 'red' }}
                        title='Dislike post'
                        onClick={() => {
                          removeNotification(post.userId, post.postId);
                          toast.success('Disliked post');
                        }}
                      />
                    ) : (
                      <HeartOutlined
                        className='dark:text-white'
                        title='Like post'
                        style={{ fontSize: '20px' }}
                        onClick={() => {
                          sendLikeNotification(post.userId, post.postId);
                          toast.success('Liked post');
                        }}
                      />
                    )}
                    <span className='dark:text-white'>{post?.likes && Object.keys(post?.likes).length}</span>
                  </button>
                ) : (
                  <LoadingOutlined style={{ fontSize: '24px' }} className='mx-1 w-[50%] text-sky-600' />
                )}
                <button
                  className='flex items-center space-x-1 w-[50%]'
                  onClick={() =>
                    setCommentsShown((prevIds) => {
                      if (prevIds.includes(post.postId)) return [...prevIds].filter((id) => id !== post.postId);
                      else return [...prevIds, post.postId];
                    })
                  }
                >
                  <CommentOutlined style={{ fontSize: '20px' }} className='dark:text-white' title='Comment' />
                  <span className='dark:text-white'>{post?.comments.length}</span>
                </button>
              </div>
              <div className='flex gap-2 items-center'>
                {!(loading === loadingState[1]) ? (
                  userId === post?.userId && (
                    <TbHttpDelete
                      className='cursor-pointer bg-red-600 text-white rounded-full text-4xl p-1 hover:bg-red-900'
                      title='Delete post'
                      onClick={() => handlePostDelete(post?.postId)}
                    />
                  )
                ) : (
                  <LoadingOutlined style={{ fontSize: '24px' }} className='mx-1 w-[50%] text-sky-600' />
                )}
                {userId === post?.userId && !isEditing && (
                  <EditFilled
                    className='cursor-pointer text-black bg-blue-400 hover:bg-blue-600 hover:text-white p-3 rounded-full dark:text-white dark:hover:text-black dark:bg-blue-700 dark:hover:bg-blue-500'
                    title='Edit post'
                    onClick={() => {
                      setIsEditing(post?.postId);
                      post.description && setDescription(post.description);
                    }}
                  />
                )}
                {!(loading === loadingState[2]) ? (
                  userId === post?.userId &&
                  isEditing === post?.postId && (
                    <FaCheck
                      className='w-1/2 rounded-full cursor-pointer'
                      title='Confirm edit'
                      onClick={() => handlePostEdit(post?.postId)}
                      style={{ fontSize: '36px', color: 'green' }}
                    />
                  )
                ) : (
                  <LoadingOutlined style={{ fontSize: '24px' }} className='mx-1 w-[50%] text-sky-600' />
                )}
              </div>
            </div>
          </div>
          {commentsShown.includes(post.postId) && (
            <div className={post.comments.length ? 'mt-4' : ''}>
              <hr className='dark:border-primary-200' />
              <>
                {post.comments.map((comment, index) => (
                  <div key={index}>
                    <div className='text-sm m-2 text-gray-400 font-semibold flex justify-between dark:text-primary-100'>
                      <div className='flex flex-col gap-2 justify-center'>
                        <div className='text-black dark:text-white font-bold tracking-wider'>
                          {comment.whoCommented}
                        </div>
                        <div>{comment.comment}</div>
                      </div>
                      <div className='flex flex-col gap-2 justify-end items-end'>
                        {comment.userId === userId && (
                          <DeleteFilled
                            className='cursor-pointer text-red-700 text-lg dark:text-red-500 hover:text-red-500 dark:hover:text-red-300'
                            title='Delete comment'
                            onClick={() => handleCommentDelete(comment._id)}
                          />
                        )}
                        <div>{formatDate(comment.createdAt)}</div>
                      </div>
                    </div>
                    <hr className='dark:border-primary-200' />
                  </div>
                ))}
                <form
                  className='flex md:flex-row flex-col justify-between gap-2 my-3 -mb-2 items-center '
                  onSubmit={(e) => handleNewComment(e, post.postId, post.userId)}
                >
                  <input
                    type='text'
                    name='comment'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder='Add a comment...'
                    autoFocus
                    autoComplete='off'
                    className='outline-sky-800 p-1 w-full flex-1 border-2 border-sky-600 dark:outline-dark-600 dark:bg-dark-600 dark:placeholder:text-white dark:border-lord-200 dark:text-white'
                  />
                  {!(loading === loadingState[3]) ? (
                    <button
                      className='text-white text-sm bg-blue-600 hover:bg-blue-800 px-2 rounded-full dark:bg-blue-700 dark:hover:bg-blue-500 tracking-widest font-bold py-2'
                      type='submit'
                      disabled={loading === loadingState[3]}
                    >
                      Comment
                    </button>
                  ) : (
                    <LoadingOutlined className='text-2xl text-sky-600' />
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
