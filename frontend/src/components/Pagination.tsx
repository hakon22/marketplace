import { Pagination as BootstrapPagination } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { Item } from '../types/Item';

type PaginationProps<T> = {
  data: T;
  setShowData: React.Dispatch<React.SetStateAction<T>>;
  rowsPerPage: number;
  scrollRef: React.RefObject<HTMLElement>;
}

const Pagination = ({
  data, setShowData, rowsPerPage, scrollRef,
}: PaginationProps<Item[]>) => {
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const urlPage = Number(urlParams.get('page'));
  const urlSearch = urlParams.get('q');

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
    if (urlSearch) {
      navigate(`?q=${urlSearch}&page=${page}`);
    } else {
      navigate(`?page=${page}`);
    }
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
    setTimeout(() => handleClick(pageParams), 1);
  }, [data]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [currentPage]);

  return <BootstrapPagination className="d-flex justify-content-center align-items-center mt-5">{items}</BootstrapPagination>;
};

export default Pagination;
