import '@/assets/styles/style.scss';
import { render } from '@/utils/renderDom';
import AppLayout from '@/components/layouts/appLayout';
import { SystemMessage } from '@/pages/systemMessagePage';

const layout = new AppLayout({
  content: new SystemMessage({ title: '404', message: 'Не туда попали' })
});

render('#app', layout);
