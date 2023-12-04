/* eslint-disable max-len */
import {
  useMemo, useState, useEffect, useCallback,
} from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import notify from '../utilities/toast';
import Marketplace from '../pages/Marketplace';
import NavBar from './NavBar';
import Page404 from '../pages/Page404';
import Activation from '../pages/Activation';
import AuthContext, { MobileContext, ModalContext, ScrollContext } from './Context';
import routes, { catalogPages } from '../routes';
import { useAppDispatch, useAppSelector } from '../utilities/hooks';
import type { ModalShowType, ModalCloseType } from '../types/Modal';
import { fetchTokenStorage, removeToken, updateTokens } from '../slices/loginSlice';
import {
  ModalLogin, ModalSignup, ModalRecovery, ModalCreateItem,
} from './Modals';
import Search from '../pages/Search';
import Delivery from '../pages/Delivery';
import MyProfile from '../pages/MyProfile';

const App = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { width } = window.screen;

  const [isMobile, setIsMobile] = useState(width < 768);
  const {
    id, token, refreshToken, error,
  } = useAppSelector((state) => state.login);

  const [loggedIn, setLoggedIn] = useState(false);
  const logIn = () => setLoggedIn(true);
  const logOut = useCallback(async () => {
    const refreshTokenStorage = window.localStorage.getItem('refresh_token');
    if (refreshTokenStorage) {
      localStorage.removeItem('refresh_token');
    }
    await axios.post(routes.logout, { id, refreshToken });
    dispatch(removeToken());
    setLoggedIn(false);
  }, [dispatch, id]);

  const [show, setShow] = useState<ModalShowType>(false);
  const modalClose = (arg?: ModalCloseType) => setShow(arg || false);
  const modalShow = (arg?: ModalShowType) => setShow(arg || false);

  const scrollPx = () => window.innerWidth - document.body.clientWidth;
  const [scrollBar, setScrollBar] = useState(scrollPx());
  const setMarginScroll = () => {
    const px = scrollPx();
    if (px) {
      setScrollBar(px - 1);
    } else {
      setScrollBar(px);
    }
  };

  const authServices = useMemo(() => ({ loggedIn, logIn, logOut }), [loggedIn, logOut]);
  const modalServices = useMemo(() => ({ show, modalShow, modalClose }), [show, modalClose]);
  const scrollServices = useMemo(() => ({ scrollBar, setMarginScroll }), [scrollBar, setMarginScroll]);

  useEffect(() => {
    const tokenStorage = window.localStorage.getItem('refresh_token');
    if (tokenStorage) {
      dispatch(fetchTokenStorage(tokenStorage));
    }
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      logIn();
    }
  }, [token]);

  useEffect(() => {
    const errorHandler = (err: string) => {
      const [match] = err.match(/\d+/) ?? '500';
      const codeError = parseInt(match, 10);
      if (codeError === 401) {
        logOut();
        notify(t('toast.authError'), 'error');
      }
      if (codeError === 500) {
        notify(t('toast.unknownError'), 'error');
      }
      console.log(err);
    };

    if (error) {
      errorHandler(error);
    }
  }, [error]);

  useEffect(() => {
    const handleResize = ({ target }: Event) => {
      const w = target as Window;
      setIsMobile(w.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (refreshToken) {
      const fetch = () => dispatch(updateTokens(refreshToken));

      const timeAlive = setTimeout(fetch, 595000);
      return () => clearTimeout(timeAlive);
    }
    return undefined;
  }, [refreshToken]);

  return (
    <AuthContext.Provider value={authServices}>
      <ModalContext.Provider value={modalServices}>
        <ScrollContext.Provider value={scrollServices}>
          <MobileContext.Provider value={isMobile}>
            <BrowserRouter basename="/marketplace">
              <NavBar />
              <ModalLogin show={show} onHide={modalClose} />
              <ModalSignup show={show} onHide={modalClose} />
              <ModalRecovery show={show} onHide={modalClose} />
              <ModalCreateItem show={show} onHide={modalClose} />
              <hr className="mt-0" />
              <div className="container">
                <Routes>
                  <Route path={routes.homePage} element={<Marketplace />} />
                  <Route path={catalogPages.discounts} element={<Marketplace filter="discounts" />} />
                  <Route path={catalogPages.delivery} element={<Delivery />} />
                  <Route path={catalogPages.vegetables} element={<Marketplace filter="vegetables" />} />
                  <Route path={catalogPages.fruits} element={<Marketplace filter="fruits" />} />
                  <Route path={catalogPages.frozen} element={<Marketplace filter="frozen" />} />
                  <Route path={catalogPages.freshMeat} element={<Marketplace filter="freshMeat" />} />
                  <Route path={catalogPages.dairy} element={<Marketplace filter="dairy" />} />
                  <Route path={catalogPages.fish} element={<Marketplace filter="fish" />} />
                  <Route path={catalogPages.sweet}>
                    <Route index element={<Marketplace filter="sweet" />} />
                    <Route path={catalogPages.iceCream} element={<Marketplace filter="iceCream" />} />
                    <Route path={catalogPages.chocolate} element={<Marketplace filter="chocolate" />} />
                  </Route>
                  <Route path={routes.profilePage} element={<MyProfile />} />
                  <Route path={routes.ordersPage} element={<Page404 />} />
                  <Route path={routes.searchPage} element={<Search />} />
                  <Route path={routes.activationPage} element={<Activation />} />
                  <Route path={routes.notFoundPage} element={<Page404 />} />
                </Routes>
              </div>
              <hr className="mb-4" />
            </BrowserRouter>
          </MobileContext.Provider>
        </ScrollContext.Provider>
      </ModalContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
