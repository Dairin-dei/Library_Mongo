import dotenv from 'dotenv';
import { default as express } from 'express';
import { setMongoConnection } from './db';
import usersRouter from './routes/users';

dotenv.config();

const PORT = Number(process.env.RSS_PORT) || 4000;
const app = express();
app.use('/api/users', usersRouter);
app.listen(PORT, () => {
  setMongoConnection(function (err: Error) {
    if (err) console.log(err);
  });
  console.log(`Server is running on port ${PORT}`);
});
