import { Form, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { useAppDispatch } from '../../utilities/hooks';
import type { InitialStateType } from '../../types/InitialState';
import { signupValidation } from '../../validations/validations';

const ProfileForm = ({ user }: { user: InitialStateType }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { username, email, phone } = user;

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

  return (
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
