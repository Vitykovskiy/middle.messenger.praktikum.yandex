import Block from '@/modules/block';
import { template } from './template';
import type { IAvatarProps } from './types';
import { merge } from '@/utils/helpers';
import http from '@/services/http';
import { UIElement } from '@/ui/element';
import { Icon } from '@/ui';

export class Avatar extends Block {
  constructor(props: IAvatarProps) {
    super(
      merge(
        {
          tagName: 'div',
          wrapperProps: {
            classes: ['avatar'],
            styles: [`width: ${props.size ?? 24}px`]
          }
        },
        props
      )
    );
  }

  public render(): DocumentFragment {
    const { src, size } = this.props as IAvatarProps;
    const avatarUrl = src ? http.getFileSrc(src) : '';

    const content = new UIElement({
      tagName: 'img',
      wrapperProps: {
        src: avatarUrl,
        classes: ['avatar__img']
      }
    });

    const imgElement = content.getContent();

    imgElement.onerror = () => {
      const defaultProfileIcon = new Icon({
        iconName: 'human-greeting-variant',
        size,
        wrapperProps: { classes: ['avatar_default'] }
      });
      const iconElement = defaultProfileIcon.getContent();
      imgElement.replaceWith(iconElement);
    };
    return this.compile(template, { ...this.props, content });
  }
}
