import { IncomingMessage, ServerResponse } from 'http';

import {
  findAllUsersDb,
  findUserByIdDb,
  createUserDb,
  updateUserDb,
  removeUserDb,
} from '../models/userModel';

//@desc Gets all users from database
//@route api/users

export async function findAllUsers(
  request: IncomingMessage,
  response: ServerResponse
) {
  try {
    const usersInDatabase = await findAllUsersDb();
    response.writeHead(200, { 'content-Type': 'application/json' });
    response.end(JSON.stringify(usersInDatabase));
  } catch (error) {
    console.log('Hello.', error);
  }
}

//@desc Gets user by id from database
//@route api/users/${id}

export async function findUser(
  request: IncomingMessage,
  response: ServerResponse
) {
  const userId = request.url?.split('/')[1] || '0';
  const user = await findUserByIdDb(userId);
  if (user !== undefined) {
    response.writeHead(200, { 'content-Type': 'application/json' });
    response.end(JSON.stringify(user));
  } else {
    response.writeHead(404, { 'content-Type': 'application/json' });
    response.end(
      JSON.stringify({ message: `I don't know user with id ${userId}` })
    );
  }
}

//@desc Creates new user
//@route api/users/ + body without id all fields (username, age, hobbies) are required

export async function createNewUser(
  request: IncomingMessage,
  response: ServerResponse
) {
  let body = '';
  request.on('data', (chunk) => {
    body += chunk.toString();
  });

  request.on('end', async () => {
    console.log('user', JSON.parse(body));
    try {
      const { username } = JSON.parse(body);
      if (username === undefined) {
        response.writeHead(400, { 'content-Type': 'application/json' });
        response.end(
          JSON.stringify({
            message:
              "Hello. I'm sorry, but I couldn't add new user. You should fill username",
          })
        );
      } else if (username.trim() === '') {
        response.writeHead(500, { 'content-Type': 'application/json' });
        response.end(
          JSON.stringify({
            message:
              "Hello. I'm sorry, but I couldn't add new user. You should send non-empty username",
          })
        );
      } else {
        const newUser = await createUserDb(username);

        response.writeHead(201, { 'content-Type': 'application/json' });
        response.end(JSON.stringify(newUser));
      }
    } catch {
      response.writeHead(400, { 'content-Type': 'application/json' });
      response.end(
        JSON.stringify({
          message:
            "Hello. I'm sorry, but I couldn't add new user. You should remove mistakes",
        })
      );
    }
  });
}

//@desc Updates a user
//@route api/users/${id} + body without id

export async function updateUser(
  request: IncomingMessage,
  response: ServerResponse
) {
  const userId = request.url?.split('/')[1] || '0';
  const user = await findUserByIdDb(userId);
  if (user != undefined) {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk.toString();
      request.on('end', async () => {
        try {
          const { username } = JSON.parse(body);
          if (username === undefined || username.trim() === '') {
            response.writeHead(400, { 'content-Type': 'application/json' });
            response.end(
              JSON.stringify({
                message:
                  "Hello. I'm sorry, but I couldn't update this user. You should send non-empty username",
              })
            );
          } else {
            const updateUser = await updateUserDb(userId, username);
            response.writeHead(200, { 'content-Type': 'application/json' });
            response.end(JSON.stringify(updateUser));
          }
        } catch {
          response.writeHead(500, { 'content-Type': 'application/json' });
          response.end(
            JSON.stringify({
              message: `Hello. You quite possibly have mistakes in sent data. Please check`,
            })
          );
        }
      });
    });
  } else {
    response.writeHead(404, { 'content-Type': 'application/json' });
    response.end(
      JSON.stringify({
        message: `Hello. I'm sorry, but I can't find user with id ${userId}`,
      })
    );
  }
}

//@desc Deletes a user
//@route api/users/${id}

export async function deleteUser(
  request: IncomingMessage,
  response: ServerResponse
) {
  const userId = request.url?.split('/')[1] || '0';
  const user = await findUserByIdDb(userId);
  if (user != undefined) {
    removeUserDb(userId);
    response.writeHead(204, { 'content-Type': 'application/json' });
    response.end(
      JSON.stringify({
        message: `Hello. User with id ${userId} was deleted`,
      })
    );
  } else {
    response.writeHead(404, { 'content-Type': 'application/json' });
    response.end(
      JSON.stringify({
        message: `Hello. I'm sorry, but I can't find user with id ${userId}`,
      })
    );
  }
}
