export const USER_EXAMPLE = {
  firstName: "Виктор",
  secondName: "Почемучкин",
  email: "why@fox-kids.com",
  login: "vitoto",
  visibleName: "Виктор",
  phone: "555-011-0111",
};

export const CHATS_EXAMPLE = [
  {
    username: "Киноклуб",
    time: "11:25",
    message: {
      isOutgoing: true,
      text: "Изображение",
    },
  },
  {
    username: "Вадим",
    time: "10:25",
    message: {
      text: "Друзья, у меня для вас особенный выпуск новостей!...",
    },
    messagesCount: "4",
  },
  {
    username: "Виктор",
    time: "Вт",
    message: {
      isOutgoing: true,
      text: "Понедельник",
    },
  },
  {
    username: "Андрей",
    time: "1 Мая 2020",
    message: {
      text: "Пицца звучит лучше.",
    },
    isActive: true,
    messagesCount: "1",
  },
];

export const CONVERSATION_EXAMPLE = {
  interlocutor: {
    avatar: "",
    name: "Андрей",
  },
  messages: [
    {
      isOutgoing: false,
      isReaded: true,
      time: "11:56",
      imgUrl: "text",
    },
    {
      isOutgoing: true,
      isReaded: true,
      time: "11:57",
      imgUrl: "text",
      text: "Привет!",
    },
    {
      isOutgoing: true,
      isReaded: true,
      time: "11:57",
      text: "Как дела?",
    },
    {
      isOutgoing: false,
      isReaded: true,
      time: "11:58",
      text: "Нормально, а у тебя?",
    },
    {
      isOutgoing: true,
      isReaded: true,
      time: "11:59",
      text: "Тоже хорошо. Что нового?",
    },
    {
      isOutgoing: false,
      isReaded: true,
      time: "12:00",
      text: "Ничего особенного, сижу на работе.",
    },
    {
      isOutgoing: true,
      isReaded: true,
      time: "12:01",
      text: "Понятно. Может, сходим в кино на выходных?",
    },
    {
      isOutgoing: false,
      isReaded: true,
      time: "12:02",
      text: "Да, отличная идея!",
    },
    {
      isOutgoing: false,
      isReaded: true,
      time: "12:03",
      text: "Какой фильм хочешь посмотреть?",
    },
    {
      isOutgoing: false,
      isReaded: true,
      time: "12:04",
      text: "Может, новый блокбастер?",
    },
    {
      isOutgoing: true,
      isReaded: true,
      time: "12:05",
      text: "Согласен. В 7 вечера подойдет?",
    },
    {
      isOutgoing: false,
      isReaded: true,
      time: "12:06",
      text: "Да, давай.",
    },
    {
      isOutgoing: true,
      isReaded: true,
      time: "12:07",
      text: "Круто! А что насчет еды перед кино?",
    },
    {
      isOutgoing: true,
      isReaded: true,
      time: "12:08",
      text: "Может, пиццу?",
    },
    {
      isOutgoing: true,
      isReaded: true,
      time: "12:09",
      text: "Или суши?",
    },
    {
      isOutgoing: false,
      isReaded: true,
      time: "12:10",
      text: "Пицца звучит лучше.",
    },
  ],
};
