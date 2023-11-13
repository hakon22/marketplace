import type { Cart } from './Cart';

export type Item = Cart & {
  discount: number;
  composition: string;
  foodValues: {
    carbohydrates: number,
    fats: number,
    proteins: number,
    ccal: number,
  },
}

export type CardItemProps = {
  item: Item;
}
