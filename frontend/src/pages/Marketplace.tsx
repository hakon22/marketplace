/* eslint-disable max-len */
import {
  useEffect, useState, useMemo, useContext,
} from 'react';
import { Spinner, Button } from 'react-bootstrap';
import { Badge, FloatButton, Result } from 'antd';
import { useTranslation } from 'react-i18next';
import Pagination from '../components/Pagination';
import Card from '../components/Card';
import { ModalContext, ScrollContext } from '../components/Context';
import { ModalCreateItem, ModalRemoveItem } from '../components/Modals';
import { fetchItems, selectors } from '../slices/marketSlice';
import { useAppDispatch, useAppSelector } from '../utilities/hooks';
import Cart from '../components/Cart';
import Breadcrumb from '../components/Breadcrumb';
import Filters, { isFilter, generalSortFunction, generalFilterFunction } from '../components/Filters';
import CardContextMenu from '../components/CardContextMenu';
import type { FilterOptions } from '../components/Filters';
import type { Item } from '../types/Item';

const Marketplace = ({ filter }: { filter?: string }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { scrollBar } = useContext(ScrollContext);
  const { show, modalClose, modalShow } = useContext(ModalContext);
  const [context, setContext] = useState<{ action: string, id: number }>();

  const showedItemsCount: number = 8;

  const { loadingStatus, search } = useAppSelector((state) => state.market);
  const { role } = useAppSelector((state) => state.login);

  const items: Item[] = useAppSelector(selectors.selectAll);
  const currentItems = useMemo(() => items.filter((i) => {
    if (filter) {
      return filter === 'discounts' ? !!i.discount : i.category.includes(filter);
    }
    return true;
  }), [items, filter, search]);

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({ sortBy: 'name' });
  const { sortBy, rangePriceValue, rangeCcalValue } = filterOptions;

  const sortedItems: Item[] = useMemo(() => {
    if (isFilter(rangePriceValue, rangeCcalValue)) {
      return search ? search.filter(generalFilterFunction(rangePriceValue, rangeCcalValue)).sort(generalSortFunction(sortBy)) : currentItems.filter(generalFilterFunction(rangePriceValue, rangeCcalValue)).sort(generalSortFunction(sortBy));
    }
    return search ? [...search].sort(generalSortFunction(sortBy)) : currentItems.sort(generalSortFunction(sortBy));
  }, [currentItems, rangePriceValue, rangeCcalValue, search, sortBy]);

  const [showedData, setShowData] = useState<Item[]>(sortedItems.slice(0, showedItemsCount));

  useEffect(() => {
    const fetch = async () => {
      const { payload } = await dispatch(fetchItems());
      setShowData(payload.items.sort(generalSortFunction(sortBy)).slice(0, showedItemsCount));
    };

    if (!items.length) {
      fetch();
    }
  }, []);

  useEffect(() => {
    if (context?.action === 'editItem' || context?.action === 'removeItem') {
      modalShow(context?.action);
    }
  }, [context?.action]);

  return loadingStatus !== 'finish' ? (
    <div className="position-absolute top-50 start-50">
      <Spinner animation="border" variant="primary" role="status" />
    </div>
  ) : (
    <>
      <ModalCreateItem onHide={modalClose} context={context} setContext={setContext} />
      <ModalRemoveItem show={show} onHide={modalClose} context={context} setContext={setContext} />
      <Breadcrumb />
      <div className="my-4 row d-flex justify-content-end">
        <div className="col-12 col-md-9 col-xl-10 my-4">
          <Cart />
          <Filters
            filterOptions={filterOptions}
            setFilterOptions={setFilterOptions}
            setShowData={setShowData}
            search={search}
            sortedItems={sortedItems}
            currentItems={currentItems}
            showedItemsCount={showedItemsCount}
          />
          <div className="marketplace anim-show">
            {showedData.map((item) => (
              <CardContextMenu key={item.id} id={item.id} disabled={role !== 'admin'} setContext={setContext}>
                {item.discount
                  ? (
                    <Badge.Ribbon text={<span className="fw-bold">{t('cardItem.discount', { discount: item.discount })}</span>} color="red">
                      <Card item={item} />
                    </Badge.Ribbon>
                  )
                  : <Card key={item.id} item={item} />}
              </CardContextMenu>
            ))}
          </div>
          {!showedData.length && isFilter(rangePriceValue, rangeCcalValue) && (
          <Result
            status="warning"
            title={t('search.header')}
            extra={(
              <Button variant="outline-warning" size="sm" onClick={() => setFilterOptions({ sortBy, isClear: true })}>
                {t('filters.clearFilters')}
              </Button>
            )}
          />
          )}
          <Pagination
            data={sortedItems}
            setShowData={setShowData}
            rowsPerPage={showedItemsCount}
          />
          <FloatButton.BackTop style={{ right: '6.5%', bottom: '25%', marginRight: scrollBar }} />
        </div>
      </div>
    </>
  );
};

Marketplace.defaultProps = {
  filter: undefined,
};

export default Marketplace;
