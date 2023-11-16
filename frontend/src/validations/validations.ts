/* eslint-disable @typescript-eslint/no-explicit-any */
import * as yup from 'yup';
import { setLocale } from 'yup';

setLocale({
  mixed: {
    required: () => ('validation.required'),
    notOneOf: () => ('validation.uniq'),
    oneOf: () => ('validation.mastMatch'),
  },
  string: {
    min: () => ('validation.requirements'),
    max: () => ('validation.requirements'),
    length: () => ('validation.phone'),
    email: () => ('validation.email'),
  },
});

export const loginValidation = yup.object().shape({
  phone: yup
    .string()
    .trim()
    .required()
    .transform((value) => value.replace(/[^\d]/g, ''))
    .length(11),
  password: yup
    .string()
    .required(),
});

export const signupValidation = yup.object().shape({
  username: yup
    .string()
    .trim()
    .required()
    .min(3)
    .max(20),
  email: yup
    .string()
    .email()
    .trim()
    .required(),
  phone: yup
    .string()
    .trim()
    .required()
    .transform((value) => value.replace(/[^\d]/g, ''))
    .length(11),
  password: yup
    .string()
    .required()
    .min(6, 'validation.passMin'),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref('password')]),
});

export const emailValidation = yup.object().shape({
  email: yup
    .string()
    .email()
    .trim()
    .required(),
});

export const activationValidation = yup.object().shape({
  code: yup
    .string()
    .required()
    .transform((value) => value.replace(/[^\d]/g, ''))
    .test('code', 'Введите 4 цифры', (value) => value.length === 4),
});

export const createItemValidation = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required()
    .min(3),
  image: yup
    .mixed()
    .required('validation.imageRequired')
    .test('fileType', 'validation.imagePngType', (file: any) => file.type === 'image/png')
    .test('fileSize', 'validation.imageNoMore200kb', (file: any) => (file.size - 40000) / 1024 / 1024 < 0.2), // ~200 КБ
  unit: yup
    .string()
    .required(),
  count: yup
    .string()
    .required(),
  price: yup
    .string()
    .required(),
  composition: yup
    .string()
    .required(),
  foodValues: yup.object().shape({
    carbohydrates: yup
      .string()
      .required(),
    fats: yup
      .string()
      .required(),
    proteins: yup
      .string()
      .required(),
    ccal: yup
      .string()
      .required(),
  }),
  category: yup
    .string()
    .required(),
});
