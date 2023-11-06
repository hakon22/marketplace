import {
  Form, Button, Card, InputGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import ImgCrop from 'antd-img-crop';
import { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import notify from '../utilities/toast';
import roundingEldorado from '../utilities/roundingEldorado';
import routes from '../routes';

const CreateItem = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isDiscount, setIsDiscount] = useState(false);

  const formik = useFormik({
    initialValues: {
      image: '',
      name: '',
      unit: 'кг',
      count: '',
      price: '',
      discount: '',
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log(values);
        const { data } = await axios.post(routes.createItem, values, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (data.code === 1) {
          navigate(routes.homePage);
        } else if (data.code === 2) {
          setSubmitting(false);
        }
      } catch (e) {
        notify(t('toast.unknownError'), 'error');
        console.log(e);
      }
    },
  });

  const updatePrice = () => {
    const { price, discount } = formik.values;
    const newPrice = Number(price) * (1 - Number(discount) / 100);
    formik.setFieldValue('price', roundingEldorado(newPrice));
    setIsDiscount(false);
  };

  useEffect(() => {
    if (formik.values.discount && formik.values.price && !isDiscount) {
      setIsDiscount(true);
    }
  }, [formik.values.discount, formik.values.price]);

  return (
    <div className="marketplace d-flex justify-content-center">
      <Form onSubmit={formik.handleSubmit} className="col-12 col-xl-4">
        <Card className="card-item">
          <ImgCrop rotationSlider>
            <Upload
              className="picture-circle d-flex justify-content-center my-3"
              listType="picture-card"
              maxCount={1}
              onRemove={() => {
                formik.setFieldValue('image', '');
              }}
              beforeUpload={(file) => {
                formik.setFieldValue('image', file);
                return false;
              }}
            >
              <div>
                <PlusOutlined className="mb-2" />
                <div>Загрузить</div>
              </div>
            </Upload>
          </ImgCrop>
          <Card.Body className="pt-0 d-flex flex-column">
            <Form.Group className="mb-4" controlId="name">
              <Form.Label className="visually-hidden">Item name</Form.Label>
              <Form.Control
                size="sm"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={!!(formik.errors.name && formik.submitCount)}
                autoComplete="on"
                type="text"
                value={formik.values.name}
                name="name"
                placeholder="Введите название"
              />
              <Form.Control.Feedback type="invalid" tooltip>
                {formik.errors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Card.Text as="div">
              <div className="d-flex justify-content-between">
                <Form.Group className="col-7" controlId="price">
                  <Form.Label className="visually-hidden">Price</Form.Label>
                  <InputGroup size="sm" className="mb-3">
                    <Form.Control
                      placeholder="Цена"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={!!(formik.errors.price && formik.submitCount)}
                      autoComplete="on"
                      type="text"
                      value={formik.values.price}
                      name="price"
                    />
                    <InputGroup.Text id="inputGroup-price">₽</InputGroup.Text>
                  </InputGroup>
                  <Form.Control.Feedback type="invalid" tooltip>
                    {formik.errors.price}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3 col-4" controlId="unit">
                  <Form.Label className="visually-hidden">Unit</Form.Label>
                  <InputGroup size="sm">
                    <InputGroup.Text id="inputGroup-discount">за</InputGroup.Text>
                    <Form.Select
                      size="sm"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.unit}
                      name="unit"
                    >
                      <option value="кг">кг</option>
                      <option value="гр">гр</option>
                      <option value="шт">шт</option>
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
              </div>
              <div className="d-flex justify-content-between">
                <Form.Group className="mb-3 col-7" controlId="count">
                  <Form.Label className="visually-hidden">Count</Form.Label>
                  <Form.Control
                    size="sm"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.errors.count && formik.submitCount)}
                    autoComplete="on"
                    type="text"
                    value={formik.values.count}
                    name="count"
                    placeholder="Остаток"
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {formik.errors.count}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-4" controlId="discount">
                  <Form.Label className="visually-hidden">Discount</Form.Label>
                  <InputGroup size="sm">
                    <Form.Control
                      placeholder="Скидка"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={!!(formik.errors.discount && formik.submitCount)}
                      autoComplete="on"
                      type="text"
                      value={formik.values.discount}
                      name="discount"
                      disabled={!formik.values.price}
                    />
                    <InputGroup.Text id="inputGroup-discount">%</InputGroup.Text>
                  </InputGroup>
                  <Form.Control.Feedback type="invalid" tooltip>
                    {formik.errors.discount}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </Card.Text>
            <div className="d-flex justify-content-center my-2">
              {isDiscount ? (
                <Button variant="outline-success" type="button" onClick={updatePrice}>
                  Обновить цену
                </Button>
              ) : (
                <Button variant="success" type="submit" disabled={isDiscount || formik.isSubmitting}>
                  Добавить товар
                </Button>
              )}
            </div>
          </Card.Body>
        </Card>
      </Form>
    </div>
  );
};

export default CreateItem;
