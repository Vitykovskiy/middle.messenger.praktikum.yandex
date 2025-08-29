import type { IUser } from '../authApi/types';

export interface IChat {
  id: number;
  title: string | null;
  avatar: string | null;
  unread_count: number | null;
  created_by: number | null;
  last_message: ILastMessageMeta | null;
}

export interface ILastMessageMeta {
  user: Omit<IUser, 'id' | 'display_name'>;
  time: string;
  content: string;
}

export interface IUnreadMessages {
  unread_count: number;
}

export interface IChatUser extends Omit<IUser, 'id' | 'email' | 'phone'> {
  role: string;
}

export interface ICreateChatPayload {
  title: string;
}

export interface ICreateChatResponse {
  id: number;
}

export interface IDeleteArchiveChatPayload {
  chatId: string;
}

export interface IDeleteChatResponse {
  userId: number;
  result: IChatMeta;
}

export interface IChatMeta {
  id: number;
  title: string;
  avatar: string;
  created_by: number;
}

export interface IChatFile {
  id: number;
  user_id: number;
  chat_id: number;
  time: string;
  type: string;
  content: number;
  file: IFileMeta;
}

export interface IFileMeta {
  id: number;
  user_id: number;
  path: string;
  filename: string;
  content_type: string;
  content_size: number;
  upload_date: string;
}

export interface IEditChatUsersPayload {
  users: number[];
  chatId: number;
}

export interface ITockenResponse {
  token: string;
}

export const enum ChatSocketRequestTypes {
  GetOld = 'get old',
  Message = 'message',
  File = 'file',
  Sticker = 'sticker'
}

export const enum ChatSocketResponseTypes {
  UserConnected = 'user connected',
  Message = 'message',
  File = 'file',
  Sticker = 'sticker'
}

export type SocketRequest =
  | { type: ChatSocketRequestTypes.GetOld; content: number }
  | { type: ChatSocketRequestTypes.Message; content: string }
  | { type: ChatSocketRequestTypes.File; content: string }
  | { type: ChatSocketRequestTypes.Sticker; content: string };

export type ChatSocketResponse = UserConnectedRes | MessageRes;

export type MessageRes = TextMessageRes | FileRes | StickerRes;

export type UserConnectedRes = {
  type: ChatSocketResponseTypes.UserConnected;
  content: string;
  file: null;
};
export type TextMessageRes = MessageResMeta & {
  type: ChatSocketResponseTypes.Message;
  content: string;
};
export type FileRes = MessageResMeta & { type: ChatSocketResponseTypes.File; file: IFileMeta };
export type StickerRes = MessageResMeta & { type: ChatSocketResponseTypes.Sticker };

type MessageResMeta = {
  id: number;
  chat_id: number;
  time: string;
  user_id: number;
  is_read: boolean;
};

export type GetUnreadMessagesReq = { type: ChatSocketRequestTypes.GetOld; content: number };
export type MessagesReq = { type: ChatSocketRequestTypes.Message; content: string };
export type StickerReq = { type: ChatSocketRequestTypes.Sticker; content: string };
export type FileReq = { type: ChatSocketRequestTypes.File; content: string };
