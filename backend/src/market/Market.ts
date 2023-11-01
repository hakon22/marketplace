import { Request, Response } from 'express';
import Items_Table from '../db/tables/Items.js';

class Market {

  async getAll(req: Request, res: Response) {
    try {
      const items = await Items_Table.findAll();
      res.json({ code: 1, items });
    } catch (e) {
      console.log(e);
      res.sendStatus(401);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const item = await Items_Table.create(req.body);
      const { id, name, image, unit, price, count, discount } = item;
      res.json({ code: 1, item: { id, name, image, unit, price, count, discount } });
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
}

export default new Market();