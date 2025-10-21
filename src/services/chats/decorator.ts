import { connect } from '@/modules/connect';
import {
  ACTIVE_CHAT_ID_STORE_KEY,
  CHATS_LIST_STORE_KEY,
  CHATS_MESSAGES_MAP_STORE_KEY
} from './constants';
import type { IChat, MessageRes } from '@/api/chatsApi/types';

export const chatsList = connect((state) => ({
  chats: state[CHATS_LIST_STORE_KEY]
}));

export const activeChatId = connect((state) => ({
  activeChat: state[ACTIVE_CHAT_ID_STORE_KEY]
}));

export const activeChat = connect((state) => {
  const activeChatId = state[ACTIVE_CHAT_ID_STORE_KEY];
  const chats = state[CHATS_LIST_STORE_KEY] as IChat[];
  const activeChat = chats?.find((chat) => chat.id === activeChatId);
  return { activeChat };
});

export const chatMessages = connect((state) => {
  const activeChatId = state[ACTIVE_CHAT_ID_STORE_KEY] as number;
  const messagesMap = state[CHATS_MESSAGES_MAP_STORE_KEY];
  const messages = (messagesMap as Map<number, MessageRes[]>)?.get(activeChatId) ?? [];
  return { messages: [...messages] };
});
