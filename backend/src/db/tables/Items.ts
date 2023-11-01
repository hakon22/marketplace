import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { db } from '../connect.js';

interface ItemsModel extends Model<InferAttributes<ItemsModel>, InferCreationAttributes<ItemsModel>> {
  id?: CreationOptional<number>;
  name: string;
  image: string;
  unit: string;
  price: number;
  count: number;
  discount: number;
}

const Items = db.define<ItemsModel>(
  'Items',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
);

export default Items;