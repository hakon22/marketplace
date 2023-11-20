import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { Card, Image } from 'react-bootstrap';
import lemon from '../images/lemon.svg';

const Search = () => {
  const { t } = useTranslation();
  return (
    <div className="my-4 row d-flex justify-content-center">
      <div className="col-12 col-md-8">
        <Helmet>
          <title>{t('search.header')}</title>
          <meta name="description" content={t('search.title')} />
          <link rel="canonical" href={window.location.href} />
        </Helmet>
        <Card border="warning" className="text-center card-bg">
          <Card.Header>{t('search.header')}</Card.Header>
          <Card.Body>
            <Image className="mt-3 mb-4" src={lemon} alt={t('search.header')} roundedCircle />
            <Card.Title>{t('search.title')}</Card.Title>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Search;
