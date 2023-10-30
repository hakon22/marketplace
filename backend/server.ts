import 'dotenv/config';
import passport from 'passport';
import express, { Application, Request, Response } from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import tokenChecker from './src/authentication/tokenChecker.js';
import refreshTokenChecker from './src/authentication/refreshTokenChecker.js';
import { connectToDb } from './src/db/connect.js';
import router from './src/api.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app: Application = express();
const port = process.env.PORT || 3001;

const buildPath = process.env.DB === 'LOCAL'
  ? join(__dirname, '..', '..', 'frontend', 'public')
  : join(__dirname, '..', 'build');

app.use(express.static(buildPath));
app.use(express.json());
app.use(cors());
app.use(passport.initialize());
tokenChecker(passport);
refreshTokenChecker(passport);
app.use(router);

app.get('/*', (req: Request, res: Response) => res.sendFile(join(buildPath, 'index.html')));

app.listen(port, () => console.log(`Server is online on port: ${port}`));

connectToDb();