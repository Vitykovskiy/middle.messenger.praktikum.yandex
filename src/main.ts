import '@/assets/styles/style.scss';
import { render } from '@/utils/renderDom';
import AppLayout from '@/components/layouts/appLayout';
import { LoginPage } from '@/pages/loginPage';

const layout = new AppLayout({ content: new LoginPage() });

render('#app', layout);
