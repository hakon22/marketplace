/* eslint-disable react/jsx-closing-tag-location */
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Dropdown, Select } from 'antd';
import type { MenuProps } from 'antd';
import cn from 'classnames';
import { toLower } from 'lodash';
import {
  Navbar, Container, Button, Nav,
} from 'react-bootstrap';
import ProfileButton from './ProfileButton';
import fetchImage from '../utilities/fetchImage';
import { useAppSelector, useAppDispatch } from '../utilities/hooks';
import { selectors, searchUpdate } from '../slices/marketSlice';
import { MobileContext } from './Context';
import routes from '../routes';
import type { Item } from '../types/Item';

const NavBar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useContext(MobileContext);
  const dispatch = useAppDispatch();

  const [search, setSearch] = useState<string>();
  const [data, setData] = useState<{ name: string, image: string }[]>([]);

  const [urlParams] = useSearchParams();
  const urlPage = Number(urlParams.get('page'));
  const urlSearch = urlParams.get('q');

  const itemsMarket: Item[] = useAppSelector(selectors.selectAll);

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (<Link className="nav-link" to={routes.signupPage}>{t('navBar.menu.vegetables')}</Link>),
    },
    {
      key: '2',
      label: (<Link className="nav-link" to={routes.signupPage}>{t('navBar.menu.fruits')}</Link>),
    },
    {
      key: '3',
      label: (<Link className="nav-link" to={routes.signupPage}>{t('navBar.menu.frozen')}</Link>),
    },
    {
      key: '4',
      label: (<Link className="nav-link" to={routes.signupPage}>{t('navBar.menu.freshMeat')}</Link>),
    },
    {
      key: '5',
      label: (<Link className="nav-link" to={routes.signupPage}>{t('navBar.menu.dairy')}</Link>),
    },
    {
      key: '6',
      label: (<Link className="nav-link" to={routes.signupPage}>{t('navBar.menu.fish')}</Link>),
    },
    {
      key: '7',
      label: isMobile ? t('navBar.menu.sweet') : (<Link className="nav-link" to="/sweet">{t('navBar.menu.sweet')}</Link>),
      children: [
        {
          key: '7-1',
          label: (<Link className="nav-link" to="/sweet/iceCream">{t('navBar.menu.iceCream')}</Link>),
        },
        {
          key: '7-2',
          label: (<Link className="nav-link" to="/sweet/chocolate">{t('navBar.menu.chocolate')}</Link>),
        },
      ],
    },
  ];

  console.log(search);
  console.log(urlSearch);

  const searchHandler = (searchedValue: string | undefined) => {
    console.log(searchedValue);
    if (!searchedValue) {
      dispatch(searchUpdate(null));
    } else {
      const result = itemsMarket.filter(({ name, composition }) => {
        const query = toLower(searchedValue);
        return toLower(name).includes(query) || toLower(composition).includes(query);
      });
      if (result.length) {
        dispatch(searchUpdate(result));
        navigate(`/?q=${searchedValue}&page=${urlPage}`);
        console.log(searchedValue);
        setSearch(searchedValue);
      } else {
        dispatch(searchUpdate(null));
        navigate(`/search?q=${searchedValue}`);
      }
      const target = document.body;
      target.parentElement?.focus();
    }
  };

  const handleChange = (value: string) => setSearch(value);

  useEffect(() => {
    if (urlSearch && itemsMarket.length) {
      searchHandler(urlSearch);
    } else {
      setSearch(undefined);
    }
  }, [itemsMarket, urlSearch]);

  return (
    <Navbar expand={isMobile ? 'xxl' : true}>
      <Container>
        <Navbar.Text className="me-5">
          <Link className="navbar-brand" to={routes.homePage}>{t('navBar.title')}</Link>
        </Navbar.Text>
        {isMobile && <ProfileButton className="ms-4" />}
        <Navbar.Toggle>
          <span />
          <span />
          <span />
        </Navbar.Toggle>
        <Navbar.Collapse className="justify-content-start">
          <Nav className={isMobile ? '' : 'gap-3'}>
            <Link className="nav-link" to="/discounts">{t('navBar.menu.discounts')}</Link>
            <Link className="nav-link" to="/delivery">{t('navBar.menu.delivery')}</Link>
            <Dropdown menu={{ items }} trigger={['click', 'hover']} className={cn('dropdown-toggle nav-link', { 'w-50': isMobile })}>
              <span role="button">{t('navBar.menu.catalog')}</span>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <Select
            showSearch
            value={search}
            className="w-75 me-3"
            placeholder={t('navBar.search')}
            onInputKeyDown={async (e) => {
              if (e.key === 'Enter') {
                console.log(search);
                searchHandler(search);
              }
            }}
            filterOption={false}
            onSearch={async (q) => {
              const images: string[] = [];
              const result = itemsMarket.filter(({ name, composition, image }) => {
                const query = toLower(q);
                images.push(image);
                return toLower(name).includes(query) || toLower(composition).includes(query);
              });
              const fetchedData = await Promise.all(result.map(async ({ name, image }) => {
                const fetchedImage = await fetchImage(image);
                return { name, image: fetchedImage };
              }));
              setData(fetchedData);
              console.log(search, q);
              setSearch(urlSearch ?? undefined);
            }}
            autoClearSearchValue={false}
            onClear={() => console.log(search)}
            options={(data || []).map(({ name, image }) => ({
              label: <Button
                onClick={() => {
                  searchHandler(name);
                }}
                className="ant-select-item ant-select-item-option ant-select-item-option-active"
                title={name}
              >
                <div className="ant-select-item-option-content d-flex align-items-center gap-2">
                  <img className="col-2" alt={name} src={image} />
                  <span className="fs-6">{name}</span>
                </div>
              </Button>,
            }))}
          />
        </Navbar.Collapse>
        {!isMobile && <ProfileButton />}
      </Container>
    </Navbar>
  );
};

export default NavBar;
