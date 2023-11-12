import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import cn from 'classnames';
import {
  Navbar, Container, Button, Form, Nav,
} from 'react-bootstrap';
import ProfileButton from './ProfileButton';
import { MobileContext } from './Context';
import routes from '../routes';

const NavBar = () => {
  const { t } = useTranslation();
  const isMobile = useContext(MobileContext);

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
          <Form className={isMobile ? 'd-flex mt-2' : 'd-flex me-5'}>
            <Form.Control
              type="search"
              size="sm"
              placeholder={t('navBar.search')}
              className="me-2"
              aria-label={t('navBar.search')}
            />
            <Button variant="outline-warning" size="sm">{t('navBar.search')}</Button>
          </Form>
        </Navbar.Collapse>
        {!isMobile && <ProfileButton />}
      </Container>
    </Navbar>
  );
};

export default NavBar;
