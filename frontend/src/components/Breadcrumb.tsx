import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Breadcrumb as BreadcrumbAntd } from 'antd';

const Breadcrumb = () => {
  const { t } = useTranslation();
  const { pathname } = window.location;

  const [breadcrumb, setBreadcrumb] = useState<{ title: JSX.Element | string }[]>([]);

  useEffect(() => {
    const pathArray = pathname.slice(1).split('/');
    const linkArray: string[] = [];

    setBreadcrumb(pathArray.map((folder, index) => {
      if (pathArray.length === 1) {
        return {
          title: '',
        };
      }
      if (index === 0) {
        return {
          title: <Link to="/">{t('navBar.title')}</Link>,
        };
      }
      linkArray.push(folder);
      if (pathArray.length - 1 === index) {
        return {
          title: t(`navBar.menu.${[folder]}`),
        };
      }
      const link = linkArray.reduce((acc, fold) => `${acc}/${fold}`, '');
      return {
        title: <Link to={link}>{t(`navBar.menu.${[folder]}`)}</Link>,
      };
    }));
  }, [pathname]);

  return <BreadcrumbAntd items={breadcrumb} />;
};

export default Breadcrumb;
