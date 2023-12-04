import bcrypt from 'bcryptjs';
import e, { Request, Response } from 'express';
import { Op } from 'sequelize';
import { codeGen } from '../activation/Activation.js';
import { sendMailChangeEmail } from '../mail/sendMail';
import Users, { PassportRequest } from '../db/tables/Users.js';

type ConfirmEmailValues = { code?: number, email?: string };

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
      const { dataValues: { id, username } } = req.user;
      const values: ConfirmEmailValues = req.body;
      const user = await Users.findOne({ where: { id } });
      if (values.code) {
        if (Number(values.code) === user.change_email_code) {
          await Users.update({ change_email_code: null }, { where: { id } });
          return res.send({ code: 1 });
        }
        return res.send({ code: 2 });
      }
      if (values.email) {
        const users = await Users.findAll({
          attributes: ['email'],
        });
        if (users.find((user) => user.email === values.email)) {
          return res.send({ code: 3 });
        }
        const code = codeGen();
        await Users.update({ change_email_code: code }, { where: { id } });
        await sendMailChangeEmail(username, values.email, code);
        return res.json({ code: 4 });
      }
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }

  async changeData(req: PassportRequest, res: Response) {
    try {
      const { dataValues: { id, phone } } = req.user;
      const values: ChangeDataValues = req.body;
      const user = await Users.findOne({ where: { id } });
      if (values.code) {
        if (Number(values.code) === user.change_email_code) {
          await Users.update({ change_email_code: null }, { where: { id } });
          return res.send({ code: 1 });
        }
        return res.send({ code: 2 });
      }
      if (values.email) {
        const users = await Users.findAll({
          attributes: ['email'],
        });
        if (users.find((user) => user.email === values.email)) {
          return res.send({ code: 3 });
        }
        const code = codeGen();
        await Users.update({ change_email_code: code }, { where: { id } });
        await sendMailChangeEmail(username, values.email, code);
        return res.json({ code: 4 });
      }
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
}

export default new Profile();