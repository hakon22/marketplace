import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { capitalize, toLower } from 'lodash';
import axios from 'axios';
import App from '../src/components/App';
import store from '../src/slices/index';

type changeUserDataArgs = (
  field: string,
  value: string,
  input: HTMLElement,
) => void;

type UserArgs = (
  username: string,
  email: string,
  password: string,
) => Promise<void>;

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const createdAt = new Date().toISOString();
const updatedAt = new Date().toISOString();

window.HTMLElement.prototype.scrollIntoView = () => {};

let response: { data: { code: number, users?: object, logs?: object, user?: object, log?: object }};
const errorResponce = new Error();

let userId = 2;
let logId = 2;

const increaseIds = () => {
  userId += 1;
  logId += 1;
};

const checkCountElements = async (testId: string, toHaveLength: number) => waitFor(async () => {
  const items = await screen.findAllByTestId(testId);

  expect(items).toHaveLength(toHaveLength);
});

const changeValue = (value: string, field: string) => {
  if (field === 'username') {
    return capitalize(value);
  }
  if (field === 'email') {
    return toLower(value);
  }
  return value;
};

const createUser: UserArgs = async (username, email, password) => {
  const finalUsername = changeValue(username, 'username');
  const finalEmail = changeValue(email, 'email');
  const user = {
    id: userId, username: finalUsername, email: finalEmail, password: '111111', createdAt, updatedAt,
  };
  const log = {
    id: logId, userId, message: `Создан пользователь ${finalUsername}`, createdAt, updatedAt,
  };
  response = { data: { code: 1, user, log } };
  mockedAxios.post.mockResolvedValue(response);

  await userEvent.click(screen.getByText('Главная'));

  const inputName = screen.getByLabelText('Имя');
  const inputEmail = screen.getByLabelText('Почта');
  const inputPassword = screen.getByLabelText('Пароль');

  if (userId === 2) {
    await userEvent.click(screen.getByText('Добавить пользователя'));

    expect(screen.getByTestId('username-invalid')).toHaveTextContent('Обязательное поле');
    expect(screen.getByTestId('email-invalid')).toHaveTextContent('Обязательное поле');
    expect(screen.getByTestId('password-invalid')).toHaveTextContent('Обязательное поле');
  }

  await userEvent.type(inputName, username);
  await userEvent.type(inputEmail, email);
  await userEvent.type(inputPassword, password);

  await userEvent.click(screen.getByText('Добавить пользователя'));
};

const changeUserData: changeUserDataArgs = async (field, value, input) => {
  const finalValue = changeValue(value, field);
  const log = {
    id: logId, userId, message: `Пользователь #${userId} изменил ${field} на ${finalValue}`, createdAt, updatedAt,
  };
  response = { data: { code: 1, log } };
  mockedAxios.post.mockResolvedValue(value === 'valueForError' ? errorResponce : response);

  expect(screen.getByTestId(`${field}-field`)).toBeDisabled();

  await userEvent.click(screen.getByTestId(field));

  expect(screen.getByTestId(`${field}-field`)).toBeEnabled();

  await userEvent.clear(screen.getByTestId(`${field}-field`));

  await userEvent.type(input, value);

  await userEvent.click(screen.getByTestId(field));

  if (value === 'valueForError') {
    expect(screen.getByTestId('password-field')).toBeEnabled();
    expect(await screen.findByText('Неизвестная ошибка')).toBeInTheDocument();
    expect(store.getState().users.entities[13]?.password).toBe('superpass');
  } else {
    expect(screen.getByTestId(`${field}-field`)).toBeDisabled();
    expect(await screen.findByText('Данные успешно изменены')).toBeInTheDocument();
    expect(screen.getByTestId(`${field}-field`)).toHaveValue(finalValue);
    expect(store.getState().users.entities[userId]?.[field]).toBe(finalValue);

    await userEvent.click(screen.getByText('Логи'));

    expect(screen.getByText(log.message)).toHaveTextContent(log.message);
  }
};

beforeEach(() => {
  const users = [{
    id: 1, username: 'alex', email: 'hakon@emnail.ri', password: 'gfhfghfh', createdAt, updatedAt,
  }];

  const logs = [{
    id: 1, userId: 1, message: 'Создан пользователь alex', createdAt, updatedAt,
  }];

  response = { data: { code: 1, users, logs } };
  mockedAxios.get.mockResolvedValue(response);

  waitFor(() => {
    render(
      <Provider store={store}>
        <ToastContainer />
        <App />
      </Provider>,
    );
  });
});

describe('testing data', () => {
  it('fetch data', async () => {
    await userEvent.click(screen.getByText('Пользователи'));

    expect(screen.getByText('alex')).toHaveTextContent('alex');
  });

  it('create user', async () => {
    await createUser('Алёша', 'hakon1@mail.ru', '111111');
    increaseIds();

    await userEvent.click(screen.getByText('Пользователи'));

    expect(screen.getByText('alex')).toHaveTextContent('alex');
    expect(screen.getByText('Алёша')).toHaveTextContent('Алёша');
  });

  it('logs', async () => {
    await userEvent.click(screen.getByText('Логи'));

    expect(screen.getByText('Создан пользователь alex')).toHaveTextContent('Создан пользователь alex');
    expect(screen.getByText('Создан пользователь Алёша')).toHaveTextContent('Создан пользователь Алёша');
  });
});

describe('testing pagination', () => {
  it('create many users and pagination', async () => {
    const createManyUsers: UserArgs = async (username, email, password) => {
      await createUser(`${username}-${userId}`, email, password);
      if (userId < 13) {
        increaseIds();
        await createManyUsers(username, email, password);
      }
    };

    await createManyUsers('Алёша', 'hakon1@mail.ru', '123456');

    await userEvent.click(screen.getByText('Логи'));
    await userEvent.click(screen.getByRole('button', { name: '2' }));

    expect(screen.getByText('Создан пользователь alex')).toHaveTextContent('Создан пользователь alex');
  }, 25000);
});

describe('testing user update', () => {
  beforeEach(async () => {
    logId += 1;
    await userEvent.click(screen.getByText('Пользователи'));
  });
  it('username update', async () => {
    await userEvent.click(screen.getByText('Алёша-13'));
    const input = screen.getByLabelText('Имя');
    await changeUserData('username', 'валентин', input);
  });

  it('email update', async () => {
    await userEvent.click(screen.getByText('Валентин'));
    const input = screen.getByLabelText('Почта');
    await changeUserData('email', 'VaLeNtIn@mAiL.rU', input);
  });

  it('password update', async () => {
    await userEvent.click(screen.getByText('valentin@mail.ru'));
    const input = screen.getByLabelText('Пароль');
    await changeUserData('password', 'superpass', input);
  });

  it('update password with error', async () => {
    await userEvent.click(screen.getByText('superpass'));
    const input = screen.getByLabelText('Пароль');
    await changeUserData('password', 'valueForError', input);
  });
});

describe('testing userPage', () => {
  it('isDisabled on blur', async () => {
    await userEvent.click(screen.getByText('Пользователи'));
    await userEvent.click(screen.getByText('Валентин'));

    await userEvent.click(screen.getByTestId('username'));
    await userEvent.click(screen.getByTestId('email'));
    await userEvent.click(screen.getByTestId('password'));
    await userEvent.click(screen.getByTestId('password-close'));

    expect(screen.getByTestId('username-field')).toBeDisabled();
    expect(screen.getByTestId('email-field')).toBeDisabled();
    expect(screen.getByTestId('password-field')).toBeDisabled();
  });
});

describe('testing searchForId in logs', () => {
  let inputSearch: HTMLElement;
  beforeEach(async () => {
    await userEvent.click(screen.getByText('Логи'));
    inputSearch = screen.getByLabelText('Введите id пользователя');
  });
  it('search #13', async () => {
    await userEvent.type(inputSearch, 'text');

    expect(inputSearch).toHaveValue('');

    await userEvent.type(inputSearch, '13');
    await userEvent.keyboard('{Enter}');

    await checkCountElements('tr', 4);
  });

  it('search #5', async () => {
    await userEvent.type(inputSearch, '5');
    await userEvent.keyboard('{Enter}');

    await checkCountElements('tr', 1);
  });

  it('cancel search', async () => {
    await userEvent.clear(inputSearch);
    await userEvent.keyboard('{Enter}');

    await checkCountElements('tr', 10);
  });
});
