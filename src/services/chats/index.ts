import type { IChatPreviewData } from './types';

export function getChats(): IChatPreviewData[] {
  return CHATS_EXAMPLE;
}

export const CHATS_EXAMPLE: IChatPreviewData[] = [
  {
    username: 'Киноклуб',
    dateTime: '11:25',
    lastMessage: {
      isOutgoing: true,
      text: 'Изображение'
    }
  },
  {
    username: 'Вадим',
    dateTime: '10:25',
    lastMessage: {
      text: 'Друзья, у меня для вас особенный выпуск новостей!...'
    },
    unreadedMessagesCount: 4
  },
  {
    username: 'Виктор',
    dateTime: 'Вт',
    lastMessage: {
      isOutgoing: true,
      text: 'Понедельник'
    }
  },
  {
    username: 'Андрей',
    dateTime: '1 Мая 2020',
    lastMessage: {
      text: 'Пицца звучит лучше.'
    },
    unreadedMessagesCount: 1
  }
];
