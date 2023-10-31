import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useContext, useState } from 'react';
import { toLower } from 'lodash';
import {
  Button, Form, FloatingLabel, Image, Spinner, Alert,
} from 'react-bootstrap';
import axios from 'axios';
import orange from '../images/orange.svg';
import MobileContext from './Context';
import notify from '../utilities/toast';
import formClass from '../utilities/formClass';
import { emailValidation } from '../validations/validations';
import routes from '../routes';

const RecoveryForm = () => {
  const { t } = useTranslation();
  const isMobile = useContext(MobileContext);

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
    <div className="d-flex justify-content-center align-items-center gap-5">
      {!isMobile && <Image className="w-25 h-25 me-4" src={orange} alt={t('recoveryForm.title')} roundedCircle />}
      {sendMail ? (
        <Alert className="col-12 col-md-5 text-center mb-0">
          <span>{t('recoveryForm.toYourMail')}</span>
          <br />
          <span><b>{sendMail}</b></span>
          <p>{t('recoveryForm.postNewPassword')}</p>
        </Alert>
      ) : (
        <Form
          onSubmit={formik.handleSubmit}
          className="col-12 col-md-5"
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
              {t(formik.errors.email)}
            </Form.Control.Feedback>
          </FloatingLabel>
          <Button variant="outline-primary" className="w-100" type="submit" disabled={formik.isSubmitting}>
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
    </div>
  );
};

export default RecoveryForm;
