/* eslint-disable max-len */
import { useEffect, useRef, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { Badge } from 'antd';
import { useTranslation } from 'react-i18next';
import Pagination from '../components/Pagination';
import Helmet from '../components/Helmet';
import Card from '../components/Card';
import { updateTokens } from '../slices/loginSlice';
import { fetchItems, selectors } from '../slices/marketSlice';
import { useAppDispatch, useAppSelector } from '../utilities/hooks';
import Cart from '../components/Cart';
import Breadcrumb from '../components/Breadcrumb';
import type { Item } from '../types/Item';

const Marketplace = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const showedItemsCount: number = 8;

  const { refreshToken } = useAppSelector((state) => state.login);
  const { loadingStatus, search } = useAppSelector((state) => state.market);
  const items: Item[] = useAppSelector(selectors.selectAll);

  const scrollRef = useRef<HTMLDivElement>(null);

  const sortedItems: Item[] = (search && [...search].sort((a, b) => a.id - b.id)) || items.sort((a, b) => a.id - b.id);

  const [showedData, setShowData] = useState<Item[]>(sortedItems.slice(0, showedItemsCount));

  useEffect(() => {
    const fetch = async () => {
      const { payload } = await dispatch(fetchItems());
      setShowData(payload.items.slice(0, showedItemsCount));
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

  useEffect(() => {
    if (search) {
      setShowData(search.slice(0, showedItemsCount));
    }
  }, [search]);

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
        <div className="marketplace anim-show">
          {showedData.map((item) => (item.discount
            ? (
              <Badge.Ribbon key={item.id} text={<span className="fw-bold">{t('cardItem.discount', { discount: item.discount })}</span>} color="red">
                <Card key={item.id} item={item} />
              </Badge.Ribbon>
            )
            : <Card key={item.id} item={item} />))}
        </div>
        <Pagination
          data={sortedItems}
          setShowData={setShowData}
          rowsPerPage={showedItemsCount}
          scrollRef={scrollRef}
          search={search}
        />
      </div>
    </>
  );
};

export default Marketplace;
