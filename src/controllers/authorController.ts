import { IncomingMessage, ServerResponse } from 'http';
import {
  createAuthorDb,
  findAllAuthorsDb,
  findAuthorByIdDb,
  removeAuthorDb,
  updateAuthorDb,
} from '../models/authorModel';
import { findOrCreateCountryByName } from '../controllers/countryController';
import { ICountry } from '../tools/interfaces';
import { convertAuthorFromDbFormat } from '../tools/tools';
import { EMPTY_COUNTRY } from '../tools/const';

export async function findAllAuthors(
  request: IncomingMessage,
  response: ServerResponse
) {
  try {
    const authorsInDatabase = await findAllAuthorsDb();
    const authorsArray = [];
    for (const authorDb of authorsInDatabase) {
      authorsArray.push(await convertAuthorFromDbFormat(authorDb));
    }
    response.writeHead(200, { 'content-Type': 'application/json' });
    response.end(JSON.stringify(authorsArray));
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
  const author = await convertAuthorFromDbFormat(
    await findAuthorByIdDb(authorId)
  );
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

        const newAuthor = await convertAuthorFromDbFormat(
          await createAuthorDb(name, fullName, originalName, authorCountry)
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
  const authorDb = await convertAuthorFromDbFormat(
    await findAuthorByIdDb(authorId)
  );
  if (authorDb) {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk.toString();
    });

    request.on('end', async () => {
      try {
        const { name, fullName, originalName, country } = JSON.parse(body);
        let authorCountry: ICountry = authorDb.country;
        if (country) {
          authorCountry = await findOrCreateCountryByName(country);
        }
        console.log('update author', authorCountry);
        const updatedAuthor = await convertAuthorFromDbFormat(
          await updateAuthorDb(
            authorId,
            name,
            fullName,
            originalName,
            authorCountry
          )
        );
        response.writeHead(200, { 'content-Type': 'application/json' });
        response.end(JSON.stringify(updatedAuthor));
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
