import { useTranslation } from 'react-i18next';
import { SmileOutlined } from '@ant-design/icons';
import { Result } from 'antd';
import { Helmet } from 'react-helmet';

const Delivery = () => {
  const { t } = useTranslation();
  return (
    <div className="my-4 row d-flex justify-content-center">
      <div className="col-12 col-md-8">
        <Helmet>
          <title>{t('delivery.header')}</title>
          <meta name="description" content={t('delivery.title')} />
          <link rel="canonical" href={window.location.href} />
        </Helmet>
        <Result
          icon={<SmileOutlined />}
          title={t('delivery.title')}
          subTitle={t('delivery.subTitle')}
        />
      </div>
    </div>
  );
};

export default Delivery;
