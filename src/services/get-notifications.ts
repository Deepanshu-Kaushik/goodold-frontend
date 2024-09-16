import { toast } from 'react-toastify';

type GetNotificationsType = {
  userId: string;
  token: string;
  setNotifications: any;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
};

export default async ({ userId, token, setNotifications, setLoading, setUserId }: GetNotificationsType) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/notification/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status >= 200 && response.status <= 210) {
      const data = await response.json();
      setNotifications(data);
    } else if (response.status === 403) {
      toast.error('You need to re-login');
      localStorage.clear();
      setUserId(null);
      return;
    } else {
      throw new Error('Something went wrong!');
    }
  } catch (error) {
    toast.error(error as string);
    console.log(error);
  } finally {
    setLoading(false);
  }
};
