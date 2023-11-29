import { Form, Button, Nav } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import InputMask from 'react-input-mask';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { useAppDispatch, useAppSelector } from '../../utilities/hooks';
import { signupValidation } from '../../validations/validations';
import { ModalContext } from '../Context';

const ProfileForm = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { modalShow } = useContext(ModalContext);

  const {
    username, email, phone, loadingStatus,
  } = useAppSelector((state) => state.login);

  const [isChange, setIsChange] = useState(false);

  const formik = useFormik({
    initialValues: {
      username,
      email,
      phone,
      password: '',
      confirmPassword: '',
    },
    validationSchema: signupValidation,
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      try {
        console.log(values);
      } catch (e) {
        console.log(e);
      }
    },
  });

  useEffect(() => {
    if (!username) {
      modalShow('login');
    }
  }, []);

  return username && loadingStatus === 'finish' ? (
    <div className="d-flex justify-content-between">
      <Form onSubmit={formik.handleSubmit} className="col-12 col-md-5">
        <Form.Group className="mb-3 d-flex align-items-center gap-2" controlId="username">
          <Form.Label className="col-12 col-md-4">Имя</Form.Label>
          <Form.Control
            type="text"
            placeholder="Имя"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting || !isChange}
            isInvalid={!!(formik.errors.username && formik.submitCount)}
            name="username"
            autoComplete="on"
          />
          <Form.Control.Feedback type="invalid" tooltip className="anim-show">
            {t(formik.errors.username ?? '')}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3 d-flex align-items-center gap-2" controlId="email">
          <Form.Label className="col-12 col-md-4">Почта</Form.Label>
          <Form.Control
            type="email"
            placeholder="Почта"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting || !isChange}
            isInvalid={!!(formik.errors.email && formik.submitCount)}
            name="email"
            autoComplete="on"
          />
          <Form.Control.Feedback type="invalid" tooltip className="anim-show">
            {t(formik.errors.email ?? '')}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3 d-flex align-items-center gap-2" controlId="phone">
          <Form.Label className="col-12 col-md-4">Телефон</Form.Label>
          <Form.Control
            as={InputMask}
            mask="+7 (999)-999-99-99"
            type="text"
            placeholder="Телефон"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting || !isChange}
            isInvalid={!!(formik.errors.phone && formik.submitCount)}
            name="phone"
            autoComplete="on"
          />
          <Form.Control.Feedback type="invalid" tooltip className="anim-show">
            {t(formik.errors.phone ?? '')}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3 d-flex align-items-center gap-2" controlId="password">
          <Form.Label className="col-12 col-md-4">Пароль</Form.Label>
          <Form.Control
            type="password"
            placeholder="Пароль"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting || !isChange}
            isInvalid={!!(formik.errors.password && formik.submitCount)}
            name="password"
            autoComplete="on"
          />
          <Form.Control.Feedback type="invalid" tooltip className="anim-show">
            {t(formik.errors.password ?? '')}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-4 d-flex align-items-center gap-2" controlId="confirmPassword">
          <Form.Label className="col-12 col-md-4">Подтвердите пароль</Form.Label>
          <Form.Control
            type="password"
            placeholder="Подтвердите пароль"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting || !isChange}
            isInvalid={!!(formik.errors.confirmPassword && formik.submitCount)}
            name="confirmPassword"
            autoComplete="on"
          />
          <Form.Control.Feedback type="invalid" tooltip className="anim-show">
            {t(formik.errors.confirmPassword ?? '')}
          </Form.Control.Feedback>
        </Form.Group>
        <div className="d-flex justify-content-center">
          <Button variant="warning" onClick={() => setIsChange(true)}>Изменить данные</Button>
        </div>
      </Form>
      <div className="col-12 col-md-5 d-flex flex-column justify-content-center align-items-center">
        <h5 className="mb-3">Мои адреса:</h5>
        <Button variant="warning" onClick={() => setIsChange(true)}>Добавить адрес</Button>
      </div>
    </div>
  ) : (
    <div className="d-flex justify-content-center align-items-center">
      {t('profile.entrace1')}
      <Nav role="button" className="nav-link px-2" onClick={() => modalShow('login')}>войдите</Nav>
      {t('profile.entrace2')}
      <Nav role="button" className="nav-link ps-2" onClick={() => modalShow('signup')}>зарегистрируйтесь</Nav>
    </div>
  );
};

export default ProfileForm;
