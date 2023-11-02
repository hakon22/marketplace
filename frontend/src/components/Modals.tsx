import { useRef, useState } from 'react';
import {
  Form, Modal, Button, Spinner,
} from 'react-bootstrap';
import { PlusCircle, DashCircle, XCircle } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import axios from 'axios';
import { toLower } from 'lodash';
import { useAppDispatch } from '../utilities/hooks';
import routes from '../routes';
import { changeEmailActivation } from '../slices/loginSlice';
import { cartUpdate, cartRemove, cartRemoveAll } from '../slices/cartSlice';
import notify from '../utilities/toast';
import { emailValidation } from '../validations/validations';
import { ModalActivateProps, ModalCartProps } from '../types/Props';

const ModalChangeActivationEmail = ({
  id, email, onHide, show,
}: ModalActivateProps) => {
  const { t } = useTranslation();
  const input = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
      show={show}
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
        <Modal.Title>{t('modal.changeEmailTitle')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={formik.handleSubmit}
        >
          <Form.Group className="position-relative" controlId="email">
            <Form.Label className="visually-hidden">{t('modal.newEmail')}</Form.Label>
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
              {t(formik.errors.email)}
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
              {t('modal.close')}
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
              ) : t('modal.submitChange')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export const ModalCart = ({
  items, priceAndCount, onHide, show, setMarginScroll,
}: ModalCartProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [isSendOrder, setIsSetOrder] = useState(false);

  const setCount = (id: number, count: number) => (count < 1
    ? dispatch(cartRemove(id))
    : dispatch(cartUpdate({ id, changes: { count } })));

  return isSendOrder ? (
    <Modal
      show={show}
      onHide={() => {
        onHide(true);
        dispatch(cartRemoveAll());
      }}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Заказ принят!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="fs-4">Спасибо за заказ!</div>
        <div className="d-flex justify-content-end">
          <Button
            className="me-2"
            variant="secondary"
            onClick={() => {
              onHide(true);
              dispatch(cartRemoveAll());
            }}
          >
            {t('modal.close')}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  ) : (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName="mw-50"
      onEnter={setMarginScroll}
      onExited={setMarginScroll}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Ваш заказ:</Modal.Title>
      </Modal.Header>
      <Form onSubmit={() => {
        setIsSetOrder(true);
      }}
      >
        <Modal.Body className="d-flex flex-column gap-3">
          {items.map((item) => {
            if (item) {
              const {
                id, name, price, count, image, unit,
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
                      className="icon-hover"
                      onClick={() => {
                        setCount(id, count - 1);
                      }}
                    />
                    {`${count} ${unit}`}
                    <PlusCircle
                      role="button"
                      className="icon-hover"
                      onClick={() => {
                        setCount(id, count + 1);
                      }}
                    />
                  </span>
                  <span className="col-5 col-xl-3 fs-6">{`${price * count},00 ₽`}</span>
                  <span className="col-2 col-xl-1 d-flex align-items-center">
                    <XCircle
                      role="button"
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
            <Button variant="success" size="sm" type="submit">Оформить заказ</Button>
            <Button
              variant="danger"
              size="sm"
              type="button"
              onClick={() => {
                dispatch(cartRemoveAll());
              }}
            >
              Очистить корзину
            </Button>
          </div>
          <span className="text-end fw-bolder fs-6">
            {`Сумма: ${priceAndCount.price},00 ₽`}
          </span>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalChangeActivationEmail;
