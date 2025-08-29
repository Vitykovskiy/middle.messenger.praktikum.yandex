import '@/assets/styles/style.scss';
import { SystemMessage } from '@/components/systemMessage';

export class ErrorPage extends SystemMessage {
  constructor() {
    super({ title: '500', message: 'Мы уже фиксим' });
  }
}
