import { Form, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { useAppDispatch } from '../../utilities/hooks';
import type { InitialStateType } from '../../types/InitialState';
import { profileValidation } from '../../validations/validations';
import formClass from '../../utilities/formClass';

type FormikValues = { [key: string]: string | undefined };

const ProfileForm = ({ user }: { user: InitialStateType }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { username, email, phone } = user;

  const [isChange, setIsChange] = useState(false);

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
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      try {
        const initialObject: FormikValues = {};
        const changedValues = Object.keys(values).reduce((acc, key) => {
          if (initialValues[key] === values[key] || key === 'confirmPassword') {
            return acc;
          }
          return { ...acc, [key]: values[key] };
        }, initialObject);
        console.log(changedValues);
      } catch (e) {
        console.log(e);
      }
    },
  });

  return (
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
            <Form.Group className={formClass('confirmPassword', 'mb-3 d-flex align-items-center gap-2', formik)} controlId="confirmPassword">
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
            <Form.Group className={formClass('oldPassword', 'mb-3 d-flex align-items-center gap-2', formik)} controlId="oldPassword">
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
        <div className="d-flex justify-content-center">
          {!isChange && <Button variant="warning" onClick={() => setIsChange(true)}>Изменить данные</Button>}
          {isChange && (
          <div className="d-flex w-100 justify-content-between">
            <Button variant="success" type="submit">Сохранить</Button>
            <Button
              variant="danger"
              onClick={() => {
                formik.resetForm();
                setIsChange(false);
              }}
            >
              Отмена
            </Button>
          </div>
          )}
        </div>
      </Form>
      <div className="col-12 col-md-5 d-flex flex-column justify-content-center align-items-center">
        <h5 className="mb-3">Мои адреса:</h5>
        <Button variant="warning" onClick={() => setIsChange(true)}>Добавить адрес</Button>
      </div>
    </div>
  );
};

export default ProfileForm;
