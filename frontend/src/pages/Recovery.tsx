import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import routes from '../routes';
import RecoveryForm from '../components/RecoveryForm';
import Helmet from '../components/Helmet';

const Recovery = () => {
  const { t } = useTranslation();

  return (
    <div className="col-12 col-lg-8">
      <Helmet title={t('recoveryForm.title')} description={t('recoveryForm.description')} />
      <Card border="secondary" bg="light" className="text-center">
        <Card.Header className="h4">{t('recoveryForm.title')}</Card.Header>
        <Card.Body>
          <RecoveryForm />
        </Card.Body>
        <Card.Footer>
          <span>{t('recoveryForm.rememberPassword')}</span>
          <Link to={routes.loginPage}>{t('loginForm.submit')}</Link>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default Recovery;
