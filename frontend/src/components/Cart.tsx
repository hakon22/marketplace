import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { Cart as Purchases } from 'react-bootstrap-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalCart } from './Modals';
import { selectors } from '../slices/cartSlice';
import { useAppSelector } from '../utilities/hooks';
import type { PriceAndCount } from '../types/Cart';

const Cart = () => {
  const { t } = useTranslation();

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

  return (
    <>
      <ModalCart
        items={items}
        priceAndCount={priceAndCount}
        show={show && !!priceAndCount.count}
        onHide={modalClose}
        setMarginScroll={setMarginScroll}
      />
      <OverlayTrigger
        placement="left"
        show={!!priceAndCount.count}
        overlay={(
          <Tooltip style={{ marginRight: scrollBar ? scrollBar + 1 : scrollBar }}>
            {t('cart.summ', { price: priceAndCount.price })}
          </Tooltip>
        )}
      >
        <Button className="cart" onClick={modalShow} style={{ marginRight: scrollBar, display: priceAndCount.count ? 'unset' : 'none' }}>
          <Purchases />
          <span className="cart__badge">{priceAndCount.count}</span>
        </Button>
      </OverlayTrigger>
    </>
  );
};

export default Cart;
