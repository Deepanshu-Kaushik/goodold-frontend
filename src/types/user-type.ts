export type UserType = {
  _id?: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  location?: string;
  occupation?: string;
  userPicturePath?: string;
  userPictureId?: string;
  friends?: any[];
  lastOnline?: string | null | undefined;
  createdAt?: string;
  updatedAt?: string;
};
