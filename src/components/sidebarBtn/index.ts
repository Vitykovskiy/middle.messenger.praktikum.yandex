import { Button } from '@/ui';

export class SidebarButton extends Button {
  constructor() {
    super(
      { color: 'secondary', label: 'Назад' },
      {
        classes: ['sidebar-btn']
      }
    );
  }
}
