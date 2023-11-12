import type { Cart } from './Cart';

export type Item = Cart & {
  discount: number;
}

export type CardItemProps = {
  item: Item;
}
