import type { Item } from './Item';
import type { PriceAndCount, Cart } from './Cart';

type Modal = {
  onHide: (arg?: boolean) => void;
  show: boolean;
}

export type ModalActivateProps = Modal & {
  id?: string;
  email?: string;
}

export type CardItemProps = {
  item: Item;
}

export type ModalCartProps = Modal & {
  items: (Cart | undefined)[];
  priceAndCount: PriceAndCount;
  setMarginScroll: () => void;
}
