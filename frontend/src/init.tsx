import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import Settings from './components/Settings';
import resources from './locales/index';

const init = async () => {
  const i18n = i18next.createInstance();

  await i18n
    .use(initReactI18next)
    .init({
      returnNull: false,
      lng: 'ru',
      resources,
      fallbackLng: 'ru',
      interpolation: {
        escapeValue: false,
      },
    });

  return (
    <I18nextProvider i18n={i18n}>
      <Settings />
    </I18nextProvider>
  );
};

export default init;
