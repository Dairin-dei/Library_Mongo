import dotenv from 'dotenv';
import { default as express } from 'express';
import { setMongoConnection } from './db';
import authorsRouter from './routes/authors';
import booksRouter from './routes/books';
import countriesRouter from './routes/countries';
import genresRouter from './routes/genres';
import languagesRouter from './routes/languages';
import usersRouter from './routes/users';
import volumesRouter from './routes/volumes';

dotenv.config();

const PORT = Number(process.env.RSS_PORT) || 4000;
const app = express();
app.use('/api/authors', authorsRouter);
app.use('/api/books', booksRouter);
app.use('/api/countries', countriesRouter);
app.use('/api/genres', genresRouter);
app.use('/api/languages', languagesRouter);
app.use('/api/users', usersRouter);
app.use('/api/volumes', volumesRouter);
app.listen(PORT, () => {
  setMongoConnection(function (err: Error) {
    if (err) console.log(err);
  });
  console.log(`Server is running on port ${PORT}`);
});
