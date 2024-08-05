import { useEffect, useRef, useState } from 'react';
import Card from '../Card';
import { Link, useNavigate } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import ErrorComponent from '../ErrorComponent';
import { z } from 'zod';
import { useUserIdContext } from '../../contexts/UserIdContext';

export type LoginFormErrors = {
  email?: string;
  password?: string;
};

export default function Login() {
  const { setUserId } = useUserIdContext();
  const [loading, setLoading] = useState(false);
  const focusRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const schema = z.object({
    email: z.string().email({ message: 'Invalid email.' }),
    password: z
      .string()
      .min(8, { message: 'Password should be minimum of length 8.' })
      .max(20, { message: 'Password should be maximum of length 20.' }),
  });

  useEffect(() => {
    const { token, userId } = localStorage;
    if (token && userId) return navigate('/');
    focusRef.current?.focus();
  }, []);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState<LoginFormErrors>({});

  function handleOnChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setFormData((formData) => ({
      ...formData,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsedUser = schema.safeParse(formData);
    if (!parsedUser.success) {
      const error = parsedUser.error;
      let newErrors = {};
      for (const issue of error.issues) {
        newErrors = {
          ...newErrors,
          [issue.path[0]]: issue.message,
        };
      }
      return setFormErrors(newErrors);
    }
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status >= 200 && response.status <= 210) {
        const userData = await response.json();
        localStorage.setItem('token', userData.token);
        localStorage.setItem('userId', userData.user._id);
        setUserId(userData.user._id);
        localStorage.setItem('userPicturePath', userData.user.userPicturePath);
        return navigate(`/`);
      } else if (response.status === 400) {
        const newError = await response.json();
        setFormErrors({
          password: newError.error,
        });
      } else if (response.status === 403) {
        return navigate('/login');
      } else {
        throw new Error('Something went wrong!');
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <div className='flex p-4 justify-center'>
      <Card customStyle='w-[80%] md:w-[60%]'>
        <h2>Welcome to Goodold!</h2>
        <form className='flex flex-col my-4 gap-2' onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Email'
            name='email'
            className='outline-sky-400 p-2 border-2'
            value={formData.email}
            onChange={handleOnChange}
            autoComplete='off'
            ref={focusRef}
          />
          {formErrors.email && (
            <ErrorComponent>{formErrors.email}</ErrorComponent>
          )}
          <input
            type='password'
            placeholder='Password'
            name='password'
            className='outline-sky-400 p-2 border-2'
            value={formData.password}
            autoComplete='off'
            onChange={handleOnChange}
          />
          {formErrors.password && (
            <ErrorComponent>{formErrors.password}</ErrorComponent>
          )}
          {loading ? (
            <LoadingOutlined className='text-5xl text-sky-600' />
          ) : (
            <button
              type='submit'
              className='text-sky-50 font-bold text-lg bg-sky-800 hover:bg-sky-700 px-4 pt-2 pb-1.5 rounded-sm text-center self-center'
            >
              Login
            </button>
          )}
        </form>
        <Link
          to='/register'
          className='font-bold text-sky-800 hover:text-sky-600 underline'
        >
          {"Don't"} have an account? Sign Up here.
        </Link>
      </Card>
    </div>
  );
}
