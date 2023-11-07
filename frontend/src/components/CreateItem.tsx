import {
  Form, Button, Card, InputGroup, Spinner,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import ImgCrop from 'antd-img-crop';
import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Upload, Tooltip } from 'antd';
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
      discountPrice: '',
      composition: '',
      foodValues: {
        carbohydrates: '',
        fats: '',
        proteins: '',
        ccal: '',
      },
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
    formik.setFieldValue('discountPrice', roundingEldorado(newPrice));
    setTimeout(() => setIsDiscount(false), 1);
  };

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
              <div className="d-flex justify-content-between mb-3">
                <Form.Group className="col-7" controlId="price">
                  <Form.Label className="visually-hidden">Price</Form.Label>
                  <InputGroup size="sm">
                    {formik.values.discountPrice
                    && (
                    <Tooltip title="Цена со скидкой" color="green" placement="top">
                      <InputGroup.Text id="inputGroup-priceOrig" className="text-success">{formik.values.discountPrice}</InputGroup.Text>
                    </Tooltip>
                    )}
                    <Tooltip title={formik.values.discountPrice ? 'Старая цена' : ''} color="volcano" placement="topLeft">
                      <Form.Control
                        placeholder="Цена"
                        className={formik.values.discountPrice && 'text-danger'}
                        onChange={({ target }) => {
                          if (formik.values.discount && !isDiscount) {
                            setIsDiscount(true);
                          }
                          formik.setFieldValue('price', target.value.replace(/[^\d]/g, ''));
                        }}
                        onBlur={formik.handleBlur}
                        isInvalid={!!(formik.errors.price && formik.submitCount)}
                        autoComplete="on"
                        type="text"
                        value={formik.values.price}
                        name="price"
                      />
                    </Tooltip>
                    <InputGroup.Text id="inputGroup-price">₽</InputGroup.Text>
                  </InputGroup>
                  <Form.Control.Feedback type="invalid" tooltip>
                    {formik.errors.price}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-4" controlId="unit">
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
              <div className="d-flex justify-content-between mb-3">
                <Form.Group className="col-7" controlId="count">
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
                    placeholder="Остаток товара"
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
                      onChange={({ target }) => {
                        const value = target.value.replace(/[^\d]/g, '');
                        if (!value || Number(value) === 0 || Number(value) > 99) {
                          setIsDiscount(false);
                          formik.setFieldValue('discountPrice', '');
                          return formik.setFieldValue('discount', '');
                        } if (!isDiscount && value) {
                          setIsDiscount(true);
                        }
                        return formik.setFieldValue('discount', value);
                      }}
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
              <div className="mb-3">Пищевая ценность на 100гр:</div>
              <div className="d-flex justify-content-between mb-3">
                <Form.Group className="col-3" controlId="carbohydrates">
                  <Form.Label className="visually-hidden">Углеводы</Form.Label>
                  <Form.Control
                    size="sm"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.errors.foodValues?.carbohydrates && formik.submitCount)}
                    autoComplete="on"
                    type="text"
                    value={formik.values.foodValues.carbohydrates}
                    name="foodValues.carbohydrates"
                    placeholder="Углеводы"
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {formik.errors.foodValues?.carbohydrates}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-3" controlId="fats">
                  <Form.Label className="visually-hidden">Жиры</Form.Label>
                  <Form.Control
                    size="sm"
                    placeholder="Жиры"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.errors.foodValues?.fats && formik.submitCount)}
                    autoComplete="on"
                    type="text"
                    value={formik.values.foodValues.fats}
                    name="foodValues.fats"
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {formik.errors.foodValues?.fats}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-3" controlId="proteins">
                  <Form.Label className="visually-hidden">Белки</Form.Label>
                  <Form.Control
                    size="sm"
                    placeholder="Белки"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.errors.foodValues?.proteins && formik.submitCount)}
                    autoComplete="on"
                    type="text"
                    value={formik.values.foodValues.proteins}
                    name="foodValues.proteins"
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {formik.errors.foodValues?.proteins}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="col-3" controlId="ccal">
                  <Form.Label className="visually-hidden">Ккал</Form.Label>
                  <Form.Control
                    size="sm"
                    placeholder="Ккал"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.errors.foodValues?.ccal && formik.submitCount)}
                    autoComplete="on"
                    type="text"
                    value={formik.values.foodValues.ccal}
                    name="foodValues.ccal"
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {formik.errors.foodValues?.ccal}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <Form.Group className="mb-3" controlId="composition">
                <Form.Label className="visually-hidden">Сосав</Form.Label>
                <Form.Control
                  size="sm"
                  as="textarea"
                  placeholder="Опишите состав"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!(formik.errors.composition && formik.submitCount)}
                  autoComplete="on"
                  type="text"
                  value={formik.values.composition}
                  name="composition"
                />
                <Form.Control.Feedback type="invalid" tooltip>
                  {formik.errors.composition}
                </Form.Control.Feedback>
              </Form.Group>
            </Card.Text>
            <div className="d-flex justify-content-center">
              {isDiscount ? (
                <Button variant="outline-success" onClick={updatePrice}>
                  Обновить цену
                </Button>
              ) : (
                <Button variant="success" type="submit" disabled={formik.isSubmitting}>
                  {formik.isSubmitting
                    ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        variant="success"
                      />
                    )
                    : 'Добавить товар'}
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
