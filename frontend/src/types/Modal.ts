import type { PriceAndCount, Cart } from './Cart';

export type ModalShowType = 'login' | 'signup' | 'cart' | 'activation' | 'order' | 'recovery' | boolean;

export type ModalCloseType = 'order' | 'recovery' | 'login' | 'signup' | boolean;

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
