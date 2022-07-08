import {
  IAuthor,
  IBookDb,
  ICountry,
  IGenre,
  ILanguage,
  IVolume,
} from '../interfaces';
import { getCollectionByName } from '../db';
import { addNewItemIntoArrayIDs, convertArrayToArrayIds } from '../tools/tools';
import { ObjectId } from 'mongodb';

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
  authorMain: IAuthor | null = null,
  authors: IAuthor[] = [],
  language: ILanguage | null = null,
  genreMain: IGenre | null = null,
  genres: IGenre[] = [],
  year = 0,
  volumes: IVolume[] = [],
  country: ICountry | null = null
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
  author: IAuthor | null = null,
  language: ILanguage | null = null,
  genre: IGenre | null = null,
  year = 0,
  volume: IVolume | null = null,
  country: ICountry | null = null
) {
  const currentBook: IBookDb = await findBookByIdDb(id);

  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('books');

    if (author) {
      if (!currentBook.authorsIds.length) {
        currentBook.authorMainId = author._id;
      }
      currentBook.authorsIds = addNewItemIntoArrayIDs(
        currentBook.authorsIds,
        author._id
      );
    }

    if (genre) {
      if (!currentBook.genresIds.length) {
        currentBook.genreMainId = genre._id;
      }
      currentBook.genresIds = addNewItemIntoArrayIDs(
        currentBook.genresIds,
        genre._id
      );
    }

    if (volume) {
      currentBook.volumesIds = addNewItemIntoArrayIDs(
        currentBook.volumesIds,
        volume._id
      );
    }

    collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: name || currentBook.name,
          originalName: originalName || currentBook.originalName,
          authorMainId: currentBook.authorMainId,
          authorsIds: currentBook.authorsIds,
          languageId: language ? language._id : '',
          genreMainId: currentBook.genreMainId,
          genresIds: currentBook.genresIds,
          year: year,
          volumesIds: currentBook.volumesIds,
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
