import { Request, Response } from 'express';
import path from 'path';
import sharp from 'sharp';
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
        return res.status(500);
      }
      if (!Array.isArray(req.files.image)) {
        const image = req.files.image;
        const imageName = `${Date.now()}-${image.name.replace(/[^\w\s.]/g, '').replaceAll(' ', '')}`;
        await sharp(image.data).png({ compressionLevel: 9, quality: 70 }).toFile(path.resolve(uploadFilesPath, imageName));

        const { foodValues, category, ...rest } = req.body;

        const item = await Items_Table.create({
          image: imageName,
          category: JSON.parse(category),
          foodValues: JSON.parse(foodValues),
          ...rest,
        });
        res.send({ code: 1, item });
      }
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
}

export default new Market();