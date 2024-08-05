import { UserType } from './user-type';

export type ConversationType = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  latestMessage: string;
  messages: string[];
  numberOfUnread: Record<string, number>;
  messageSeenAt: Record<string, string>;
  participants: UserType;
};
