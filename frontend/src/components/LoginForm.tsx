import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import InputMask from 'react-input-mask';
import {
  Button, Form, FloatingLabel, Image, Alert, Spinner,
} from 'react-bootstrap';
import pear from '../images/pear.svg';
import { fetchLogin } from '../slices/loginSlice';
import AuthContext, { MobileContext } from './Context';
import { loginValidation } from '../validations/validations';
import { useAppDispatch } from '../utilities/hooks';
import formClass from '../utilities/formClass';
import routes from '../routes';

const LoginForm = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { logIn } = useContext(AuthContext);
  const isMobile = useContext(MobileContext);

  const formik = useFormik({
    initialValues: {
      phone: '',
      password: '',
      save: false,
    },
    validationSchema: loginValidation,
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      try {
        const {
          payload: { code, user },
        } = await dispatch(fetchLogin(values));
        if (code === 1) {
          if (values.save) {
            window.localStorage.setItem('refresh_token', user.refreshToken);
          }
          logIn();
        } else if (code === 4) {
          setSubmitting(false);
          setFieldError('phone', t('validation.userNotAlreadyExists'));
        } else if (code === 3) {
          setSubmitting(false);
          setFieldError('password', t('validation.incorrectPassword'));
        } else if (code === 2) {
          setSubmitting(false);
          setFieldError('phone', t('validation.accountNotActivated'));
        } else if (!code) {
          setSubmitting(false);
        }
      } catch (e) {
        console.log(e);
      }
    },
  });

  return (
    <div className="d-flex justify-content-center gap-5">
      {!isMobile && <Image className="w-25 h-25 mt-md-3 mt-xxl-1 me-4" src={pear} alt={t('loginForm.title')} roundedCircle />}
      <Form
        onSubmit={formik.handleSubmit}
        className="col-12 col-md-5"
      >
        <FloatingLabel className={formClass('phone', 'mb-3', formik)} label={t('loginForm.phone')} controlId="phone">
          <Form.Control
            as={InputMask}
            mask="+7 (999)-999-99-99"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.phone}
            disabled={formik.isSubmitting}
            isInvalid={!!(formik.errors.phone && formik.submitCount)}
            isValid={!!(!formik.errors.phone && formik.submitCount)}
            onBlur={formik.handleBlur}
            name="phone"
            autoComplete="on"
            placeholder={t('loginForm.phone')}
          />
          <Form.Control.Feedback type="invalid" tooltip className="anim-show">
            {t(formik.errors.phone)}
          </Form.Control.Feedback>
        </FloatingLabel>

        <FloatingLabel className={formClass('password', 'mb-3', formik)} label={t('loginForm.password')} controlId="password">
          <Form.Control
            onChange={formik.handleChange}
            value={formik.values.password}
            disabled={formik.isSubmitting}
            isInvalid={!!(formik.errors.password && formik.submitCount)}
            isValid={!!(!formik.errors.password && formik.submitCount)}
            onBlur={formik.handleBlur}
            name="password"
            type="password"
            placeholder={t('loginForm.password')}
          />
          <Form.Control.Feedback type="invalid" tooltip className="anim-show">
            {t(formik.errors.password)}
          </Form.Control.Feedback>
        </FloatingLabel>
        {formik.submitCount > 2 && (
          <Alert className="mb-3 text-start pt-1 pb-1">
            <span>{t('loginForm.forgotPassword')}</span>
            <Link to={routes.recoveryPasswordPage}>{t('loginForm.recovery')}</Link>
          </Alert>
        )}
        <Form.Check
          className="mb-2 text-start"
          onChange={formik.handleChange}
          disabled={formik.isSubmitting}
          onBlur={formik.handleBlur}
          type="checkbox"
          id="save"
          name="save"
          label={t('loginForm.checkbox')}
        />
        <Button variant="outline-primary" className="w-100" type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : t('loginForm.submit')}
        </Button>
      </Form>
    </div>
  );
};

export default LoginForm;
