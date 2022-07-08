import { IncomingMessage, ServerResponse } from 'http';
import { ILanguage } from '../interfaces';
import {
  createLanguageDb,
  findAllLanguagesDb,
  findLanguageByIdDb,
  findLanguageByNameDb,
  removeLanguageDb,
  updateLanguageDb,
} from '../models/languageModel';

export async function findAllLanguages(
  request: IncomingMessage,
  response: ServerResponse
) {
  try {
    const languagesInDatabase = await findAllLanguagesDb();
    response.writeHead(200, { 'content-Type': 'application/json' });
    response.end(JSON.stringify(languagesInDatabase));
  } catch (error) {
    console.log("Sorry, can't get languages", error.message);
    response.writeHead(200, { 'content-Type': 'application/json' });
    response.end(JSON.stringify([]));
  }
}

export async function findLanguage(
  request: IncomingMessage,
  response: ServerResponse
) {
  const languageId = request.url?.split('/')[1] || '0';
  const language = await findLanguageByIdDb(languageId);

  if (language) {
    response.writeHead(200, { 'content-Type': 'application/json' });
    response.end(JSON.stringify(language));
  } else {
    response.writeHead(404, { 'content-Type': 'application/json' });
    response.end(
      JSON.stringify({ message: `I don't know language with id ${languageId}` })
    );
  }
}

export async function createNewLanguage(
  request: IncomingMessage,
  response: ServerResponse
) {
  let body = '';
  request.on('data', (chunk) => {
    body += chunk.toString();
  });

  request.on('end', async () => {
    try {
      const { name } = JSON.parse(body);
      if (name === undefined || name.trim() === '') {
        response.writeHead(400, { 'content-Type': 'application/json' });
        response.end(
          JSON.stringify({
            message:
              "Hello. I'm sorry, but I couldn't add new language. You should fill name",
          })
        );
      } else {
        const newLanguage = await createLanguageDb(name);
        response.writeHead(201, { 'content-Type': 'application/json' });
        response.end(JSON.stringify(newLanguage));
      }
    } catch (error) {
      response.writeHead(400, { 'content-Type': 'application/json' });
      response.end(
        JSON.stringify({
          message:
            "Hello. I'm sorry, but I couldn't add new language. Data has mistakes",
        })
      );
    }
  });
}

export async function findOrCreateLanguageByName(
  name: string
): Promise<ILanguage> {
  const country: ILanguage | null = await findLanguageByNameDb(name);
  if (country) {
    return country;
  }
  const newLanguage: ILanguage = await createLanguageDb(name);
  return newLanguage;
}

export async function updateLanguage(
  request: IncomingMessage,
  response: ServerResponse
) {
  const languageId = request.url?.split('/')[1] || '0';
  const language = await findLanguageByIdDb(languageId);
  if (language) {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk.toString();
    });

    request.on('end', async () => {
      try {
        const { name } = JSON.parse(body);
        if (name === undefined || name.trim() === '') {
          response.writeHead(400, { 'content-Type': 'application/json' });
          response.end(
            JSON.stringify({
              message:
                "Hello. I'm sorry, but I couldn't update this language. You should send non-empty name",
            })
          );
        } else {
          const updatedLanguage = await updateLanguageDb(languageId, name);
          response.writeHead(200, { 'content-Type': 'application/json' });
          response.end(JSON.stringify(updatedLanguage));
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

export async function deleteLanguage(
  request: IncomingMessage,
  response: ServerResponse
) {
  const languageId = request.url?.split('/')[1] || '0';
  const language = await findLanguageByIdDb(languageId);

  if (language) {
    removeLanguageDb(languageId);
    response.writeHead(204, { 'content-Type': 'application/json' });
    response.end(
      JSON.stringify({
        message: `Hello. language with id ${languageId} was deleted`,
      })
    );
  } else {
    response.writeHead(404, { 'content-Type': 'application/json' });
    response.end(
      JSON.stringify({
        message: `Hello. I'm sorry, but I can't find language with id ${languageId}`,
      })
    );
  }
}
