import { Request, Response } from 'express';
import { uploadFilesPath } from '../../server.js';
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

  async upload(req: Request, res: Response) {
    try {
      if (!req.files) {
        return res.status(500).send({ code: 2 });
      }
      if (!Array.isArray(req.files.image)) {
        const image = req.files.image;
        const uploadPath = `${uploadFilesPath}/${image.name}`;

        image.mv(uploadPath, (error) => {
          if (error) {
            return res.status(500).send(error);
          }
          res.send({ code: 1, image: uploadPath });
        });
        await Items_Table.create({ name: 'test2', image: image.name, unit: 'test', price: 99, count: 99 });
      }
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
}

export default new Market();