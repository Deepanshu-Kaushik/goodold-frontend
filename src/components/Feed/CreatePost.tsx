import { useRef, useState } from 'react';
import Card from '../Card';
import { LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { UserType } from '../../types/user-type';
import { PostType } from '../../types/post-type';

type CreatePostType = {
  userData: UserType;
  setFeed: React.Dispatch<React.SetStateAction<PostType[]>>;
};

type NewPostType = {
  description: string;
  picture: File | null;
};

export default function CreatePost({ userData, setFeed }: CreatePostType) {
  const [loading, setLoading] = useState<boolean>(false);
  const pictureRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const [image, setImage] = useState<string | null>(null);
  const [newPost, setNewPost] = useState<NewPostType>({
    description: '',
    picture: null,
  });

  const handleNewPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newPost) return;
    setLoading(true);
    try {
      const { token, userId } = localStorage;
      if (!token || !userId) return navigate('/login');

      const postDataToSend = new FormData();
      postDataToSend.append('userId', userId);
      postDataToSend.append('description', newPost?.description);
      if (newPost.picture) postDataToSend.append('picture', newPost.picture);

      console.log(newPost, postDataToSend);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/posts`,
        {
          method: 'POST',
          body: postDataToSend,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

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
      } else if (response.status === 403) {
        return navigate('/login');
      } else {
        throw new Error('Something went wrong!');
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <Card customStyle='w-full'>
      <form
        className='flex flex-col gap-4'
        encType='multipart/form-data'
        onSubmit={handleNewPost}
      >
        <div className='flex md:flex-row flex-col gap-4 items-center justify-center'>
          <img
            src={userData?.userPicturePath}
            className='size-14 rounded-full object-cover'
          />
          <input
            className='application-grey outline-none placeholder:text-sm py-4 px-6 rounded-full flex-1 w-full'
            type='text'
            name='description'
            placeholder="What's on your mind..."
            value={newPost.description}
            onChange={(e) =>
              setNewPost((post) => ({
                ...post,
                [e.target.name]: e.target.value,
              }))
            }
            autoComplete='off'
          />
        </div>
        <input
          ref={pictureRef}
          type='file'
          id='picture'
          name='picture'
          accept='image/jpeg, image/jpg, image/png'
          hidden
          onChange={(e) => {
            const { name, files } = e.target as HTMLInputElement;
            if (!files) return;
            setNewPost((post) => ({
              ...post,
              [name]: files[0],
            }));
            setImage(URL.createObjectURL(files[0]));
          }}
        />
        {image && (
          <img
            className='max-h-[800px] p-0.5 object-contain border-2 border-sky-600'
            src={image}
          />
        )}
        <hr className='mb-2' />
        <div className='flex flex-col md:flex-row gap-4 justify-evenly items-center'>
          <div className='flex-grow flex items-center gap-2 md:gap-4'>
            <button type='button'>
              <label
                htmlFor='picture'
                className='bg-blue-800 hover:bg-blue-600 text-white rounded-sm cursor-pointer text-center p-2 py-1 md:p-4 md:py-2'
              >
                Upload Image
              </label>
            </button>
            <button type='button' title='Thamm ja bete'>
              <label
                htmlFor=''
                className='bg-blue-800 text-white rounded-sm cursor-not-allowed text-center p-2 py-1 md:p-4 md:py-2'
              >
                {/* hover:bg-blue-600 */}
                Upload Clip
              </label>
            </button>
          </div>
          {loading ? (
            <LoadingOutlined className='text-5xl text-sky-600' />
          ) : (
            <button
              type='submit'
              className='bg-sky-800 hover:bg-sky-600 text-white p-4 py-2 rounded-sm'
            >
              POST
            </button>
          )}
        </div>
      </form>
    </Card>
  );
}
