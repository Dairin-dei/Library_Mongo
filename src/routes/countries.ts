import { default as express } from 'express';

import {
  findAllCountries,
  findCountry,
  createNewCountry,
  updateCountry,
  deleteCountry,
} from '../controllers/countryController';

const countriesRouter = express.Router();

countriesRouter.get('/', (request, response) => {
  //  console.log(request.method, request.url);
  findAllCountries(request, response);
});

countriesRouter.get('/:id', (request, response) => {
  //  console.log(request.method, request.url, request.params.id);
  findCountry(request, response);
});

countriesRouter.post('/', (request, response) => {
  // console.log(request.method, request.url);
  createNewCountry(request, response);
});

countriesRouter.put('/:id', (request, response) => {
  //console.log(request.method, request.url);
  updateCountry(request, response);
});

countriesRouter.delete('/:id', (request, response) => {
  //console.log(request.method, request.url);
  deleteCountry(request, response);
});

export default countriesRouter;
