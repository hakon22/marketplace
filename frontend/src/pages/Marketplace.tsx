/* eslint-disable max-len */
import {
  useEffect, useRef, useState, useMemo,
} from 'react';
import { Spinner } from 'react-bootstrap';
import { Badge, FloatButton } from 'antd';
import { useTranslation } from 'react-i18next';
import Pagination from '../components/Pagination';
import Helmet from '../components/Helmet';
import Card from '../components/Card';
import { fetchItems, selectors } from '../slices/marketSlice';
import { useAppDispatch, useAppSelector } from '../utilities/hooks';
import Cart from '../components/Cart';
import Breadcrumb from '../components/Breadcrumb';
import Filters from '../components/Filters';
import type { Item } from '../types/Item';

const Marketplace = ({ filter }: { filter?: string }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const showedItemsCount: number = 8;

  const { loadingStatus, search } = useAppSelector((state) => state.market);
  const items: Item[] = useAppSelector(selectors.selectAll).filter((i) => {
    if (filter) {
      return filter === 'discounts' ? !!i.discount : i.category.includes(filter);
    }
    return true;
  });

  const prices = items.map((item) => item.price);
  const min = useMemo(() => Math.min(...prices), [prices]);
  const max = useMemo(() => Math.max(...prices), [prices]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const sortByName = (a: Item, b: Item) => {
    if (a.name > b.name) {
      return 1;
    }
    if (a.name < b.name) {
      return -1;
    }
    return 0;
  };
  const sortByOverPrice = (a: Item, b: Item) => b.price - a.price;
  const sortByLowerPrice = (a: Item, b: Item) => a.price - b.price;
  const sortByRangePrice = (a: Item) => {
    if (a.price >= min && a.price <= max) {
      return 1;
    }
    if (a.price <= min && a.price >= max) {
      return -1;
    }
    return 0;
  };

  const [filterOptions, setFilterOptions] = useState({ sortBy: 'name', rangePrice: [min, max] });
  const { sortBy, rangePrice } = filterOptions;

  const sortedItems: Item[] = (search && [...search].sort((a, b) => sortByName(a, b))) || items.sort((a, b) => {
    if (sortBy === 'overPrice') {
      return sortByOverPrice(a, b);
    }
    if (sortBy === 'lowerPrice') {
      return sortByLowerPrice(a, b);
    }
    return sortByName(a, b);
  });

  const [showedData, setShowData] = useState<Item[]>(sortedItems.slice(0, showedItemsCount));

  useEffect(() => {
    const fetch = async () => {
      const { payload } = await dispatch(fetchItems());
      setShowData(payload.items.slice(0, showedItemsCount));
    };

    if (!items.length) {
      fetch();
    }
  }, []);

  useEffect(() => {
    if (search) {
      setShowData(search.slice(0, showedItemsCount));
    }
  }, [search]);

  useEffect(() => {
    setShowData(items.slice(0, showedItemsCount));
    if (min) {
      setFilterOptions({ sortBy, rangePrice: [min, max] });
    }
  }, [sortBy, min, items.length]);

  console.log(rangePrice);

  return loadingStatus !== 'finish' ? (
    <div className="position-absolute top-50 start-50">
      <Spinner animation="border" variant="primary" role="status" />
    </div>
  ) : (
    <>
      <Breadcrumb />
      <div className="my-4 row d-flex justify-content-end">
        <div className="col-12 col-md-10 my-4" ref={scrollRef}>
          <Helmet title={t('marketplace.title')} description={t('marketplace.description')} />
          <Cart />
          <Filters filterOptions={filterOptions} setFilterOptions={setFilterOptions} />
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
            filter={filter}
          />
          <FloatButton.BackTop />
        </div>
      </div>
    </>
  );
};

Marketplace.defaultProps = {
  filter: undefined,
};

export default Marketplace;
