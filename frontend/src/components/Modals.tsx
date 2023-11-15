import { useRef, useContext, useState } from 'react';
import {
  Form, Modal, Button, Spinner, FloatingLabel, Alert,
} from 'react-bootstrap';
import InputMask from 'react-input-mask';
import {
  PlusCircle, DashCircle, XCircle, Check2Circle,
} from 'react-bootstrap-icons';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { Badge, Tooltip } from 'antd';
import axios from 'axios';
import { toLower, capitalize } from 'lodash';
import { useAppDispatch } from '../utilities/hooks';
import routes from '../routes';
import { changeEmailActivation, fetchLogin } from '../slices/loginSlice';
import { cartUpdate, cartRemove, cartRemoveAll } from '../slices/cartSlice';
import notify from '../utilities/toast';
import formClass from '../utilities/formClass';
import textFieldGen from '../utilities/textFieldGen';
import AuthContext, { MobileContext, ScrollContext } from './Context';
import { emailValidation, loginValidation, signupValidation } from '../validations/validations';
import { ModalActivateProps, ModalCartProps, ModalProps } from '../types/Modal';

const ModalChangeActivationEmail = ({
  id, email, onHide, show,
}: ModalActivateProps) => {
  const { t } = useTranslation();
  const input = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { setMarginScroll } = useContext(ScrollContext);

  const formik = useFormik({
    initialValues: {
      email,
    },
    validationSchema: emailValidation,
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      try {
        values.email = toLower(values.email);
        const { data } = await axios.post(routes.activationChangeEmail, { ...values, id });
        if (data.code === 1) {
          dispatch(changeEmailActivation(values.email));
          onHide();
          notify(t('toast.changeEmailSuccess'), 'success');
        } else if (data.code === 2) {
          setSubmitting(false);
          setFieldError('email', t('validation.emailAlreadyExists'));
        } else if (!data) {
          navigate(routes.loginPage);
          notify(t('toast.doesNotRequireActivation'), 'error');
        }
      } catch (e) {
        notify(t('toast.unknownError'), 'error');
        console.log(e);
      }
    },
  });

  return (
    <Modal
      show={show === 'activation'}
      onEnter={setMarginScroll}
      onExited={setMarginScroll}
      onHide={() => {
        onHide();
        formik.errors.email = '';
      }}
      centered
      onShow={() => {
        formik.values.email = email;
        setTimeout(() => input.current?.select(), 1);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.changeEmail.changeEmailTitle')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={formik.handleSubmit}
        >
          <Form.Group className="position-relative" controlId="email">
            <Form.Label className="visually-hidden">{t('modal.changeEmail.newEmail')}</Form.Label>
            <Form.Control
              autoFocus
              ref={input}
              className="mb-3-5 mt-1"
              onChange={formik.handleChange}
              value={formik.values.email}
              disabled={formik.isSubmitting}
              isInvalid={!!(formik.errors.email && formik.touched.email)}
              onBlur={formik.handleBlur}
              name="email"
            />
            <Form.Control.Feedback type="invalid" tooltip className="anim-show">
              {t(formik.errors.email ?? '')}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button
              className="me-2"
              variant="secondary"
              onClick={() => {
                onHide();
                formik.errors.email = '';
              }}
            >
              {t('modal.changeEmail.close')}
            </Button>
            <Button variant="success" type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : t('modal.changeEmail.submitChange')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export const ModalRecovery = ({ onHide, show }: ModalProps) => {
  const { t } = useTranslation();
  const { setMarginScroll } = useContext(ScrollContext);

  const [sendMail, setSendMail] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: emailValidation,
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      try {
        values.email = toLower(values.email);
        const { data } = await axios.post(routes.recoveryPassword, values);
        if (data.code === 1) {
          setSendMail(values.email);
          notify(t('toast.emailSuccess'), 'success');
        } else if (data.code === 2) {
          setSubmitting(false);
          setFieldError('email', t('validation.userNotAlreadyExists'));
        }
      } catch (e) {
        notify(t('toast.unknownError'), 'error');
        console.log(e);
      }
    },
  });

  return (
    <Modal
      show={show === 'recovery'}
      contentClassName="modal-bg"
      onHide={onHide}
      onEnter={setMarginScroll}
      onExited={setMarginScroll}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-center w-100">{t('recoveryForm.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center">
        {sendMail ? (
          <Alert className="col-12 col-md-5 text-center mb-0">
            <span>{t('recoveryForm.toYourMail')}</span>
            <br />
            <span><b>{sendMail}</b></span>
            <br />
            <span>{t('recoveryForm.postNewPassword')}</span>
          </Alert>
        ) : (
          <Form
            onSubmit={formik.handleSubmit}
            className="col-12 col-md-9 my-3"
          >
            <FloatingLabel className={formClass('email', 'mb-3', formik)} label={t('signupForm.email')} controlId="email">
              <Form.Control
                autoFocus
                type="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                disabled={formik.isSubmitting}
                isInvalid={!!(formik.errors.email && formik.submitCount)}
                onBlur={formik.handleBlur}
                name="email"
                autoComplete="on"
                placeholder={t('signupForm.email')}
              />
              <Form.Control.Feedback type="invalid" tooltip className="anim-show">
                {t(formik.errors.email ?? '')}
              </Form.Control.Feedback>
            </FloatingLabel>
            <Button variant="warning" className="w-100" type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : t('loginForm.recovery')}
            </Button>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <span>{t('recoveryForm.rememberPassword')}</span>
        <Link to={routes.loginPage}>{t('loginForm.submit')}</Link>
      </Modal.Footer>
    </Modal>
  );
};

export const ModalLogin = ({ onHide, show }: ModalProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { logIn } = useContext(AuthContext);
  const { setMarginScroll } = useContext(ScrollContext);

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
          onHide();
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
    <Modal
      show={show === 'login'}
      contentClassName="modal-bg"
      onHide={onHide}
      onEnter={setMarginScroll}
      onExited={setMarginScroll}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-center w-100">{t('loginForm.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center">
        <Form
          onSubmit={formik.handleSubmit}
          className="col-12 col-md-9 my-3"
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
              {t(formik.errors.phone ?? '')}
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
              {t(formik.errors.password ?? '')}
            </Form.Control.Feedback>
          </FloatingLabel>
          {formik.submitCount > 2 && (
          <Alert className="mb-3 text-start pt-1 pb-1">
            <span>{t('loginForm.forgotPassword')}</span>
            <Alert.Link
              className="text-primary"
              onClick={() => {
                onHide();
                setTimeout(() => onHide('recovery'), 300);
              }}
            >
              {t('loginForm.recovery')}
            </Alert.Link>
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
          <Button variant="warning" className="w-100" type="submit" disabled={formik.isSubmitting}>
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
      </Modal.Body>
      <Modal.Footer>
        <span>{t('loginForm.notAccount')}</span>
        <Alert.Link
          className="text-primary"
          onClick={() => {
            onHide();
            setTimeout(() => onHide('signup'), 300);
          }}
        >
          {t('signupForm.title')}
        </Alert.Link>
      </Modal.Footer>
    </Modal>
  );
};

export const ModalSignup = ({ onHide, show }: ModalProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setMarginScroll } = useContext(ScrollContext);

  const formik = useFormik<{ [key: string]: string }>({
    initialValues: {
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: signupValidation,
    onSubmit: async (values, { setFieldError, setSubmitting, resetForm }) => {
      try {
        values.username = capitalize(values.username);
        values.email = toLower(values.email);
        const { data: { code, id, errorsFields } } = await axios.post(routes.signup, values);
        if (code === 1) {
          onHide();
          resetForm();
          navigate(`${routes.activationUrlPage}${id}`);
        } else if (code === 2) {
          setSubmitting(false);
          errorsFields.forEach((field: ('email' | 'phone')) => {
            setFieldError(field, t('validation.userAlreadyExists'));
          });
        } else if (!code) {
          setSubmitting(false);
          notify(t('toast.networkError'), 'error');
        }
      } catch (e) {
        notify(t('toast.unknownError'), 'error');
        console.log(e);
      }
    },
  });

  return (
    <Modal
      show={show === 'signup'}
      contentClassName="modal-bg"
      onHide={onHide}
      onEnter={setMarginScroll}
      onExited={setMarginScroll}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-center w-100">{t('signupForm.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center">
        <Form
          onSubmit={formik.handleSubmit}
          className="col-12 col-md-9 my-3"
        >
          {Object.keys(formik.values).map((key) => {
            const { type } = textFieldGen(key);
            return (
              <FloatingLabel key={key} className={formClass(key, 'mb-3', formik)} label={t(`signupForm.${[key]}`)} controlId={key}>
                <Form.Control
                  as={key === 'phone' ? InputMask : undefined}
                  mask={key === 'phone' ? '+7 (999)-999-99-99' : ''}
                  type={type}
                  onChange={formik.handleChange}
                  value={formik.values[key]}
                  disabled={formik.isSubmitting}
                  isInvalid={!!(formik.errors[key] && formik.submitCount)}
                  isValid={!!(!formik.errors[key] && formik.submitCount)}
                  onBlur={formik.handleBlur}
                  name={key}
                  autoComplete="on"
                  placeholder={t(`signupForm.${[key]}`)}
                />
                <Form.Control.Feedback type="invalid" tooltip className="anim-show">
                  {t(formik.errors[key] ?? '')}
                </Form.Control.Feedback>
              </FloatingLabel>
            );
          })}
          <Button variant="warning" className="w-100" type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : t('signupForm.submit')}
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <span>{t('signupForm.haveAccount')}</span>
        <Alert.Link
          className="text-primary"
          onClick={() => {
            onHide();
            setTimeout(() => onHide('login'), 300);
          }}
        >
          {t('loginForm.submit')}
        </Alert.Link>
      </Modal.Footer>
    </Modal>
  );
};

export const ModalCart = ({
  items, priceAndCount, onHide, show,
}: ModalCartProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const isMobile = useContext(MobileContext);
  const { setMarginScroll } = useContext(ScrollContext);

  const setCount = (id: number, count: number) => (count < 1
    ? dispatch(cartRemove(id))
    : dispatch(cartUpdate({ id, changes: { count } })));

  return (
    <Modal
      show={show === 'cart' && !!priceAndCount.count}
      onHide={onHide}
      dialogClassName={isMobile ? '' : 'mw-50'}
      onEnter={setMarginScroll}
      onExited={setMarginScroll}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.cart.title')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={(e) => {
        e.preventDefault();
        onHide('order');
        dispatch(cartRemoveAll());
      }}
      >
        <Modal.Body className="d-flex flex-column gap-3">
          {items.map((item) => {
            if (item) {
              const {
                id, name, price, discountPrice, count, image, unit,
              } = item;
              return (
                <div key={id} className="row d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center mb-3 mb-xl-0 col-12 col-xl-5">
                    <img src={image} alt={name} className="col-3 col-xl-2 me-4" />
                    <span className="col-9 col-xl-6 fw-bold">{name}</span>
                  </div>
                  <span className="col-5 col-xl-3 fs-5 text-xl-center d-flex align-items-center gap-2">
                    <DashCircle
                      role="button"
                      title={t('modal.cart.decrease')}
                      className="icon-hover"
                      onClick={() => {
                        setCount(id, count - 1);
                      }}
                    />
                    {`${count} ${unit}`}
                    <PlusCircle
                      role="button"
                      title={t('modal.cart.increase')}
                      className="icon-hover"
                      onClick={() => {
                        setCount(id, count + 1);
                      }}
                    />
                  </span>
                  <span className="col-5 col-xl-3 fs-6">{t('modal.cart.price', { price: (discountPrice || price) * count })}</span>
                  <span className="col-2 col-xl-1 d-flex align-items-center">
                    <XCircle
                      role="button"
                      title={t('modal.cart.remove')}
                      className="fs-5 icon-hover"
                      onClick={() => {
                        dispatch(cartRemove(id));
                      }}
                    />
                  </span>
                </div>
              );
            }
            return undefined;
          })}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between py-4">
          <div className="d-flex gap-2">
            <Button variant="success" size="sm" type="submit">{t('modal.cart.sendOrder')}</Button>
            <Button
              variant="danger"
              size="sm"
              type="button"
              onClick={() => {
                dispatch(cartRemoveAll());
              }}
            >
              {t('modal.cart.clearCart')}
            </Button>
          </div>
          <Tooltip title={priceAndCount.discount ? t('modal.cart.discount', { discount: priceAndCount.discount }) : null} color="green" placement="top" trigger={['click', 'hover']}>
            <Badge count={priceAndCount.discount && <Badge status="processing" color="green" />} offset={[5, 0]}>
              <span className="text-end fw-bolder fs-6">
                {t('modal.cart.summ', { price: priceAndCount.price })}
              </span>
            </Badge>
          </Tooltip>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export const ModalOrder = ({ onHide, show }: ModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      show={show === 'order'}
      onHide={onHide}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="d-inline">
          <Check2Circle className="text-success fs-3 me-1" style={{ verticalAlign: '-0.23em' }} />
          <span>{t('modal.cart.orderAccept')}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="fs-4">{t('modal.cart.gratitude')}</div>
        <div className="d-flex justify-content-end">
          <Button
            className="me-2"
            variant="secondary"
            onClick={() => onHide()}
          >
            {t('modal.changeEmail.close')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalChangeActivationEmail;
