import type { Cart } from './Cart';

export type Item = Cart & {
  discount: number;
}
