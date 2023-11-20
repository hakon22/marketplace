import type { PriceAndCount, Cart } from './Cart';

export type ModalCloseType = 'order' | 'recovery' | 'login' | 'signup' | boolean;

export type ModalShowType = ModalCloseType | 'cart' | 'activation' | 'createItem';

export type ModalProps = {
  onHide: (arg?: ModalCloseType) => void;
  show: ModalShowType;
}

export type ModalActivateProps = ModalProps & {
  id?: string;
  email?: string;
}

export type ModalCartProps = ModalProps & {
  items: (Cart | undefined)[];
  priceAndCount: PriceAndCount;
}
