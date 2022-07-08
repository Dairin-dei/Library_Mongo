import { default as express } from 'express';

import {
  findAllLanguages,
  findLanguage,
  createNewLanguage,
  updateLanguage,
  deleteLanguage,
} from '../controllers/languageController';

const languagesRouter = express.Router();

languagesRouter.get('/', (request, response) => {
  //  console.log(request.method, request.url);
  findAllLanguages(request, response);
});

languagesRouter.get('/:id', (request, response) => {
  //  console.log(request.method, request.url, request.params.id);
  findLanguage(request, response);
});

languagesRouter.post('/', (request, response) => {
  // console.log(request.method, request.url);
  createNewLanguage(request, response);
});

languagesRouter.put('/:id', (request, response) => {
  //console.log(request.method, request.url);
  updateLanguage(request, response);
});

languagesRouter.delete('/:id', (request, response) => {
  //console.log(request.method, request.url);
  deleteLanguage(request, response);
});

export default languagesRouter;
