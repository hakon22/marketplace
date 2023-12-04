import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { Request } from 'express';
import { db } from '../connect.js';

type Address = {
  city: string;
  street: string;
  house: number;
  building?: number;
  floor?: number;
  frontDoor?: number;
  apartment?: number;
};

interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  id?: CreationOptional<number>;
  username: string;
  password: string;
  email: string;
  phone: string;
  role: string;
  refresh_token: string[];
  code_activation: number;
  change_email_code: number;
  addresses: Address[];
  orders: number[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PassportRequest extends Request {
  user: {
    dataValues: UserModel;
    token: string;
    refreshToken: string;
  }
}

const Users = db.define<UserModel>(
  'Users',
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
    },
    code_activation: {
      type: DataTypes.INTEGER,
    },
    change_email_code: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    addresses: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      defaultValue: [],
    },
    orders: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: [],
    },
  },
);

export default Users;