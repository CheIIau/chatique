export interface Message {
  body: string;
  isYou: boolean;
  username: string;
}
export type MessageArray = Array<Message>;
export interface UserInfo {
  username: string;
  type: string;
}
export type UserInfoArray = Array<UserInfo>;
