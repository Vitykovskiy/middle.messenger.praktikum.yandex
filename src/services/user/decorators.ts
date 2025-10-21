import { connect } from '@/modules/connect';
import { USER_STORE_KEY, USERS_SEARCH_STORE_KEY } from './constants';
import { ACTIVE_CHAT_ID_STORE_KEY, CHATS_USERS_MAP_STORE_KEY } from '../chats/constants';
import type { IUser } from '@/api/authApi/types';

export const userSearch = connect((state) => ({
  users: state[USERS_SEARCH_STORE_KEY]
}));

export const activeChatUsers = connect((state) => {
  const activeChatId = state[ACTIVE_CHAT_ID_STORE_KEY] as number;
  const usersMap = state[CHATS_USERS_MAP_STORE_KEY];
  const currentUserId = (state[USER_STORE_KEY] as IUser)?.id;
  const users: IUser[] = (usersMap as Map<number, IUser[]>)?.get(activeChatId) ?? [];
  return { users: [...users].filter(({ id }) => id !== currentUserId) };
});
