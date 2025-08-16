import '@/assets/styles/style.scss';
import { Chat } from '@/components/chat/chat';
import { ChatsList } from '@/components/chat/chatsList';
import ChatLayout from '@/components/layouts/chatLayout';
import { Button } from '@/ui';
import { render } from '@/utils/renderDom';

const sidebarBody = new ChatsList();
const chat = new Chat();
const sidebarHeader = new Button({
  label: 'Профиль',
  variant: 'text',
  color: 'secondary'
});
const card = new ChatLayout({ sidebarBody, sidebarHeader, chat });

render('#app', card);
