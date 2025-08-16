export interface IDialog {
  interlocutor: IInterlocutor;
  messages: IMessage[];
}

export interface IInterlocutor {
  avatar: string;
  name: string;
}

export interface IMessage {
  isOutgoing?: boolean;
  isReaded: boolean;
  time: string;
  imgUrl?: string;
  text?: string;
}
