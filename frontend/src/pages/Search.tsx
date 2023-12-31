import { useTranslation } from 'react-i18next';
import { Result } from 'antd';
import { Helmet } from 'react-helmet';

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
        <Result
          status="404"
          title={t('search.header')}
          subTitle={t('search.title')}
        />
      </div>
    </div>
  );
};

export default Search;
