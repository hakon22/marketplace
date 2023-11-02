import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { Cart as Purchases } from 'react-bootstrap-icons';
import { useState } from 'react';
import { ModalCart } from './Modals';
import { selectors } from '../slices/cartSlice';
import { useAppSelector } from '../utilities/hooks';
import type { PriceAndCount } from '../types/Cart';

const Cart = () => {
  const scrollPx = () => window.innerWidth - document.body.clientWidth;
  const [scrollBar, setScrollBar] = useState(scrollPx());
  const setMarginScroll = () => {
    const px = scrollPx();
    if (px) {
      setScrollBar(px - 1);
    } else {
      setScrollBar(px);
    }
  };

  const [show, setShow] = useState(true);
  const modalClose = (arg?: boolean) => setShow(!!arg);
  const modalShow = () => setShow(true);

  const items = Object.values(useAppSelector(selectors.selectEntities));
  const initialObject: PriceAndCount = { price: 0, count: 0 };
  const priceAndCount = items.reduce((acc, item) => {
    if (item) {
      const { price, count } = item;
      const generalPrice = price * count;
      return { price: acc.price + generalPrice, count: acc.count + count };
    }
    return acc;
  }, initialObject);

  return priceAndCount.count ? (
    <>
      <ModalCart
        items={items}
        priceAndCount={priceAndCount}
        show={show}
        onHide={modalClose}
        setMarginScroll={setMarginScroll}
      />
      <OverlayTrigger
        placement="left"
        overlay={(
          <Tooltip>
            {`= ${priceAndCount.price},00 ₽`}
          </Tooltip>
  )}
      >
        <Button className="cart" onClick={modalShow} style={{ marginRight: scrollBar }}>
          <Purchases />
          <span className="cart__badge">{priceAndCount.count}</span>
        </Button>
      </OverlayTrigger>
    </>
  ) : null;
};

export default Cart;
