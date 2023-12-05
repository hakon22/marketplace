import { Form, Button, Spinner } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import InputMask from 'react-input-mask';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { Spin } from 'antd';
import { isEmpty, toLower, capitalize } from 'lodash';
import axios from 'axios';
import { useAppDispatch } from '../../utilities/hooks';
import { changeUserData } from '../../slices/loginSlice';
import type { InitialStateType } from '../../types/InitialState';
import { profileValidation } from '../../validations/validations';
import { ModalContext } from '../Context';
import formClass from '../../utilities/formClass';
import { ModalConfirmEmail } from '../Modals';
import notify from '../../utilities/toast';
import routes from '../../routes';

type FormikValues = { [key: string]: string | undefined };

type ChangeDataParams = (
  values: FormikValues,
  setSubmitting: (value: boolean) => void,
  setFieldValue: (field: string, value: string) => void,
  setFieldError: (field: string, value: string) => void,
) => Promise<void>;

const ProfileForm = ({ user }: { user: InitialStateType }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { show, modalClose, modalShow } = useContext(ModalContext);

  const {
    username, email, phone, token,
  } = user;

  const [isChange, setIsChange] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [changedData, setChangedData] = useState<FormikValues>({});

  const changeData: ChangeDataParams = async (
    values,
    setSubmitting,
    setFieldValue,
    setFieldError,
  ) => {
    const { data } = await axios.post(routes.changeData, values, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (data.code === 1) {
      dispatch(changeUserData(data.newDataValues));
      setIsChange(false);
      if (values.password) {
        setFieldValue('password', '');
        setFieldValue('confirmPassword', '');
        setFieldValue('oldPassword', '');
      }
      notify(t('toast.changeDataSuccess'), 'success');
    } else if (data.code === 2) {
      setSubmitting(false);
      data.errorsFields.forEach((field: 'email' | 'phone') => {
        setFieldError(field, t('validation.userAlreadyExists'));
      });
    } else if (data.code === 3) {
      setSubmitting(false);
      setFieldError('oldPassword', t('validation.incorrectPassword'));
    }
    setIsConfirmed(false);
  };

  const initialValues: FormikValues = {
    username,
    email,
    phone,
    password: '',
    confirmPassword: '',
    oldPassword: '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema: profileValidation,
    onSubmit: async (values, { setFieldError, setSubmitting, setFieldValue }) => {
      try {
        const initialObject: FormikValues = {};
        // получаем изменённые данные
        const changedValues = Object.keys(values).reduce((acc, key) => {
          if (initialValues[key] === values[key] || key === 'confirmPassword') {
            return acc;
          }
          return { ...acc, [key]: values[key] };
        }, initialObject);
        if (isEmpty(changedValues)) { // если ничего не изменилось, отменяем изменение
          setIsChange(false);
        } else {
          if (changedValues.username) {
            changedValues.username = capitalize(changedValues.username);
            setFieldValue('username', changedValues.username);
          }
          if (changedValues.email) { // если изменялась почта, отсылаем письмо для проверки
            changedValues.email = toLower(changedValues.email);
            setFieldValue('email', changedValues.email);
            const sendObject = { email: changedValues.email, phone: changedValues.phone };
            const { data } = await axios.post(routes.confirmEmail, sendObject, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (data.code === 3) { // такой пользователь уже существует
              setSubmitting(false);
              data.errorsFields.forEach((field: 'email' | 'phone') => {
                setFieldError(field, t('validation.userAlreadyExists'));
              });
            } else if (data.code === 4) { // письмо отправлено, ожидаем проверки
              setChangedData(changedValues);
              modalShow('confirmEmail');
            }
          } else { // если почта не изменялась, просто меняем данные
            await changeData(changedValues, setSubmitting, setFieldValue, setFieldError);
          }
        }
      } catch (e) {
        notify(t('toast.unknownError'), 'error');
        console.log(e);
      }
    },
  });

  const cancelChange = () => {
    if (!isConfirmed) {
      setIsChange(false);
      formik.resetForm();
    }
    modalClose();
  };

  useEffect(() => {
    if (isConfirmed) {
      modalClose();
      changeData(changedData, formik.setSubmitting, formik.setFieldValue, formik.setFieldError);
    }
  }, [isConfirmed]);

  return (
    <>
      <ModalConfirmEmail show={show} onHide={cancelChange} setIsConfirmed={setIsConfirmed} />
      <Spin spinning={isConfirmed} tip="Сохранение..." size="large" fullscreen />
      <div className="d-flex justify-content-between">
        <Form onSubmit={formik.handleSubmit} className="col-12 col-md-5">
          <Form.Group className={formClass('username', 'mb-3 d-flex align-items-center gap-2', formik)}>
            <Form.Label className="col-12 col-md-4">Имя</Form.Label>
            <div className="position-relative w-100">
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
            </div>
          </Form.Group>
          <Form.Group className={formClass('email', 'mb-3 d-flex align-items-center gap-2', formik)} controlId="email">
            <Form.Label className="col-12 col-md-4">Почта</Form.Label>
            <div className="position-relative w-100">
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
            </div>
          </Form.Group>
          <Form.Group className={formClass('phone', 'mb-3 d-flex align-items-center gap-2', formik)} controlId="phone">
            <Form.Label className="col-12 col-md-4">Телефон</Form.Label>
            <div className="position-relative w-100">
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
            </div>
          </Form.Group>
          <Form.Group className={formClass('password', 'mb-3 d-flex align-items-center gap-2', formik)} controlId="password">
            <Form.Label className="col-12 col-md-4">Пароль</Form.Label>
            <div className="position-relative w-100">
              <Form.Control
                type="password"
                placeholder="••••••"
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
            </div>
          </Form.Group>
          {formik.values.password && (
          <>
            <Form.Group className={formClass('confirmPassword', 'mb-3 d-flex align-items-center gap-2 animate__animated animate__fadeInDown', formik)} controlId="confirmPassword">
              <Form.Label className="col-12 col-md-4">Подтвердите пароль</Form.Label>
              <div className="position-relative w-100">
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
              </div>
            </Form.Group>
            <Form.Group className={formClass('oldPassword', 'mb-3 d-flex align-items-center gap-2 animate__animated animate__fadeInDown', formik)} controlId="oldPassword">
              <Form.Label className="col-12 col-md-4">Старый пароль</Form.Label>
              <div className="position-relative w-100">
                <Form.Control
                  type="password"
                  placeholder="Введите старый пароль"
                  value={formik.values.oldPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={formik.isSubmitting || !isChange}
                  isInvalid={!!(formik.errors.oldPassword && formik.submitCount)}
                  name="oldPassword"
                  autoComplete="on"
                />
                <Form.Control.Feedback type="invalid" tooltip className="anim-show">
                  {t(formik.errors.oldPassword ?? '')}
                </Form.Control.Feedback>
              </div>
            </Form.Group>
          </>
          )}
          <div className="d-flex justify-content-end gap-2">
            {!isChange && <Button variant="warning" onClick={() => setIsChange(true)}>Изменить данные</Button>}
            {isChange && (
            <>
              <Button variant="success" type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : 'Сохранить'}
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  formik.resetForm();
                  setIsChange(false);
                }}
                disabled={formik.isSubmitting}
              >
                Отмена
              </Button>
            </>
            )}
          </div>
        </Form>
        <div className="col-12 col-md-5 d-flex flex-column justify-content-center align-items-center">
          <h5 className="mb-3">Мои адреса:</h5>
          <Button variant="warning" onClick={() => setIsChange(true)}>Добавить адрес</Button>
        </div>
      </div>
    </>
  );
};

export default ProfileForm;
