export type NotificationsType = {
  _id: string;
  typeOfNotification: 'like' | 'comment' | 'friend-request';
  userId: string;
  userPicturePath: string;
  notificationText: string;
  notificationRead: boolean;
  createrId: string;
  acceptedFriendRequest?: boolean;
  postId?: string;
  commentOnPost?: string;
  createdAt: string;
  updatedAt: string;
};
