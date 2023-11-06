import { Card, Button } from 'react-bootstrap';
import { PlusCircle, DashCircle } from 'react-bootstrap-icons';
import { useState, useEffect } from 'react';
import { Rate } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  cartAdd, cartUpdate, cartRemove, selectors,
} from '../slices/cartSlice';
import { useAppDispatch, useAppSelector } from '../utilities/hooks';
import fetchImage from '../utilities/fetchImage';
import type { CardItemProps } from '../types/Props';

const CardItem = ({ item }: CardItemProps) => {
  const {
    id, name, image, unit, price,
  } = item;
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { hostname } = window.location;

  const [srcImage, setSrcImage] = useState('');
  const countInCart = useAppSelector((state) => selectors.selectById(state, id))?.count;

  const setCount = (itemId: number, count: number) => (count < 1
    ? dispatch(cartRemove(itemId))
    : dispatch(cartUpdate({ id: itemId, changes: { count } })));

  useEffect(() => {
    if (hostname === 'localhost') {
      fetchImage(image, setSrcImage);
    } else {
      setSrcImage(`${process.env.PUBLIC_URL}/static/media/${image}`);
    }
  }, []);

  return (
    <Card className="card-item">
      <Card.Img variant="top" className="mx-auto" src={srcImage} />
      <Card.Body className="pt-0">
        <Rate disabled defaultValue={4.5} />
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title>{name}</Card.Title>
          <Card.Subtitle className="text-muted">{t('cardItem.subtitle', { price, unit })}</Card.Subtitle>
        </div>
        <Card.Text className="fs-bold fs-4">
          {t('cardItem.price', { price })}
        </Card.Text>
        <div className="d-flex justify-content-center min-height-38">
          {countInCart
            ? (
              <div className="d-flex justify-content-center align-items-center gap-4">
                <DashCircle
                  className="fs-3 text-success icon-hover animate__animated animate__fadeInLeft"
                  role="button"
                  onClick={() => {
                    setCount(id, countInCart - 1);
                  }}
                />
                <span className="fs-5">{countInCart}</span>
                <PlusCircle
                  className="fs-3 text-success icon-hover animate__animated animate__fadeInRight"
                  role="button"
                  onClick={() => {
                    setCount(id, countInCart + 1);
                  }}
                />
              </div>
            )
            : (
              <Button
                variant="success"
                onClick={() => {
                  dispatch(cartAdd({
                    id, name, price, image: srcImage, unit, count: 1,
                  }));
                }}
              >
                {t('cardItem.addToCart')}
              </Button>
            ) }
        </div>
      </Card.Body>
    </Card>
  );
};

export default CardItem;
