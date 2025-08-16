export interface IChatPreviewData {
  username: string;
  dateTime: string;
  lastMessage: IChatPreviewMessage;
  unreadedMessagesCount?: number;
}

export interface IChatPreviewMessage {
  isOutgoing?: boolean;
  text: string;
}
