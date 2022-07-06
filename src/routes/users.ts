import { default as express } from 'express';

import {
  getAllUsers,
  getUser,
  createNewUser,
  updateUser,
  deleteUser,
  sentErrorMessage,
} from '../controllers/userController';

const usersRouter = express.Router();

usersRouter.get('/', (request, response) => {
  //  console.log(request.method, request.url);
  getAllUsers(request, response);
});

usersRouter.get('/:id', (request, response) => {
  //  console.log(request.method, request.url, request.params.id);
  getUser(request, response);
});

usersRouter.post('/', (request, response) => {
  // console.log(request.method, request.url);
  createNewUser(request, response);
});

usersRouter.put('/:id', (request, response) => {
  //console.log(request.method, request.url);
  updateUser(request, response);
});

usersRouter.delete('/:id', (request, response) => {
  //console.log(request.method, request.url);
  deleteUser(request, response);
});

export default usersRouter;
