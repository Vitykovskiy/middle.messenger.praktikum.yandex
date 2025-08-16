import '@/assets/styles/style.scss';
import { render } from '@/utils/renderDom';
import AppLayout from '@/components/layouts/appLayout';
import { EditPasswordFormPage } from '@/pages/editPasswordPage';
import { SidebarButton } from '@/components/sidebarBtn';

const card = new AppLayout({ content: new EditPasswordFormPage(), sidebar: new SidebarButton() });

render('#app', card);
