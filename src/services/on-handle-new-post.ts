import { NavigateFunction } from 'react-router-dom';
import NewPostType from '../types/new-post-type';
import { PostType } from '../types/post-type';
import { toast } from 'react-toastify';

type OnHandleNewPosts = {
  navigate: NavigateFunction;
  newPost: NewPostType;
  setFeed: React.Dispatch<React.SetStateAction<PostType[]>>;
  setNewPost: React.Dispatch<React.SetStateAction<NewPostType>>;
  pictureRef: React.MutableRefObject<HTMLInputElement | null>;
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
};

export default async ({ navigate, newPost, setFeed, setNewPost, pictureRef, setImage }: OnHandleNewPosts) => {
  try {
    const { token, userId } = localStorage;
    if (!token || !userId) return navigate('/login');

    const postDataToSend = new FormData();
    postDataToSend.append('userId', userId);
    if (newPost.description) postDataToSend.append('description', newPost.description);
    if (newPost.picture) postDataToSend.append('picture', newPost.picture);

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts`, {
      method: 'POST',
      body: postDataToSend,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status >= 200 && response.status <= 210) {
      const data = await response.json();
      setFeed((posts) => {
        const postsArray = Object.values(posts);
        postsArray.unshift(data);
        return postsArray;
      });

      setNewPost({ description: '', picture: null });
      if (pictureRef.current) pictureRef.current.value = '';
      setImage(null);
      toast.success('Created a post successfully');
    } else if (response.status === 403) {
      toast.error('You need to re-login');
      return navigate('/login');
    } else if (response.status === 404) {
      const { error } = await response.json();
      throw error;
    } else {
      throw new Error('Something went wrong!');
    }
  } catch (error) {
    toast.error(error as string);
    console.log(error);
  }
};
