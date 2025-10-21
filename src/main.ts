import '@mdi/font/css/materialdesignicons.min.css';
import '@/assets/styles/style.scss';
import { render } from '@/utils/renderDom';
import AppLayout from '@/components/layouts/appLayout';
import { routes } from './routes';
import { router } from '@/modules/router';

const appLayout = new AppLayout();

render('#app', appLayout);

router.registerRoutes(routes);
router.start();
