import { router } from '@/modules/router';
import { Router } from '@/modules/router';
import type { RoutesNames } from '@/routes';
import { Button } from '@/ui';
import { Icon } from '@/ui';

export class SidebarButton extends Button {
  constructor() {
    const iconSlot = new Icon({
      iconName: 'arrow-left',
      size: 20,
      color: 'primary',
      wrapperProps: { styles: ['padding:9px'] }
    });

    super({ iconSlot, wrapperProps: { classes: ['sidebar-btn'] } });
  }

  public onMount(): void {
    router.eventBus.on(Router.EVENTS.ROUTE_CHANGE, () => {
      // Отрисовка кнопки "Назад" зависит от активного роута
      if (router.meta?.returnToBtn) {
        this._setRouteToReturnBtn(router.meta.returnToBtn as RoutesNames);
        this.show();
      } else {
        this.hide();
      }
    });

    if (router.meta?.returnToBtn) {
      this._setRouteToReturnBtn(router.meta.returnToBtn as RoutesNames);
      this.show();
    } else {
      this.hide();
    }
  }

  private _setRouteToReturnBtn(routeName: RoutesNames): void {
    this.click = () => router.go({ name: routeName });
  }
}
