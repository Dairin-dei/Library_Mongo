import { default as express } from 'express';

import {
  findAllBooks,
  findBook,
  createNewBook,
  updateBook,
  deleteBook,
} from '../controllers/bookController';

const booksRouter = express.Router();

booksRouter.get('/', (request, response) => {
  //  console.log(request.method, request.url);
  findAllBooks(request, response);
});

booksRouter.get('/:id', (request, response) => {
  //  console.log(request.method, request.url, request.params.id);
  findBook(request, response);
});

booksRouter.post('/', (request, response) => {
  // console.log(request.method, request.url);
  createNewBook(request, response);
});

booksRouter.put('/:id', (request, response) => {
  //console.log(request.method, request.url);
  updateBook(request, response);
});

booksRouter.delete('/:id', (request, response) => {
  //console.log(request.method, request.url);
  deleteBook(request, response);
});

export default booksRouter;
