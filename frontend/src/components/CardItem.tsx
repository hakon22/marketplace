import { Card, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { cartAdd, cartUpdate, selectors } from '../slices/cartSlice';
import { useAppDispatch, useAppSelector } from '../utilities/hooks';
import fetchImage from '../utilities/fetchImage';
import type { CardItemProps } from '../types/Props';

const CardItem = ({ item }: CardItemProps) => {
  const {
    id, name, image, unit, price,
  } = item;
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [srcImage, setSrcImage] = useState('');
  const countInCart = useAppSelector((state) => selectors.selectById(state, id))?.count;

  useEffect(() => {
    fetchImage(image, setSrcImage);
  }, []);

  return (
    <Card className="card-item">
      <Card.Img variant="top" className="mx-auto" src={srcImage} />
      <Card.Body className="pt-0">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title>{name}</Card.Title>
          <Card.Subtitle className="text-muted">{t('cardItem.subtitle', { price, unit })}</Card.Subtitle>
        </div>
        <Card.Text className="fs-bold fs-4">
          {t('cardItem.price', { price })}
        </Card.Text>
        <div className="d-flex justify-content-center">
          <Button
            variant={countInCart ? 'outline-success' : 'success'}
            onClick={() => {
              if (countInCart) {
                dispatch(cartUpdate({
                  id,
                  changes: { count: countInCart + 1 },
                }));
              } else {
                dispatch(cartAdd({
                  id, name, price, image: srcImage, unit, count: 1,
                }));
              }
            }}
          >
            {countInCart ? t('cardItem.inCart') : t('cardItem.addToCart')}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CardItem;