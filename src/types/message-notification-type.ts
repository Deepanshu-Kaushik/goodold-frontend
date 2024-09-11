import { MessageType } from './message-type';
import { UserType } from './user-type';

export type MessageNotificationType = {
  newMessage: MessageType;
  senderData: UserType;
};
