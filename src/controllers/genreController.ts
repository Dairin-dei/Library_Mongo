import { IncomingMessage, ServerResponse } from 'http';
import { IGenre } from '../tools/interfaces';
import {
  createGenreDb,
  findAllGenresDb,
  findGenreByIdDb,
  findGenreByNameDb,
  removeGenreDb,
  updateGenreDb,
} from '../models/genreModel';

export async function findAllGenres(
  request: IncomingMessage,
  response: ServerResponse
) {
  try {
    const genresInDatabase = await findAllGenresDb();
    response.writeHead(200, { 'content-Type': 'application/json' });
    response.end(JSON.stringify(genresInDatabase));
  } catch (error) {
    console.log("Sorry, can't get genres", error.message);
    response.writeHead(200, { 'content-Type': 'application/json' });
    response.end(JSON.stringify([]));
  }
}

export async function findGenre(
  request: IncomingMessage,
  response: ServerResponse
) {
  const genreId = request.url?.split('/')[1] || '0';
  const genre = await findGenreByIdDb(genreId);

  if (genre !== undefined) {
    response.writeHead(200, { 'content-Type': 'application/json' });
    response.end(JSON.stringify(genre));
  } else {
    response.writeHead(404, { 'content-Type': 'application/json' });
    response.end(
      JSON.stringify({ message: `I don't know genre with id ${genreId}` })
    );
  }
}

export async function createNewGenre(
  request: IncomingMessage,
  response: ServerResponse
) {
  let body = '';
  request.on('data', (chunk) => {
    body += chunk.toString();
  });

  request.on('end', async () => {
    console.log('genre0', JSON.parse(body));
    try {
      const { name } = JSON.parse(body);
      console.log('genre1', name);
      if (name === undefined || name.trim() === '') {
        response.writeHead(400, { 'content-Type': 'application/json' });
        response.end(
          JSON.stringify({
            message:
              "Hello. I'm sorry, but I couldn't add new genre. You should fill name",
          })
        );
      } else {
        const newGenre = await createGenreDb(name);
        response.writeHead(201, { 'content-Type': 'application/json' });
        response.end(JSON.stringify(newGenre));
      }
    } catch (error) {
      response.writeHead(400, { 'content-Type': 'application/json' });
      response.end(
        JSON.stringify({
          message:
            "Hello. I'm sorry, but I couldn't add new genre. You should fill name",
        })
      );
    }
  });
}

export async function findOrCreateGenreByName(name: string): Promise<IGenre> {
  const genre: IGenre = await findGenreByNameDb(name);
  if (genre) {
    return genre;
  }
  const newGenre: IGenre = await createGenreDb(name);
  return newGenre;
}

export async function updateGenre(
  request: IncomingMessage,
  response: ServerResponse
) {
  const genreId = request.url?.split('/')[1] || '0';
  const genre = await findGenreByIdDb(genreId);
  if (genre) {
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
                "Hello. I'm sorry, but I couldn't update this genre. You should send non-empty name",
            })
          );
        } else {
          const updatedGenre = await updateGenreDb(genreId, name);
          response.writeHead(200, { 'content-Type': 'application/json' });
          response.end(JSON.stringify(updatedGenre));
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

export async function deleteGenre(
  request: IncomingMessage,
  response: ServerResponse
) {
  const genreId = request.url?.split('/')[1] || '0';
  const genre = await findGenreByIdDb(genreId);

  if (genre) {
    removeGenreDb(genreId);
    response.writeHead(204, { 'content-Type': 'application/json' });
    response.end(
      JSON.stringify({
        message: `Hello. genre with id ${genreId} was deleted`,
      })
    );
  } else {
    response.writeHead(404, { 'content-Type': 'application/json' });
    response.end(
      JSON.stringify({
        message: `Hello. I'm sorry, but I can't find genre with id ${genreId}`,
      })
    );
  }
}
