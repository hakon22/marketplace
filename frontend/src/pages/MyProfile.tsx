import { useTranslation } from 'react-i18next';
import Helmet from '../components/Helmet';
import ProfileForm from '../components/forms/ProfileForm';

const MyProfile = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet title={t('profile.title')} description={t('profile.submit')} />
      <h4 className="text-center mb-4">{t('profileButton.profile')}</h4>
      <ProfileForm />
    </>
  );
};

export default MyProfile;
