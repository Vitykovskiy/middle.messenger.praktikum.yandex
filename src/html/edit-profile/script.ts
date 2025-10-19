import '@/assets/styles/style.scss';
import { render } from '@/utils/renderDom';
import AppLayout from '@/components/layouts/appLayout';
import { EditProfileFormPage } from '@/pages/editPropfilePage';
import { getUserData } from '@/services/users';
import { SidebarButton } from '@/components/sidebarBtn';

const card = new AppLayout({
  content: new EditProfileFormPage({ ...getUserData() }),
  sidebar: new SidebarButton()
});

render('#app', card);
