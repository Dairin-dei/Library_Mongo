import { IncomingMessage, ServerResponse } from 'http';
import { IAuthor, IGenre, IVolume } from '../interfaces';
import {
  createBookDb,
  findAllBooksDb,
  findBookByIdDb,
  removeBookDb,
  updateBookDb,
} from '../models/bookModel';
import { findOrCreateCountryByName } from './countryController';
import { findOrCreateGenreByName } from './genreController';
import { findOrCreateLanguageByName } from './languageController';
import { findOrCreateVolumeByName } from './volumeController';
import { findAuthorByNameDb } from '../models/authorModel';

export async function findAllBooks(
  request: IncomingMessage,
  response: ServerResponse
) {
  try {
    const booksInDatabase = await findAllBooksDb();
    response.writeHead(200, { 'content-Type': 'application/json' });
    response.end(JSON.stringify(booksInDatabase));
  } catch (error) {
    console.log("Sorry, can't get books", error.message);
    response.writeHead(200, { 'content-Type': 'application/json' });
    response.end(JSON.stringify([]));
  }
}

export async function findBook(
  request: IncomingMessage,
  response: ServerResponse
) {
  const bookId = request.url?.split('/')[1] || '0';
  const book = await findBookByIdDb(bookId);

  if (book) {
    response.writeHead(200, { 'content-Type': 'application/json' });
    response.end(JSON.stringify(book));
  } else {
    response.writeHead(404, { 'content-Type': 'application/json' });
    response.end(
      JSON.stringify({ message: `I don't know book with id ${bookId}` })
    );
  }
}

export async function createNewBook(
  request: IncomingMessage,
  response: ServerResponse
) {
  let body = '';
  request.on('data', (chunk) => {
    body += chunk.toString();
  });

  request.on('end', async () => {
    try {
      const {
        name,
        originalName,
        author,
        authors,
        language,
        genre,
        genres,
        year,
        volumes,
        country,
      } = JSON.parse(body);
      if (name === undefined || name.trim() === '') {
        name.writeHead(400, { 'content-Type': 'application/json' });
        response.end(
          JSON.stringify({
            message: 'Нужно заполнить хотя бы название книги',
          })
        );
      } else {
        const bookCountry = await findOrCreateCountryByName(country);
        const bookAuthor = await findAuthorByNameDb(author);
        if (!bookAuthor) {
          console.log(
            `Автор с именем ${author} отсутствует в базу.Книга будет создана с пустым автором`
          );
        }
        const bookAuthors: IAuthor[] = [];
        for (const item of authors) {
          const adAuthor = await findAuthorByNameDb(item);
          if (!adAuthor) {
            console.log(
              `Автор с именем ${item} отсутствует в базу.В списке авторов книги его не будет`
            );
          } else {
            bookAuthors.push(adAuthor);
          }
        }
        const bookLanguage = await findOrCreateLanguageByName(language);
        const bookGenre = await findOrCreateGenreByName(genre);
        const bookGenres: IGenre[] = [];
        for (const item of genres) {
          const adGenre = await findOrCreateGenreByName(item);
          bookGenres.push(adGenre);
        }
        const bookVolumes: IVolume[] = [];
        for (const item of volumes) {
          const adVolume = await findOrCreateVolumeByName(item);
          bookVolumes.push(adVolume);
        }
        const newBook = await createBookDb(
          name,
          originalName,
          bookAuthor,
          bookAuthors,
          bookLanguage,
          bookGenre,
          bookGenres,
          year,
          bookVolumes,
          bookCountry
        );
        response.writeHead(201, { 'content-Type': 'application/json' });
        response.end(JSON.stringify(newBook));
      }
    } catch (error) {
      response.writeHead(400, { 'content-Type': 'application/json' });
      response.end(
        JSON.stringify({
          message: 'В данных есть ошибки',
        })
      );
    }
  });
}

export async function updateBook(
  request: IncomingMessage,
  response: ServerResponse
) {
  const bookId = request.url?.split('/')[1] || '0';
  const book = await findBookByIdDb(bookId);
  if (book) {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk.toString();
    });

    request.on('end', async () => {
      try {
        const {
          name,
          originalName,
          author,
          language,
          genre,
          year,
          volume,
          country,
        } = JSON.parse(body);
        if (name === undefined || name.trim() === '') {
          response.writeHead(400, { 'content-Type': 'application/json' });
          response.end(
            JSON.stringify({
              message:
                "Hello. I'm sorry, but I couldn't update this book. You should send non-empty name at least",
            })
          );
        } else {
          const bookCountry = await findOrCreateCountryByName(country);
          const bookAuthor = await findAuthorByNameDb(author);
          if (!bookAuthor) {
            console.log(
              `Автор с именем ${author} отсутствует в базу.Книга будет создана с пустым автором`
            );
          }
          const bookLanguage = await findOrCreateLanguageByName(language);
          const bookGenre = await findOrCreateGenreByName(genre);
          const bookVolume = await findOrCreateVolumeByName(volume);
          const updatedBook = await updateBookDb(
            bookId,
            name,
            originalName,
            bookAuthor,
            bookLanguage,
            bookGenre,
            year,
            bookVolume,
            bookCountry
          );
          response.writeHead(200, { 'content-Type': 'application/json' });
          response.end(JSON.stringify(updatedBook));
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

export async function deleteBook(
  request: IncomingMessage,
  response: ServerResponse
) {
  const bookId = request.url?.split('/')[1] || '0';
  const book = await findBookByIdDb(bookId);

  if (book) {
    removeBookDb(bookId);
    response.writeHead(204, { 'content-Type': 'application/json' });
    response.end(
      JSON.stringify({
        message: `Hello. Book with id ${bookId} was deleted`,
      })
    );
  } else {
    response.writeHead(404, { 'content-Type': 'application/json' });
    response.end(
      JSON.stringify({
        message: `Hello. I'm sorry, but I can't find book with id ${bookId}`,
      })
    );
  }
}
