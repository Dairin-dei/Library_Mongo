import { IncomingMessage, ServerResponse } from 'http';
import {
  IAuthor,
  IAuthorDb,
  ICountry,
  IGenre,
  ILanguage,
  IVolume,
} from '../tools/interfaces';
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
import { findAuthorByIdDb, findAuthorByNameDb } from '../models/authorModel';
import {
  EMPTY_AUTHOR,
  EMPTY_COUNTRY,
  EMPTY_GENRE,
  EMPTY_LANGUAGE,
} from '../tools/const';
import {
  convertAuthorFromDbFormat,
  convertBookFromDbFormat,
} from '../tools/tools';
import { createVolumeDb, findVolumeByIdDb } from '../models/volumeModel';
import { findCountryByIdDb } from '../models/countryModel';
import { findLanguageByIdDb } from '../models/languageModel';
import { findGenreByIdDb } from '../models/genreModel';

export async function findAllBooks(
  request: IncomingMessage,
  response: ServerResponse
) {
  try {
    const booksInDatabase = await findAllBooksDb();
    const booksArray = [];
    for (const bookDb of booksInDatabase) {
      booksArray.push(await convertBookFromDbFormat(bookDb));
    }
    response.writeHead(200, { 'content-Type': 'application/json' });
    response.end(JSON.stringify(booksArray));
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
  //const book = await convertBookFromDbFormat(await findBookByIdDb(bookId));
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
        let bookCountry: ICountry = EMPTY_COUNTRY;
        if (country) {
          bookCountry = await findOrCreateCountryByName(country);
        }

        let bookAuthor: IAuthor = EMPTY_AUTHOR;
        const bookAuthors: IAuthor[] = [];
        if (author) {
          bookAuthor = await convertAuthorFromDbFormat(
            await findAuthorByNameDb(author)
          );
          bookAuthors.push(bookAuthor);

          if (!bookAuthor) {
            console.log(
              `Автор с именем ${author} отсутствует в базу.Книга будет создана с пустым автором`
            );
          }
        }
        if (Array.isArray(authors)) {
          if (authors.length) {
            for (const item of authors) {
              const adAuthor = await findAuthorByNameDb(item);
              if (!adAuthor) {
                console.log(
                  `Автор с именем ${item} отсутствует в базу.В списке авторов книги его не будет`
                );
              } else {
                bookAuthors.push(await convertAuthorFromDbFormat(adAuthor));
              }
            }
          }
        }

        let bookLanguage: ILanguage = EMPTY_LANGUAGE;
        if (language) {
          bookLanguage = await findOrCreateLanguageByName(language);
        }

        let bookGenre: IGenre = EMPTY_GENRE;
        const bookGenres: IGenre[] = [];
        if (genre) {
          bookGenre = await findOrCreateGenreByName(genre);
          bookGenres.push(bookGenre);
        }

        if (Array.isArray(genres)) {
          for (const genreName of genres) {
            if (genreName) {
              const adGenre = await findOrCreateGenreByName(genreName);
              bookGenres.push(adGenre);
            }
          }
        }

        const bookVolumes: IVolume[] = [];
        if (Array.isArray(volumes)) {
          for (const item of volumes) {
            const adVolume = await findOrCreateVolumeByName(item);
            bookVolumes.push(adVolume);
          }
        }
        if (bookVolumes.length === 0) {
          bookVolumes.push(await createVolumeDb(name));
        }
        // console.log(bookVolumes);
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
        response.end(JSON.stringify(await convertBookFromDbFormat(newBook)));
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
  const currentBook = await findBookByIdDb(bookId);
  if (currentBook) {
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

        let bookCountry: ICountry = EMPTY_COUNTRY;
        if (country) {
          bookCountry = await findOrCreateCountryByName(country);
        }
        // console.log(bookCountry, country);

        let bookAuthor: IAuthor = EMPTY_AUTHOR;

        const bookAuthors: IAuthor[] = [];

        if (Array.isArray(currentBook.authorsIds)) {
          for (const prevAuthor of currentBook.authorsIds) {
            bookAuthors.push(
              await convertAuthorFromDbFormat(
                await findAuthorByIdDb(prevAuthor)
              )
            );
          }
        }

        // console.log('old', currentBook.authorsIds);
        // console.log('old', bookAuthors);

        if (author) {
          bookAuthor = await convertAuthorFromDbFormat(
            await findAuthorByNameDb(author)
          );
          if (!bookAuthor) {
            console.log(
              `Автор с именем ${author} отсутствует в базе. Он не будет добавлен в список авторов книги.`
            );
          } else {
            if (bookAuthors.findIndex((item) => item === bookAuthor) < 0) {
              bookAuthors.push(bookAuthor);
            }
          }
        }
        // console.log('bookAuthor', bookAuthor);
        //  console.log('bookAuthor', bookAuthors);

        if (Array.isArray(authors)) {
          if (authors.length) {
            for (const authorName of authors) {
              const adAuthor = await findAuthorByNameDb(authorName);
              if (!adAuthor) {
                console.log(
                  `Автор с именем ${authorName} отсутствует в базе. Он не будет добавлен в список авторов книги.`
                );
              } else {
                const adNewAuthor = await convertAuthorFromDbFormat(adAuthor);
                if (bookAuthors.findIndex((item) => item === adNewAuthor) < 0) {
                  bookAuthors.push(adNewAuthor);
                }
              }
            }
          }
        }
        // console.log('after', bookAuthors);

        let bookLanguage = EMPTY_LANGUAGE;

        if (language) {
          bookLanguage = await findOrCreateLanguageByName(language);
        }

        let bookGenre = EMPTY_GENRE;

        const bookGenres: IGenre[] = [];
        if (Array.isArray(currentBook.genresIds)) {
          for (const prevGenre of currentBook.genresIds) {
            const genreA = await findGenreByIdDb(prevGenre);
            if (genreA) {
              bookGenres.push(genreA as IVolume);
            }
          }
        }

        if (genre) {
          bookGenre = await findOrCreateGenreByName(genre);
          if (bookGenre) {
            if (bookGenres.findIndex((item) => item === bookGenre) < 0) {
              bookGenres.push(bookGenre as IGenre);
            }
          }
        }

        if (Array.isArray(genres)) {
          for (const genreName of genres) {
            if (genreName) {
              const adGenre = await findOrCreateGenreByName(genreName);
              if (adGenre) {
                if (bookGenres.findIndex((item) => item === adGenre) < 0) {
                  bookGenres.push(adGenre);
                }
              }
            }
          }
        }

        const bookVolumes: IVolume[] = [];

        if (Array.isArray(currentBook.volumesIds)) {
          for (const prevVolume of currentBook.volumesIds) {
            const volume = await findVolumeByIdDb(prevVolume);
            if (volume) {
              bookVolumes.push(volume);
            }
          }
        }

        if (Array.isArray(volumes)) {
          for (const item of volumes) {
            const adVolume = await findOrCreateVolumeByName(item);
            if (bookVolumes.findIndex((item) => item === adVolume) < 0) {
              bookVolumes.push(adVolume);
            }
          }
        }
        if (bookVolumes.length === 0) {
          bookVolumes.push(await createVolumeDb(name));
        }

        const updatedBook = await updateBookDb(
          bookId,
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

        response.writeHead(200, { 'content-Type': 'application/json' });
        response.end(
          JSON.stringify(await convertBookFromDbFormat(updatedBook))
        );
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
