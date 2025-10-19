import type { IDialog } from './types';

export function getDialog(): IDialog {
  return DIALOG_EXAMPLE;
}

export const DIALOG_EXAMPLE = {
  interlocutor: {
    avatar: '',
    name: 'Андрей'
  },
  messages: [
    {
      isOutgoing: false,
      isReaded: true,
      time: '11:56',
      imgUrl: 'text'
    },
    {
      isOutgoing: true,
      isReaded: true,
      time: '11:57',
      text: 'Привет!'
    },
    {
      isOutgoing: true,
      isReaded: true,
      time: '11:57',
      imgUrl: 'text'
    },
    {
      isOutgoing: true,
      isReaded: true,
      time: '11:57',
      text: 'Как дела?'
    },
    {
      isOutgoing: false,
      isReaded: true,
      time: '11:58',
      text: 'Нормально, а у тебя?'
    },
    {
      isOutgoing: true,
      isReaded: true,
      time: '11:59',
      text: 'Тоже хорошо. Что нового?'
    },
    {
      isOutgoing: false,
      isReaded: true,
      time: '12:00',
      text: 'Ничего особенного, сижу на работе.'
    },
    {
      isOutgoing: true,
      isReaded: true,
      time: '12:01',
      text: 'Понятно. Может, сходим в кино на выходных?'
    },
    {
      isOutgoing: false,
      isReaded: true,
      time: '12:02',
      text: 'Да, отличная идея!'
    },
    {
      isOutgoing: false,
      isReaded: true,
      time: '12:03',
      text: 'Какой фильм хочешь посмотреть?'
    },
    {
      isOutgoing: false,
      isReaded: true,
      time: '12:04',
      text: 'Может, новый блокбастер?'
    },
    {
      isOutgoing: true,
      isReaded: true,
      time: '12:05',
      text: 'Согласен. В 7 вечера подойдет?'
    },
    {
      isOutgoing: false,
      isReaded: true,
      time: '12:06',
      text: 'Да, давай.'
    },
    {
      isOutgoing: true,
      isReaded: true,
      time: '12:07',
      text: 'Круто! А что насчет еды перед кино?'
    },
    {
      isOutgoing: true,
      isReaded: true,
      time: '12:08',
      text: 'Может, пиццу?'
    },
    {
      isOutgoing: true,
      isReaded: true,
      time: '12:09',
      text: 'Или суши?'
    },
    {
      isOutgoing: false,
      isReaded: true,
      time: '12:10',
      text: 'Пицца звучит лучше.'
    }
  ]
};
