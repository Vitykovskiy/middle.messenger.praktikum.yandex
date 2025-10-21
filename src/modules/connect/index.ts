import type Block from '@/modules/block';
import type { Indexed } from '@/modules/store/types';
import { Store } from '../store';
import type { IBlockProps } from '../block/types';

const store = new Store();

export function connect(mapStateToProps: (state: Indexed) => IBlockProps) {
  return function <T extends typeof Block>(Component: T): T {
    // @ts-expect-error TS2653: Non-abstract class expression does not implement inherited abstract member 'render'
    return class extends Component {
      constructor(props: IBlockProps) {
        super({ ...props, ...mapStateToProps(store.getState()) });

        store.on(Store.EVENTS.Updated, () => {
          this.setProps({ ...mapStateToProps(store.getState()) });
        });
      }
    };
  };
}

export function createConnectBlock(
  Component: typeof Block,
  props: IBlockProps,
  mapStateToProps: (state: Indexed) => IBlockProps
): Block {
  const ConnectedBlock = connect(mapStateToProps)(Component);
  // @ts-expect-error TS2511: Cannot create an instance of an abstract class
  return new ConnectedBlock(props);
}
