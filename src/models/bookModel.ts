import {
  IAuthor,
  IBookDb,
  ICountry,
  IGenre,
  ILanguage,
  IVolume,
} from '../tools/interfaces';
import { getCollectionByName } from '../db';
import { addNewItemIntoArrayIDs, convertArrayToArrayIds } from '../tools/tools';
import { ObjectId } from 'mongodb';
import {
  EMPTY_AUTHOR,
  EMPTY_COUNTRY,
  EMPTY_GENRE,
  EMPTY_LANGUAGE,
} from '../tools/const';

export function findAllBooksDb() {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('books');
    resolve(collection.find({}).toArray());
  });
}

export function findBookByIdDb(id: string): Promise<IBookDb> {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('books');
    collection.findOne({ _id: new ObjectId(id) }, async (error, item) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(item as unknown as IBookDb);
    });
  });
}

export function findBookByNameDb(name: string): Promise<IBookDb> {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('books');
    collection.findOne({ name: name.trim() }, async (error, item) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(item as unknown as IBookDb);
    });
  });
}

export async function createBookDb(
  name: string,
  originalName = '',
  authorMain: IAuthor = EMPTY_AUTHOR,
  authors: IAuthor[] = [],
  language: ILanguage = EMPTY_LANGUAGE,
  genreMain: IGenre = EMPTY_GENRE,
  genres: IGenre[] = [],
  year = 0,
  volumes: IVolume[] = [],
  country: ICountry = EMPTY_COUNTRY
): Promise<IBookDb> {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('books');
    const newBook = {
      name: name,
      originalName: originalName,
      authorMainId: authorMain ? authorMain._id : '',
      authorsIds: convertArrayToArrayIds(authors),
      languageId: language ? language._id : '',
      genreMainId: genreMain ? genreMain._id : '',
      genresIds: convertArrayToArrayIds(genres),
      year: year,
      volumesIds: convertArrayToArrayIds(volumes),
      countryId: country ? country._id : '',
    };
    collection.insertOne(newBook, (error) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(newBook);
    });
  });
}

export async function updateBookDb(
  id: string,
  name: string,
  originalName = '',
  authorMain: IAuthor = EMPTY_AUTHOR,
  authors: IAuthor[] = [],
  language: ILanguage = EMPTY_LANGUAGE,
  genreMain: IGenre = EMPTY_GENRE,
  genres: IGenre[] = [],
  year = 0,
  volumes: IVolume[] = [],
  country: ICountry = EMPTY_COUNTRY
) {
  const currentBook: IBookDb = await findBookByIdDb(id);

  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('books');

    if (authorMain) {
      if (!currentBook.authorsIds.length) {
        currentBook.authorMainId = authorMain._id;
      }
      currentBook.authorsIds = addNewItemIntoArrayIDs(
        currentBook.authorsIds,
        authorMain._id
      );
    }

    if (genreMain) {
      if (!currentBook.genresIds.length) {
        currentBook.genreMainId = genreMain._id;
      }
      currentBook.genresIds = addNewItemIntoArrayIDs(
        currentBook.genresIds,
        genreMain._id
      );
    }

    collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: name || currentBook.name,
          originalName: originalName || currentBook.originalName,
          authorMainId: currentBook.authorMainId,
          authorsIds: convertArrayToArrayIds(authors),
          languageId: language ? language._id : '',
          genreMainId: currentBook.genreMainId,
          genresIds: convertArrayToArrayIds(genres),
          year: year !== 0 ? year : currentBook.year,
          volumesIds: convertArrayToArrayIds(volumes),
          countryId: country ? country._id : '',
        },
      },
      { returnDocument: 'after' },
      (error, result) => {
        if (error) {
          console.log(error.message);
          resolve(null);
        }
        resolve(result.value);
      }
    );
  });
}

export function removeBookDb(id: string) {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('books');
    collection.findOneAndDelete({ _id: new ObjectId(id) }, (error, result) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(result.value);
    });
  });
}
