import { IncomingMessage, ServerResponse } from 'http';
import {
  createAuthorDb,
  findAllAuthorsDb,
  findAuthorByIdDb,
  removeAuthorDb,
  updateAuthorDb,
} from '../models/authorModel';
import { findOrCreateCountryByName } from '../controllers/countryController';
import { ICountry } from '../interfaces';

export async function findAllAuthors(
  request: IncomingMessage,
  response: ServerResponse
) {
  try {
    const authorsInDatabase = await findAllAuthorsDb();
    response.writeHead(200, { 'content-Type': 'application/json' });
    response.end(JSON.stringify(authorsInDatabase));
  } catch (error) {
    console.log("Sorry, can't get authors", error.message);
    response.writeHead(200, { 'content-Type': 'application/json' });
    response.end(JSON.stringify([]));
  }
}

export async function findAuthor(
  request: IncomingMessage,
  response: ServerResponse
) {
  const authorId = request.url?.split('/')[1] || '0';
  const author = await findAuthorByIdDb(authorId);

  if (author) {
    response.writeHead(200, { 'content-Type': 'application/json' });
    response.end(JSON.stringify(author));
  } else {
    response.writeHead(404, { 'content-Type': 'application/json' });
    response.end(
      JSON.stringify({ message: `I don't know author with id ${authorId}` })
    );
  }
}

export async function createNewAuthor(
  request: IncomingMessage,
  response: ServerResponse
) {
  let body = '';
  request.on('data', (chunk) => {
    body += chunk.toString();
  });

  request.on('end', async () => {
    try {
      const { name, fullName, originalName, country } = JSON.parse(body);
      if (name === undefined || name.trim() === '') {
        response.writeHead(400, { 'content-Type': 'application/json' });
        response.end(
          JSON.stringify({
            message:
              "Hello. I'm sorry, but I couldn't add new author. You should fill at least a name",
          })
        );
      } else {
        const authorCountry = await findOrCreateCountryByName(country);
        const newAuthor = await createAuthorDb(
          name,
          fullName,
          originalName,
          authorCountry
        );
        response.writeHead(201, { 'content-Type': 'application/json' });
        response.end(JSON.stringify(newAuthor));
      }
    } catch (error) {
      response.writeHead(400, { 'content-Type': 'application/json' });
      response.end(
        JSON.stringify({
          message:
            "Hello. I'm sorry, but I couldn't add new author. You should fill name",
        })
      );
    }
  });
}

export async function updateAuthor(
  request: IncomingMessage,
  response: ServerResponse
) {
  const authorId = request.url?.split('/')[1] || '0';
  const author = await findAuthorByIdDb(authorId);
  if (author) {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk.toString();
    });

    request.on('end', async () => {
      try {
        const { name, fullName, originalName, country } = JSON.parse(body);
        if (name === undefined || name.trim() === '') {
          response.writeHead(400, { 'content-Type': 'application/json' });
          response.end(
            JSON.stringify({
              message:
                "Hello. I'm sorry, but I couldn't update this author. You should send non-empty name",
            })
          );
        } else {
          let authorCountry: ICountry | string = '';
          if (country) {
            authorCountry = await findOrCreateCountryByName(country);
          }
          const updatedAuthor = await updateAuthorDb(
            authorId,
            name,
            fullName,
            originalName,
            authorCountry
          );
          response.writeHead(200, { 'content-Type': 'application/json' });
          response.end(JSON.stringify(updatedAuthor));
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
  }
}

export async function deleteAuthor(
  request: IncomingMessage,
  response: ServerResponse
) {
  const authorId = request.url?.split('/')[1] || '0';
  const author = await findAuthorByIdDb(authorId);

  if (author) {
    removeAuthorDb(authorId);
    response.writeHead(204, { 'content-Type': 'application/json' });
    response.end(
      JSON.stringify({
        message: `Hello. Author with id ${authorId} was deleted`,
      })
    );
  } else {
    response.writeHead(404, { 'content-Type': 'application/json' });
    response.end(
      JSON.stringify({
        message: `Hello. I'm sorry, but I can't find author with id ${authorId}`,
      })
    );
  }
}
