import { default as express } from 'express';

import {
  findAllVolumes,
  findVolume,
  createNewVolume,
  updateVolume,
  deleteVolume,
} from '../controllers/volumeController';

const volumesRouter = express.Router();

volumesRouter.get('/', (request, response) => {
  //  console.log(request.method, request.url);
  findAllVolumes(request, response);
});

volumesRouter.get('/:id', (request, response) => {
  //  console.log(request.method, request.url, request.params.id);
  findVolume(request, response);
});

volumesRouter.post('/', (request, response) => {
  // console.log(request.method, request.url);
  createNewVolume(request, response);
});

volumesRouter.put('/:id', (request, response) => {
  //console.log(request.method, request.url);
  updateVolume(request, response);
});

volumesRouter.delete('/:id', (request, response) => {
  //console.log(request.method, request.url);
  deleteVolume(request, response);
});

export default volumesRouter;
