import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { Card, Image } from 'react-bootstrap';
import lemon from '../images/lemon.svg';

const Page404 = () => {
  const { t } = useTranslation();
  return (
    <div className="my-4 row d-flex justify-content-center">
      <div className="col-12 col-md-8">
        <Helmet>
          <title>{t('404.header')}</title>
          <meta name="description" content={t('404.title')} />
          <link rel="canonical" href={window.location.href} />
        </Helmet>
        <Card border="warning" className="text-center card-bg">
          <Card.Header>{t('404.header')}</Card.Header>
          <Card.Body>
            <Image className="mt-3 mb-4" src={lemon} alt={t('404.header')} roundedCircle />
            <Card.Title>{t('404.title')}</Card.Title>
            <Card.Text>
              {t('404.text')}
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Page404;
