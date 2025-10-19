import Handlebars from 'handlebars';
import type { IBlockProps } from '@/modules/block/types';

export class Templator {
  public static compile(template: string, props: IBlockProps): string {
    const templateDelegate = Handlebars.compile(template);
    return templateDelegate(props);
  }
}
