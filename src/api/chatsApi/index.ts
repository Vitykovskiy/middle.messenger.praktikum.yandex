import http from '@/services/http';
import { ContentTypes } from '@/modules/http/constants';
import type {
  IEditChatUsersPayload,
  IChat,
  IChatFile,
  IChatUser,
  ICreateChatPayload,
  ICreateChatResponse,
  IDeleteArchiveChatPayload,
  IDeleteChatResponse,
  IUnreadMessages,
  ITockenResponse
} from './types';
import { createSocket } from '@/services/websocket';
import type { SocketCallbacks } from '@/services/websocket/types';
import { store } from '@/modules/store';
import { USER_STORE_KEY } from '@/services/user/constants';
import type { IUser } from '../authApi/types';

const basePath = '/chats';

async function getChats(): Promise<IChat[]> {
  const { data } = await http.get<IChat[]>(basePath);
  return data;
}

async function createChat(request: ICreateChatPayload): Promise<ICreateChatResponse> {
  const { data } = await http.post<ICreateChatResponse>(basePath, {
    data: request,
    contentType: ContentTypes.JSON
  });
  return data;
}

async function deleteChat(request: IDeleteArchiveChatPayload): Promise<IDeleteChatResponse> {
  const { data } = await http.delete<IDeleteChatResponse>(basePath, {
    data: request,
    contentType: ContentTypes.JSON
  });
  return data;
}

async function archiveChat(request: IDeleteArchiveChatPayload): Promise<IChat> {
  const { data } = await http.post<IChat>(`${basePath}/archive`, {
    data: request,
    contentType: ContentTypes.JSON
  });
  return data;
}

async function unarchiveChat(request: IDeleteArchiveChatPayload): Promise<IChat> {
  const { data } = await http.post<IChat>(`${basePath}/archive`, {
    data: request,
    contentType: ContentTypes.JSON
  });
  return data;
}

async function getCommonChat(id: number): Promise<IChat> {
  const { data } = await http.get<IChat>(`${basePath}/${id}/common`);
  return data;
}

async function getChatSentFiles(id: number): Promise<IChatFile[]> {
  const { data } = await http.get<IChatFile[]>(`${basePath}/${id}/files`);
  return data;
}

async function getArchivedChats(): Promise<IChat[]> {
  const { data } = await http.get<IChat[]>(`${basePath}/archive`);
  return data;
}

async function getChatUsers(chatId: number): Promise<IChatUser[]> {
  const { data } = await http.get<IChatUser[]>(`${basePath}/${chatId}/users`);
  return data;
}

async function getNewMessagesCount(chatId: number): Promise<IUnreadMessages> {
  const { data } = await http.get<IUnreadMessages>(`${basePath}/new/${chatId}`);
  return data;
}

async function uploadChatAvatar(request: FormData): Promise<IChat> {
  const { data } = await http.put<IChat>(basePath + '/avatar', {
    data: request
  });
  return data;
}

async function addUsersToChat(request: IEditChatUsersPayload): Promise<string> {
  const { data } = await http.put<string>(basePath + '/users', {
    data: request,
    contentType: ContentTypes.JSON
  });
  return data;
}

async function deleteUsersFromChat(request: IEditChatUsersPayload): Promise<string> {
  const { data } = await http.delete<string>(basePath + '/users', {
    data: request,
    contentType: ContentTypes.JSON
  });
  return data;
}

async function getChatToken(chatId: number): Promise<ITockenResponse> {
  const { data } = await http.post<ITockenResponse>(`${basePath}/token/${chatId}`);
  return data;
}

async function openChatsSocket(chatId: number, callbacks: SocketCallbacks): Promise<WebSocket> {
  const { token } = await getChatToken(chatId);
  const userId = (store.get(USER_STORE_KEY) as IUser).id;
  if (!userId) {
    throw new Error('User is not active');
  }
  return createSocket(`${basePath}/${userId}/${chatId}/${token}`, callbacks);
}

export default {
  getChats,
  createChat,
  deleteChat,
  archiveChat,
  unarchiveChat,
  getChatSentFiles,
  getArchivedChats,
  getCommonChat,
  getChatUsers,
  getNewMessagesCount,
  uploadChatAvatar,
  addUsersToChat,
  deleteUsersFromChat,
  openChatsSocket
};
