import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import { Request, Response } from 'express';
import passGen from 'generate-password';
import { codeGen } from '../activation/Activation.js';
import Users, { PassportRequest } from '../db/tables/Users.js';
import { sendMailActivationAccount, sendMailRecoveryPass } from '../mail/sendMail.js';
import { generateAccessToken, generateRefreshToken } from '../authentication/tokensGen.js';

class Auth {

  async signup(req: Request, res: Response) {
    try {
      const { username, phone, password, email } = req.body;
      const candidates = await Users.findAll({ where: { [Op.or]: [{ email }, { phone }] } });
      if (candidates.length > 0) {
        const errorsFields = candidates.reduce((acc: ('email' | 'phone')[], candidate) => {
          if (candidate.email === email) {
            acc.push('email');
          }
          if (candidate.phone === phone) {
            acc.push('phone');
          }
          return acc;
        }, []);
        return res.json({ code: 2, errorsFields });
      }
      const hashPassword = bcrypt.hashSync(password, 10);
      const code_activation = codeGen();
      const user = await Users.create({ username, phone, password: hashPassword, email, code_activation });
      const { id } = user;
      await sendMailActivationAccount(id, username, email, code_activation);
      setTimeout( async () => {
        const user = await Users.findOne({
          attributes: ['code_activation'],
          where: { id },
        });
        if (user.code_activation) {
          await Users.destroy({ where: { id } });
        }
      }, 86400000);
      res.json({ code: 1, id });
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { phone, password } = req.body;
      const user = await Users.findOne({ where: { phone } });
      if (!user) {
        return res.json({ code: 4 });
      }
      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (!isValidPassword) {
        return res.json({ code: 3 });
      }
      if (user.code_activation) {
        return res.json({ code: 2 });
      }
      const token = generateAccessToken(user.id, user.email);
      const refreshToken = generateRefreshToken(user.id, user.email);
      const { id, username, email } = user;
      if (!user.refresh_token) {
        await Users.update({ refresh_token: [refreshToken] }, { where: { email } });
      } else if (user.refresh_token.length < 4) {
        user.refresh_token.push(refreshToken);
        await Users.update({ refresh_token: user.refresh_token }, { where: { email } });
      } else {
        await Users.update({ refresh_token: [refreshToken] }, { where: { email } });
      }
      res.status(200).send({ code: 1, user: { token, refreshToken, username, id, email, phone } });
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }

  async updateTokens(req: PassportRequest, res: Response) {
    try {
      const { dataValues: { id, username, refresh_token, email, phone }, token, refreshToken } = req.user;
      const oldRefreshToken = req.get('Authorization').split(' ')[1];
      const availabilityRefresh = refresh_token.find((token: string) => token === oldRefreshToken);
      if (availabilityRefresh) {
        const newRefreshTokens = refresh_token.filter((token: string) => token !== oldRefreshToken);
        newRefreshTokens.push(refreshToken);
        await Users.update({ refresh_token: newRefreshTokens }, { where: { id } });
      } else {
        throw new Error('Ошибка доступа');
      } 
      res.status(200).send({ code: 1, user: { id, username, token, refreshToken, email, phone } });
    } catch (e) {
      console.log(e);
      res.sendStatus(401);
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const { id, refreshToken } = req.body;
      const user = await Users.findOne({
        attributes: ['refresh_token'],
        where: { id },
      });
      if (user) {
        if (user.refresh_token) {
          const refreshTokens = user.refresh_token.filter((token) => token !== refreshToken);
          const newRefreshTokens = refreshTokens.length > 0 ? refreshTokens : null;
          await Users.update({ refresh_token: newRefreshTokens }, { where: { id } });
          res.status(200).json({ status: 'Tokens has been deleted' });
        } else {
          throw new Error();
        }
      }
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }

  async recoveryPassword(req: Request, res: Response) {
    try {
      const values = req.body;
      const user = await Users.findOne({
        attributes: ['username', 'email'],
        where: { email: values.email },
      });
      if (!user) {
        return res.status(200).json({ code: 2 });
      }
      const { username, email } = user;
      const password = passGen.generate({
        length: 7,
        numbers: true
      });
      const hashPassword = bcrypt.hashSync(password, 10);
      await Users.update({ password: hashPassword }, { where: { email } });
      await sendMailRecoveryPass(username, email, password);
      res.status(200).json({ code: 1 });
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
}

export default new Auth();