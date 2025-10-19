import '@/assets/styles/style.scss';
import { render } from '@/utils/renderDom';
import AppLayout from '@/components/layouts/appLayout';
import { SignInPage } from '@/pages/signinPage';

const layout = new AppLayout({ content: new SignInPage() });

render('#app', layout);
