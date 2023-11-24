import { useTranslation } from 'react-i18next';
import { Result } from 'antd';
import { Helmet } from 'react-helmet';

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
        <Result
          status="404"
          title={t('404.title')}
          subTitle={t('404.description')}
        />
      </div>
    </div>
  );
};

export default Page404;
