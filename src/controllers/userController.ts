import { IncomingMessage, ServerResponse } from 'http';

import {
  findAllUsersInDataBase,
  findUserByIdInDataBase,
  createNewUserInDatabase,
  updateUserInDatabase,
  removeUserFromDatabase,
} from '../models/userModel';
import { IUser } from '../interfaces';

//@desc Gets all users from database
//@route api/users

export async function getAllUsers(
  request: IncomingMessage,
  response: ServerResponse
) {
  try {
    const userdInDatabase = await findAllUsersInDataBase();
    response.writeHead(200, { 'content-Type': 'application/json' });
    response.end(JSON.stringify(userdInDatabase));
  } catch (error) {
    console.log('Hello.', error);
  }
}

//@desc Gets user by id from database
//@route api/users/${id}

export async function getUser(
  request: IncomingMessage,
  response: ServerResponse
) {
  const userId = request.url?.split('/')[1] || '0';
  //console.log('userId', userId);
  // if (
  //  userId.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/)
  // ) {
  const user = await findUserByIdInDataBase(userId);
  //console.log('getUser', user);
  if (user !== undefined) {
    response.writeHead(200, { 'content-Type': 'application/json' });
    response.end(JSON.stringify(user));
  } else {
    response.writeHead(404, { 'content-Type': 'application/json' });
    response.end(
      JSON.stringify({ message: `I don't know user with id ${userId}` })
    );
  }
  /* } else {
    response.writeHead(400, { 'content-Type': 'application/json' });
    response.end(
      JSON.stringify({
        message: `Id ${userId} is not valid. Id should have uuid format`,
      })
    );
  }*/
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
    try {
      // const { username, age, hobbies } = JSON.parse(body);
      const { username } = JSON.parse(body);
      if (
        username === undefined
        //|| age === undefined ||
        //hobbies === undefined
      ) {
        response.writeHead(400, { 'content-Type': 'application/json' });
        response.end(
          JSON.stringify({
            message:
              "Hello. I'm sorry, but I couldn't add new user. You should fill all fields: username, age and hobbies",
          })
        );
      } else if (
        // isNaN(Number(age)) ||
        username.trim() === ''
        //|| !Array.isArray(hobbies)
      ) {
        response.writeHead(500, { 'content-Type': 'application/json' });
        response.end(
          JSON.stringify({
            message:
              "Hello. I'm sorry, but I couldn't add new user. You should send non-empty username, convertible to number age and array-like hobbies",
          })
        );
      } else {
        const newUser = await createNewUserInDatabase(username);
        //, age, hobbies);

        response.writeHead(201, { 'content-Type': 'application/json' });
        response.end(JSON.stringify(newUser));
      }
    } catch {
      response.writeHead(400, { 'content-Type': 'application/json' });
      response.end(
        JSON.stringify({
          message:
            "Hello. I'm sorry, but I couldn't add new user. You should fill all fields: username, age and hobbies",
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
  // if (
  //userId.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/)
  //) {
  const user = await findUserByIdInDataBase(userId);
  if (user != undefined) {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk.toString();
      request.on('end', async () => {
        try {
          //const { username, age, hobbies } = JSON.parse(body);
          const { username } = JSON.parse(body);
          if (
            username !== undefined &&
            username.trim() === ''
            // ||     (age !== undefined && isNaN(age)) ||
            //(hobbies !== undefined && !Array.isArray(hobbies))
          ) {
            response.writeHead(500, { 'content-Type': 'application/json' });
            response.end(
              JSON.stringify({
                message:
                  "Hello. I'm sorry, but I couldn't add new user. You should send non-empty username and/or convertible to number age, and/or array-like hobbies",
              })
            );
          } else {
            const updateUser = await updateUserInDatabase(
              userId,
              username
              //age,
              //hobbies
            );
            response.writeHead(200, { 'content-Type': 'application/json' });
            response.end(JSON.stringify(updateUser));
          }
        } catch {
          response.writeHead(400, { 'content-Type': 'application/json' });
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
  /*  } else {
    response.writeHead(400, { 'content-Type': 'application/json' });
    response.end(
      JSON.stringify({
        message: `Id ${userId} is not valid. Id should have uuid format`,
      })
    );
  }*/
}

//@desc Deletes a user
//@route api/users/${id}

export async function deleteUser(
  request: IncomingMessage,
  response: ServerResponse
) {
  const userId = request.url?.split('/')[1] || '0';
  // if (
  //userId.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/)
  //) {
  const user = await findUserByIdInDataBase(userId);
  if (user != undefined) {
    removeUserFromDatabase(userId);
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
  /*} else {
    response.writeHead(400, { 'content-Type': 'application/json' });
    response.end(
      JSON.stringify({
        message: `Id ${userId} is not valid. Id should have uuid format`,
      })
    );
  }*/
}

export function sentErrorMessage(response: ServerResponse) {
  response.writeHead(404, { 'content-Type': 'application/json' });
  response.end(
    JSON.stringify({
      message: "Hello. I'm sorry, but I don't know answer to this request",
    })
  );
}
