import { default as express } from 'express';

import {
  findAllAuthors,
  findAuthor,
  createNewAuthor,
  updateAuthor,
  deleteAuthor,
} from '../controllers/authorController';

const authorsRouter = express.Router();

authorsRouter.get('/', (request, response) => {
  //  console.log(request.method, request.url);
  findAllAuthors(request, response);
});

authorsRouter.get('/:id', (request, response) => {
  //  console.log(request.method, request.url, request.params.id);
  findAuthor(request, response);
});

authorsRouter.post('/', (request, response) => {
  // console.log(request.method, request.url);
  createNewAuthor(request, response);
});

authorsRouter.put('/:id', (request, response) => {
  //console.log(request.method, request.url);
  updateAuthor(request, response);
});

authorsRouter.delete('/:id', (request, response) => {
  //console.log(request.method, request.url);
  deleteAuthor(request, response);
});

export default authorsRouter;
