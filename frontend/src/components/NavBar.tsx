import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container, Button } from 'react-bootstrap';
import AuthContext from './Context';
import routes from '../routes';

const NavBar = () => {
  const { t } = useTranslation();
  const { logOut, loggedIn } = useContext(AuthContext);
  return (
    <Navbar bg="white">
      <Container>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-start">
          <Navbar.Text>
            <Link className="navbar-brand" to={routes.homePage}>{t('navBar.title')}</Link>
          </Navbar.Text>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            {loggedIn && (
            <Button
              variant="primary"
              onClick={logOut}
            >
              {t('navBar.exit')}
            </Button>
            )}
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
