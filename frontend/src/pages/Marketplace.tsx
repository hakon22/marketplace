import { useEffect, useRef, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Pagination from '../components/Pagination';
import Helmet from '../components/Helmet';
import CardItem from '../components/CardItem';
import { updateTokens } from '../slices/loginSlice';
import { fetchItems, selectors } from '../slices/marketSlice';
import { useAppDispatch, useAppSelector } from '../utilities/hooks';
import Cart from '../components/Cart';
import Breadcrumb from '../components/Breadcrumb';
import type { Item } from '../types/Item';

const Marketplace = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { refreshToken } = useAppSelector((state) => state.login);
  const { loadingStatus } = useAppSelector((state) => state.market);
  const items: Item[] = useAppSelector(selectors.selectAll);

  const scrollRef = useRef<HTMLDivElement>(null);

  const sortedItems: Item[] = items.sort((a, b) => a.id - b.id);

  const [showedData, setShowData] = useState<Item[]>(sortedItems.slice(0, 8));

  useEffect(() => {
    const fetch = async () => {
      const { payload } = await dispatch(fetchItems());
      setShowData(payload.items.slice(0, 8));
    };

    fetch();
  }, []);

  useEffect(() => {
    if (refreshToken) {
      const fetch = () => dispatch(updateTokens(refreshToken));

      const timeAlive = setTimeout(fetch, 595000);
      return () => clearTimeout(timeAlive);
    }
    return undefined;
  }, [refreshToken]);

  return loadingStatus !== 'finish' ? (
    <div className="position-absolute top-50 start-50">
      <Spinner animation="border" variant="primary" role="status" />
    </div>
  ) : (
    <>
      <Breadcrumb />
      <div className="col-12 my-4" ref={scrollRef}>
        <Helmet title={t('marketplace.title')} description={t('marketplace.description')} />
        <Cart />
        <div className="marketplace">
          {showedData.map((item) => <CardItem key={item.id} item={item} />)}
        </div>
        <Pagination
          data={sortedItems}
          showedData={showedData}
          setShowData={setShowData}
          rowsPerPage={8}
          scrollRef={scrollRef}
          loadingStatus={loadingStatus}
        />
      </div>
    </>
  );
};

export default Marketplace;
