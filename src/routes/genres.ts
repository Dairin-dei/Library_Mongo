import { default as express } from 'express';

import {
  findAllGenres,
  findGenre,
  createNewGenre,
  updateGenre,
  deleteGenre,
} from '../controllers/genreController';

const genresRouter = express.Router();

genresRouter.get('/', (request, response) => {
  //  console.log(request.method, request.url);
  findAllGenres(request, response);
});

genresRouter.get('/:id', (request, response) => {
  //  console.log(request.method, request.url, request.params.id);
  findGenre(request, response);
});

genresRouter.post('/', (request, response) => {
  // console.log(request.method, request.url);
  createNewGenre(request, response);
});

genresRouter.put('/:id', (request, response) => {
  //console.log(request.method, request.url);
  updateGenre(request, response);
});

genresRouter.delete('/:id', (request, response) => {
  //console.log(request.method, request.url);
  deleteGenre(request, response);
});

export default genresRouter;
