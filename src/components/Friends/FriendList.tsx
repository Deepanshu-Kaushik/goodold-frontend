import Card from '../Card';
import Friend from './Friend';
import { Link } from 'react-router-dom';
import { useSocketContext } from '../../contexts/SocketContext';
import { UserType } from '../../types/user-type';

type FriendListType = {
  friendList: UserType[];
  setFriendList: React.Dispatch<React.SetStateAction<UserType[]>>;
};

export default function FriendList({ friendList, setFriendList }: FriendListType) {
  const { onlineUsers } = useSocketContext();
  return (
    <>
      <Card customStyle='w-full dark:bg-lord-300'>
        <h1 className='mb-4 font-bold dark:text-white tracking-wider'>Friend List</h1>
        {!friendList?.hasOwnProperty('error') && (
          <div className='flex flex-col'>
            {friendList?.map((friend) => (
              <Link
                to={'/profile/' + friend?.userId}
                key={friend?.userId}
                className='hover:bg-slate-200 p-2 w-full rounded-lg dark:hover:bg-dark-400'
              >
                <Friend
                  setFriendList={setFriendList}
                  data={friend}
                  isOnline={friend?.userId && onlineUsers?.includes(friend?.userId) ? true : false}
                />
              </Link>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
