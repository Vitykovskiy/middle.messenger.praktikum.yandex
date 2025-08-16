import '@/assets/styles/style.scss';

import { render } from '@/utils/renderDom';
import AppLayout from '@/components/layouts/appLayout';
import { ProfileFormPage } from '@/pages/profileFormPage';
import { getUserData } from '@/services/users';
import { SidebarButton } from '@/components/sidebarBtn';

const layout = new AppLayout({
  content: new ProfileFormPage({ ...getUserData() }),
  sidebar: new SidebarButton()
});

render('#app', layout);
