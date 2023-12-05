import bcrypt from 'bcryptjs';
import { Response } from 'express';
import { Op } from 'sequelize';
import { codeGen } from '../activation/Activation.js';
import { sendMailChangeEmail } from '../mail/sendMail.js';
import Users, { PassportRequest } from '../db/tables/Users.js';

type ConfirmEmailValues = {
  code?: number;
  email?: string;
  phone?: string;
};

type ChangeDataValues = {
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  oldPassword?: string;
};

class Profile {

  async confirmEmail(req: PassportRequest, res: Response) {
    try {
      const { dataValues: { id, username, change_email_code } } = req.user;
      const values: ConfirmEmailValues = req.body;
      const { email, code, phone } = values;
      if (code) {
        if (Number(code) === change_email_code) {
          await Users.update({ change_email_code: null }, { where: { id } });
          return res.send({ code: 1 });
        }
        return res.send({ code: 2 });
      }
      if (email) {
        const users = await Users.findAll({ where: { [Op.or]: [{ email: email || '' }, { phone: phone || '' }] } });
        if (users.length > 0) {
          const errorsFields = users.reduce((acc: ('email' | 'phone')[], user) => {
            if (user.email === email) {
              acc.push('email');
            }
            if (user.phone === phone) {
              acc.push('phone');
            }
            return acc;
          }, []);
          return res.json({ code: 3, errorsFields }); // есть существующие пользователи
        }
        const code = codeGen();
        await Users.update({ change_email_code: code }, { where: { id } });
        await sendMailChangeEmail(username, email, code);
        return res.json({ code: 4 });
      }
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }

  async changeData(req: PassportRequest, res: Response) {
    try {
      const { dataValues: { id, password } } = req.user;
      const values: ChangeDataValues = req.body;
      const { email, phone, oldPassword } = values;
      if (values.password) {
        const isValidPassword = bcrypt.compareSync(oldPassword, password);
        if (!isValidPassword) {
          return res.json({ code: 3 }); // старый пароль не совпадает
        }
      }
      if (email || phone) {
        const users = await Users.findAll({ where: { [Op.or]: [{ email: email || '' }, { phone: phone || '' }] } });
        if (users.length > 0) {
          const errorsFields = users.reduce((acc: ('email' | 'phone')[], user) => {
            if (user.email === email) {
              acc.push('email');
            }
            if (user.phone === phone) {
              acc.push('phone');
            }
            return acc;
          }, []);
          return res.json({ code: 2, errorsFields }); // есть существующие пользователи
        }
      }
      const initialObject: ChangeDataValues = {};
      // пересобираем объект с данными для дальнейшего обновления
      const newDataValues = Object.entries(values).reduce((acc, [key, value]) => {
        if (key === 'oldPassword') {
          return acc;
        }
        if (key === 'password') {
          const hashPassword = bcrypt.hashSync(value, 10);
          return { ...acc, password: hashPassword };
        }
        return { ...acc, [key]: value };
      }, initialObject);

      await Users.update(newDataValues, { where: { id } });
      res.json({ code: 1, newDataValues });
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
}

export default new Profile();