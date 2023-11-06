const apiPath = '/marketplace/api';

interface ApiUrl {
  [key: string]: string;
}

export default {
  homePage: '/',
  loginPage: '/login',
  signupPage: '/signup',
  recoveryPasswordPage: '/recovery',
  activationPage: '/activation/:id',
  activationUrlPage: '/activation/',
  createItemPage: '/create',
  notFoundPage: '*',
  login: [apiPath, 'auth', 'login'].join('/'),
  signup: [apiPath, 'auth', 'signup'].join('/'),
  activation: [apiPath, 'activation/'].join('/'),
  activationRepeatEmail: [apiPath, 'activation', 'repeatEmail/'].join('/'),
  activationChangeEmail: [apiPath, 'activation', 'changeEmail'].join('/'),
  logout: [apiPath, 'auth', 'logout'].join('/'),
  recoveryPassword: [apiPath, 'auth', 'recoveryPassword'].join('/'),
  updateTokens: [apiPath, 'auth', 'updateTokens'].join('/'),
  getAllItems: [apiPath, 'market', 'getAll'].join('/'),
  createItem: [apiPath, 'market', 'upload'].join('/'),
} as ApiUrl;
