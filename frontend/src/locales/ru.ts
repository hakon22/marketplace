export default {
  translation: {
    navBar: {
      title: 'Маркетплейс',
      search: 'Поиск',
      menu: {
        discounts: 'Акции',
        delivery: 'Доставка',
        catalog: 'Каталог',
        vegetables: 'Овощи',
        fruits: 'Фрукты',
        frozen: 'Заморозка',
        freshMeat: 'Свежее мясо',
        dairy: 'Молочные продукты',
        fish: 'Рыба',
        sweet: 'Сладкое',
        iceCream: 'Мороженое',
        chocolate: 'Шоколад',
      },
    },
    profileButton: {
      login: 'Войти',
      signup: 'Регистрация',
      exit: 'Выйти',
      profile: 'Личный кабинет',
      myOrders: 'Мои заказы',
    },
    loginForm: {
      title: 'Вход',
      description: 'Войти в учётную запись',
      phone: 'Телефон',
      password: 'Пароль',
      submit: 'Войти',
      checkbox: 'Запомнить меня',
      notAccount: 'Нет аккаунта? ',
      forgotPassword: 'Забыли пароль? ',
      recovery: 'Восстановить',
    },
    recoveryForm: {
      title: 'Восстановление пароля',
      description: 'Восстановление пароля',
      rememberPassword: 'Вспомнили пароль? ',
      toYourMail: 'На вашу почту',
      postNewPassword: 'был выслан новый пароль',
    },
    signupForm: {
      title: 'Регистрация',
      description: 'Регистрация аккаунта',
      username: 'Имя пользователя',
      email: 'Почта',
      phone: 'Номер телефона',
      password: 'Пароль',
      confirmPassword: 'Подтвердите пароль',
      submit: 'Зарегистрироваться',
      haveAccount: 'Есть аккаунт? ',
    },
    activationForm: {
      title: 'Активация аккаунта',
      code: 'Код подтверждения',
      submit: 'Активировать аккаунт',
      timerButton: 'Отправить повторно',
      timerText: 'Отправить повторно: 00:',
      timerTextZero: 'Отправить повторно: 00:0',
      toYourMail: 'На вашу почту',
      postConfirmCode: 'был выслан код подтверждения',
      dropMenuChange: 'Изменить',
    },
    404: {
      header: 'Ошибка 404',
      title: 'Страница не найдена',
      text: 'Возможно, наши горе-разработчики что-то сломали :(',
    },
    validation: {
      required: 'Обязательное поле',
      requirements: 'От 3 до 20 символов',
      passMin: 'Не менее 6 символов',
      phone: 'Введите корректный номер телефона',
      email: 'Почта должна быть корректной',
      mastMatch: 'Пароли должны совпадать',
      userAlreadyExists: 'Такой пользователь уже существует',
      userNotAlreadyExists: 'Такой пользователь не зарегистрирован',
      incorrectPassword: 'Неверный пароль',
      accountNotActivated: 'Аккаунт не активирован',
      incorrectCode: 'Неверный код подтверждения',
      emailAlreadyExists: 'Такой email уже существует',
      imageRequired: 'Необходимо загрузить изображение',
      imagePngType: 'Разрешён только формат PNG',
      imageNoMore200kb: 'Размер файла не должен превышать 200КБ',
    },
    toast: {
      activationSuccess: 'Аккаунт успешно активирован',
      emailSuccess: 'Сообщение успешно отправлено',
      changeEmailSuccess: 'Почта успешно обновлена',
      doesNotRequireActivation: 'Аккаунт не требует активации',
      networkError: 'Ошибка соединения',
      unknownError: 'Неизвестная ошибка',
      authError: 'Ошибка аутентификации',
    },
    createItem: {
      upload: 'Загрузить',
      nameItem: 'Название товара',
      priceItem: 'Цена',
      tooltipPriceDiscount: 'Цена со скидкой',
      tooltipPriceOriginal: 'Старая цена',
      rubSymbol: '₽',
      per: 'за',
      unitItem: {
        label: 'Единица измерения',
        kg: 'кг',
        ea: 'шт',
        gr: 'гр',
      },
      countItem: 'Остаток товара',
      discount: 'Скидка',
      foodValues: 'Пищевая ценность на 100гр:',
      carbohydrates: 'Углеводы',
      fats: 'Жиры',
      proteins: 'Белки',
      ccal: 'Ккал',
      composition: 'Опишите состав',
      updatePrice: 'Обновить цену',
      adding: 'Добавление...',
      addItem: 'Добавить товар',
    },
    imageCrop: {
      modalCancel: 'Закрыть',
      modalTitle: 'Редактирование изображения',
      resetText: 'Сброс',
    },
    marketplace: {
      title: 'Маркетплейс',
      description: 'За покупками - к нам!',
    },
    modal: {
      changeEmail: {
        changeEmailTitle: 'Изменить почту',
        newEmail: 'Новая почта',
        close: 'Закрыть',
        submitChange: 'Изменить',
      },
      cart: {
        title: 'Ваш заказ:',
        decrease: 'Уменьшить',
        increase: 'Увеличить',
        remove: 'Удалить',
        price: '{{ price }},00 ₽',
        summ: 'Сумма: {{ price }},00 ₽',
        sendOrder: 'Отправить заказ',
        clearCart: 'Очистить корзину',
        orderAccept: 'Заказ принят!',
        gratitude: 'Спасибо за заказ!',
      },
    },
    cart: {
      summ: '{{ price }},00 ₽',
    },
    cardItem: {
      price: '{{ price }},00 ₽',
      subtitle: '{{ price }},00 ₽/{{ unit }}',
      addToCart: 'В корзину',
      inCart: 'В корзине',
    },
    search: {
      header: 'Ничего не найдено',
      title: 'По Вашему запросу ничего не найдено',
    },
  },
};
