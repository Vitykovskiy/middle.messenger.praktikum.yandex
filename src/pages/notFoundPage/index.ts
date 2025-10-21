import '@/assets/styles/style.scss';
import { SystemMessage } from '@/components/systemMessage';

export class NotFountPage extends SystemMessage {
  constructor() {
    super({ title: '404', message: 'Не туда попали' });
  }
}
