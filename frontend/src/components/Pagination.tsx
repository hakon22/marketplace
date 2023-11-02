import { Pagination as BootstrapPagination } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { PaginationProps } from '../types/Pagination';
import type { Item } from '../types/Item';

const Pagination = ({
  data, showedData, setShowData, rowsPerPage, scrollRef, loadingStatus, searchId,
}: PaginationProps<Item[]>) => {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const urlPage = Number(urlParams.get('page'));

  const lastPage = Math.ceil(data.length / rowsPerPage);

  const paramsCheck = (value: number) => (value <= lastPage && value > 0 ? value : 1);

  const pageParams: number = paramsCheck(urlPage);
  const [currentPage, setCurrentPage] = useState(pageParams);

  const handleClick = (page: number) => {
    setCurrentPage(page);
    const pageIndex = page - 1;
    const firstIndex = pageIndex * rowsPerPage;
    const lastIndex = pageIndex * rowsPerPage + rowsPerPage;
    setShowData(data.slice(firstIndex, lastIndex));
    navigate(`?page=${page}`);
  };

  const items: JSX.Element[] = [];

  for (let number = 1; number <= lastPage; number += 1) {
    items.push(
      <BootstrapPagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => handleClick(number)}
      >
        {number}
      </BootstrapPagination.Item>,
    );
  }

  useEffect(() => {
    if (pageParams > 1) {
      handleClick(pageParams);
    }
  }, [pageParams]);

  useEffect(() => {
    if (loadingStatus === 'finish' && !showedData.length) {
      if ((paramsCheck(pageParams) === 1 && urlPage !== 1) || !urlPage) {
        navigate('?page=1');
      }
      handleClick(pageParams);
    }
  }, [loadingStatus]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [currentPage]);

  useEffect(() => {
    if (searchId || searchId === 0) {
      handleClick(1);
    }
  }, [searchId]);

  return <BootstrapPagination className="d-flex justify-content-center align-items-center mt-5">{items}</BootstrapPagination>;
};

export default Pagination;
