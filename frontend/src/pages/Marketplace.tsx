import { useEffect } from 'react';
import Helmet from '../components/Helmet';
import CardItem from '../components/CardItem';
import { updateTokens } from '../slices/loginSlice';
import { fetchItems, selectors } from '../slices/marketSlice';
import { useAppDispatch, useAppSelector } from '../utilities/hooks';
import Cart from '../components/Cart';

const Marketplace = () => {
  const dispatch = useAppDispatch();

  const { refreshToken, token } = useAppSelector((state) => state.login);
  const items = useAppSelector(selectors.selectAll);

  useEffect(() => {
    if (token) {
      dispatch(fetchItems(token));
    }
  }, []);

  useEffect(() => {
    if (refreshToken !== null) {
      const fetch = () => dispatch(updateTokens(refreshToken));

      const timeAlive = setTimeout(fetch, 595000);
      return () => clearTimeout(timeAlive);
    }
    return undefined;
  }, [refreshToken]);

  return (
    <div className="col-12 my-4">
      <Helmet title="Главная" description="Главная страница" />
      <Cart />
      <div className="marketplace">
        {items.map((item) => <CardItem key={item.id} item={item} />)}
      </div>
    </div>
  );
};

export default Marketplace;
