import chatsApi from '@/api/chatsApi';
import { store } from '@/modules/store';
import { CHAT_SEARCH_FOUND_USERS_STORE_KEY } from '../user/constants';
import type { IUser } from '@/api/authApi/types';
import { router } from '@/modules/router';
import { RoutesNames } from '@/routes';
import {
  ACTIVE_CHAT_ID_STORE_KEY,
  CHATS_MESSAGES_MAP_STORE_KEY,
  CHATS_LIST_STORE_KEY,
  CHATS_SOCKETS_STORE_KEY,
  CHATS_USERS_MAP_STORE_KEY
} from './constants';
import {
  ChatSocketRequestTypes,
  ChatSocketResponseTypes,
  type ChatSocketResponse,
  type GetUnreadMessagesReq,
  type IChatUser,
  type MessageRes,
  type MessagesReq
} from '@/api/chatsApi/types';
import type { SocketCallbacks } from '@/services/websocket/types';
import modal from '@/services/modal';
import { ChatCreateModal } from '@/components/chat/chatCreateModal';
import { isNumber } from '@/utils/helpers';

async function getChats(): Promise<void> {
  try {
    const list = await chatsApi.getChats();
    store.set(CHATS_LIST_STORE_KEY, list);
  } catch (error) {
    console.error('>> getChatsList', error);
  }
}

async function createChat(title: string): Promise<void> {
  try {
    const { id } = await chatsApi.createChat({ title });
    router.go({ name: RoutesNames.MessengerPage, params: { id } });
    await getChats();
  } catch (error) {
    console.error('>> createChat', error);
  }
}

async function searchChats(_title: string): Promise<void> {}

function onClearChatsSearch(): void {
  store.set(CHAT_SEARCH_FOUND_USERS_STORE_KEY, null);
}

async function createTwoUsersChat(user: IUser): Promise<void> {
  const title = user.display_name || user.login;
  const userId = user.id;

  if (!title || !userId) {
    console.error('The interlocutors data is not valid:', user);
    return;
  }

  try {
    const { id: chatId } = await chatsApi.createChat({ title });
    await chatsApi.addUsersToChat({ chatId, users: [userId] });

    router.go({ name: RoutesNames.MessengerPage, params: { id: chatId } });
  } catch (error) {
    console.error('>> createTwoUsersChat', error);
  }
}

async function addUsersToCurrentChat(users: number[]): Promise<void> {
  const chatId = store.get(ACTIVE_CHAT_ID_STORE_KEY);

  if (!isNumber(chatId)) {
    console.error('No active chats');
    return;
  }

  await chatsApi.addUsersToChat({ chatId, users });
  await _getChatUsers(chatId);
}

async function activateChat(chatId: number): Promise<void> {
  store.set(ACTIVE_CHAT_ID_STORE_KEY, chatId);
  await _createChatConnection(chatId);
  await _getChatUsers(chatId);
}

async function onCreateChat(): Promise<void> {
  modal.open({ content: new ChatCreateModal(), isShaded: true, isCloseOnOutsideClick: true });
}

function sendMessage(message: string): void {
  const chatId = store.get(ACTIVE_CHAT_ID_STORE_KEY);
  if (!isNumber(chatId)) return;

  const ws = (store.get(CHATS_SOCKETS_STORE_KEY) as Map<number, WebSocket> | undefined)?.get(
    chatId
  );
  if (!ws) return;

  const payload: MessagesReq = {
    type: ChatSocketRequestTypes.Message,
    content: message
  };

  ws.send(JSON.stringify(payload));
}

async function deleteUsersFromChat(users: number[]): Promise<void> {
  const chatId = store.get(ACTIVE_CHAT_ID_STORE_KEY);

  if (!isNumber(chatId)) return;

  await chatsApi.deleteUsersFromChat({ chatId, users });
  await _getChatUsers(chatId);
}

async function _createChatConnection(chatId: number, retries = 5): Promise<void> {
  let wsMap: Map<number, WebSocket> = store.get(CHATS_SOCKETS_STORE_KEY) as Map<number, WebSocket>;
  let ws: WebSocket | undefined;

  if (!wsMap) {
    wsMap = new Map();
    store.set(CHATS_SOCKETS_STORE_KEY, wsMap);
  } else {
    ws = (store.get(CHATS_SOCKETS_STORE_KEY) as Map<number, WebSocket>).get(chatId);
    if (ws) {
      return;
    }
  }

  try {
    const callbacks: SocketCallbacks = {
      onopen: () => _loadMessagesRequest(),
      onmessage: (e: MessageEvent) => {
        if (typeof e.data !== 'string') return;

        let data;

        try {
          data = JSON.parse(e.data as string) as ChatSocketResponse;
        } catch {
          return;
        }

        const type = Array.isArray(data) ? data[0]?.type : data.type;

        if (Array.isArray(data) && data[0]?.type === ChatSocketResponseTypes.Message) {
          _setMessages(chatId, data);
          return;
        }

        switch (type) {
          case ChatSocketResponseTypes.Message:
            _setMessages(chatId, [data as MessageRes]);
            break;
          case ChatSocketResponseTypes.File:
            break;
          case ChatSocketResponseTypes.Sticker:
            break;
          case ChatSocketResponseTypes.UserConnected:
            break;
        }
      },
      onclose: () => () => {}
    };

    const ws = await chatsApi.openChatsSocket(chatId, callbacks);
    wsMap.set(chatId, ws);
  } catch (error) {
    if (retries > 1) {
      setTimeout(() => _createChatConnection(chatId, retries - 1), 1000);
    } else {
      console.error(`openChatConnection: all retries failed for chat ${chatId}`, error);
    }
  }
}

function _getActiveChatSocket(): WebSocket {
  const chatId = store.get(ACTIVE_CHAT_ID_STORE_KEY);

  if (!isNumber(chatId)) {
    throw new Error('No active chat');
  }

  const ws = (store.get(CHATS_SOCKETS_STORE_KEY) as Map<number, WebSocket> | undefined)?.get(
    chatId
  );
  if (!ws) {
    throw new Error('No current chat connection');
  }

  return ws;
}

function _setMessages(chatId: number, messages: MessageRes[]): void {
  let messagesMap = store.get(CHATS_MESSAGES_MAP_STORE_KEY) as Map<number, MessageRes[]>;

  if (!messagesMap) {
    messagesMap = new Map<number, MessageRes[]>();
  }

  let messagesList = messagesMap.get(chatId);
  if (!messagesList) {
    messagesList = [];
    messagesMap.set(chatId, messagesList);
  }

  messagesList.unshift(...messages);

  store.set(CHATS_MESSAGES_MAP_STORE_KEY, messagesMap);
}

function _loadMessagesRequest(): void {
  const ws = _getActiveChatSocket();

  const request: GetUnreadMessagesReq = {
    type: ChatSocketRequestTypes.GetOld,
    content: 0
  };

  ws.send(JSON.stringify(request));
}

async function _getChatUsers(chatId: number): Promise<void> {
  try {
    const users = await chatsApi.getChatUsers(chatId);

    let usersMap = store.get(CHATS_USERS_MAP_STORE_KEY) as Map<number, IChatUser[]>;

    if (!usersMap) {
      usersMap = new Map<number, IChatUser[]>();
    }

    usersMap.set(chatId, users);

    store.set(CHATS_USERS_MAP_STORE_KEY, usersMap);
  } catch (error) {
    console.error('>> _getChatUsers', error);
  }
}

export default {
  getChats,
  createChat,
  searchChats,
  activateChat,
  deleteUsersFromChat,
  createTwoUsersChat,
  onClearChatsSearch,
  sendMessage,
  onCreateChat,
  addUsersToCurrentChat
};
