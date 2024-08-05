export type UserType = {
  _id?: string;
  senderId?: UserType;
  userId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  location?: string;
  occupation?: string;
  viewedProfile?: string;
  impressions?: string;
  userPicturePath?: string;
  comments?: string[] | undefined;
  friends?: any[];
  lastOnline?: string | null | undefined;
};
