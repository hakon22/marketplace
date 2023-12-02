import { useTranslation } from 'react-i18next';
import { Nav } from 'react-bootstrap';
import { useContext } from 'react';
import { ModalContext } from '../components/Context';
import { useAppSelector } from '../utilities/hooks';
import Helmet from '../components/Helmet';
import ProfileForm from '../components/forms/ProfileForm';

const MyProfile = () => {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.login);
  const { modalShow } = useContext(ModalContext);

  return (
    <>
      <Helmet title={t('profile.title')} description={t('profile.submit')} />
      <h4 className="text-center mb-4">{t('profileButton.profile')}</h4>
      {user.username ? <ProfileForm user={user} /> : (
        <div className="d-flex justify-content-center align-items-center">
          {t('profile.entrace1')}
          <Nav role="button" className="nav-link px-2" onClick={() => modalShow('login')}>войдите</Nav>
          {t('profile.entrace2')}
          <Nav role="button" className="nav-link ps-2" onClick={() => modalShow('signup')}>зарегистрируйтесь</Nav>
        </div>
      )}
    </>
  );
};

export default MyProfile;
