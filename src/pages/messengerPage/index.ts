import '@/assets/styles/style.scss';
import { ChatWindow } from '@/components/chat/chat';
import { ChatSidebar } from '@/components/chat/chatSidebar';
import ChatLayout from '@/components/layouts/chatLayout';
import { router } from '@/modules/router';
import { RoutesNames } from '@/routes';
import chatsService from '@/services/chats';
import { Button } from '@/ui';

export class MessengerPage extends ChatLayout {
  constructor() {
    const sidebarBody = new ChatSidebar();
    const chat = new ChatWindow();
    const sidebarHeader = new Button({
      label: 'Профиль',
      variant: 'text',
      color: 'secondary',
      iconName: 'chevron-right',
      iconSize: 20
    });
    sidebarHeader.click = () => router.go({ name: RoutesNames.ProfilePage });

    super({ sidebarBody, sidebarHeader, chat });
  }

  public async onMount(): Promise<void> {
    await chatsService.getChats();
  }
}
