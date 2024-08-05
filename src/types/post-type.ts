export type PostType = {
  postId?: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
  location?: string;
  description?: string;
  postPicturePath?: string;
  userPicturePath?: string;
  likes?: { [key: string]: boolean };
  comments: string[];
};
