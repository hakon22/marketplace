export type Cart = {
  id: number;
  name: string;
  price: number;
  unit: string;
  count: number;
  image: string;
  discountPrice?: number;
}

export type PriceAndCount = {
  price: number;
  count: number;
}
