import {
  useMemo, useState, useEffect, useCallback,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  BrowserRouter, Routes, Route, Navigate,
} from 'react-router-dom';
import axios from 'axios';
import notify from '../utilities/toast';
import Marketplace from '../pages/Marketplace';
import NavBar from './NavBar';
import Page404 from '../pages/Page404';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Activation from '../pages/Activation';
import Recovery from '../pages/Recovery';
import AuthContext, { MobileContext } from './Context';
import routes from '../routes';
import { useAppDispatch, useAppSelector } from '../utilities/hooks';
import { fetchTokenStorage, removeToken } from '../slices/loginSlice';

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

  const authServices = useMemo(() => ({ loggedIn, logIn, logOut }), [loggedIn, logOut]);

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

  return (
    <AuthContext.Provider value={authServices}>
      <MobileContext.Provider value={isMobile}>
        <BrowserRouter basename="/marketplace">
          <NavBar />
          <hr className="mt-0" />
          <div className="container">
            <div className="my-4 row d-flex justify-content-center">
              <Routes>
                <Route
                  path={routes.homePage}
                  element={loggedIn
                    ? <Marketplace />
                    : <Navigate to={routes.loginPage} />}
                />
                <Route path={routes.loginPage} element={<Login />} />
                <Route path={routes.signupPage} element={<Signup />} />
                <Route path={routes.activationPage} element={<Activation />} />
                <Route path={routes.recoveryPasswordPage} element={<Recovery />} />
                <Route path={routes.notFoundPage} element={<Page404 />} />
              </Routes>
            </div>
          </div>
          <hr className="mb-4" />
        </BrowserRouter>
      </MobileContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
