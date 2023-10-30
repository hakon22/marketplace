import { Card, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import routes from '../routes';
import { useAppSelector } from '../utilities/hooks';
import AuthContext from '../components/Context';
import LoginForm from '../components/LoginForm';
import Helmet from '../components/Helmet';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loggedIn } = useContext(AuthContext);
  const { error } = useAppSelector((state) => state.login);

  useEffect(() => {
    if (loggedIn) {
      navigate(routes.homePage);
    }
  }, [loggedIn, navigate]);

  return window.localStorage.getItem('refresh_token') && !error
    ? (
      <div className="h-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="primary" role="status" />
      </div>
    )
    : (
      <div className="col-12 col-lg-8">
        <Helmet title={t('loginForm.title')} description={t('loginForm.description')} />
        <Card border="secondary" bg="light" className="text-center">
          <Card.Header className="h4">{t('loginForm.title')}</Card.Header>
          <Card.Body>
            <LoginForm />
          </Card.Body>
          <Card.Footer>
            <span>{t('loginForm.notAccount')}</span>
            <Link to={routes.signupPage}>{t('signupForm.title')}</Link>
          </Card.Footer>
        </Card>
      </div>
    );
};

export default Login;
