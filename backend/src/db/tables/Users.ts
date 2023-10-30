import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { db } from '../connect.js';

export interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  id?: CreationOptional<number>;
  username: string;
  password: string;
  email: string;
  phone: string;
  refresh_token: string[];
  code_activation: number;
  createdAt?: string;
  updatedAt?: string;
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
    refresh_token: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
    },
    code_activation: {
      type: DataTypes.INTEGER,
    },
  },
);

export default Users;