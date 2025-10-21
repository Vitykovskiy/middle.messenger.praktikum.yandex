import type { IChat } from '@/api/chatsApi/types';
import type { Avatar } from '@/components/avatar';
import type { IBlockProps } from '@/modules/block/types';

export interface IChatPreviewProps extends IBlockProps {
  options: IChat;
  avatar?: Avatar;
  title?: string | null;
  dateTime?: string | null;
  isOwnerLastMessage?: boolean;
  lastMessageText?: string | null;
  unreadCount?: number | null;
}
