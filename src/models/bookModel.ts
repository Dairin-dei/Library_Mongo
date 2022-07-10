import {
  IAuthor,
  IBookDb,
  ICountry,
  IGenre,
  ILanguage,
  IVolume,
} from '../tools/interfaces';
import { getCollectionByName } from '../db';
import {
  addNewItemIntoArrayIDs,
  convertArrayToArrayIds,
  convertBookFromDbFormat,
} from '../tools/tools';
import { ObjectId } from 'mongodb';
import {
  EMPTY_AUTHOR,
  EMPTY_BOOKDB,
  EMPTY_COUNTRY,
  EMPTY_GENRE,
  EMPTY_LANGUAGE,
} from '../tools/const';

export function findAllBooksDb(): Promise<Array<IBookDb>> {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('books');
    resolve(collection.find({}).toArray() as unknown as Array<IBookDb>);
  });
}

export function findBookByIdDb(id: string): Promise<IBookDb> {
  try {
    new ObjectId(id);
  } catch {
    console.log('Error in id');
    return new Promise((resolve, reject) => {
      resolve(null);
    });
  }
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('books');
    collection.findOne({ _id: new ObjectId(id) }, async (error, item) => {
      if (error) {
        console.log(error.message);
        resolve(EMPTY_BOOKDB);
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
      resolve(newBook as IBookDb);
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
): Promise<IBookDb> {
  try {
    new ObjectId(id);
  } catch {
    console.log('Error in id');
    return new Promise((resolve, reject) => {
      resolve(null);
    });
  }
  const currentBook: IBookDb = await findBookByIdDb(id);
  // console.log('updateBookDb', country);
  // console.log(currentBook);

  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('books');

    if (authorMain.name !== '') {
      currentBook.authorMainId = authorMain._id;
    }
    if (authors.length) {
      currentBook.authorsIds = convertArrayToArrayIds(authors);
    }
    if (genreMain.name !== '') {
      currentBook.genreMainId = genreMain._id;
    }
    if (genres.length) {
      currentBook.genresIds = convertArrayToArrayIds(genres);
    }
    if (volumes.length) {
      currentBook.volumesIds = convertArrayToArrayIds(volumes);
    }
    // console.log('currentBook.genresIds', currentBook.genresIds);

    collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: name || currentBook.name,
          originalName: originalName || currentBook.originalName,
          authorMainId: currentBook.authorMainId,
          authorsIds: currentBook.authorsIds,
          languageId:
            language.name !== '' ? language._id : currentBook.languageId,
          genreMainId: currentBook.genreMainId,
          genresIds: currentBook.genresIds,
          year: year !== 0 ? year : currentBook.year,
          volumesIds: currentBook.volumesIds,
          countryId: country.name !== '' ? country._id : currentBook.countryId,
        },
      },
      { returnDocument: 'after' },
      (error, result) => {
        if (error) {
          console.log(error.message);
          resolve(EMPTY_BOOKDB);
        }
        resolve(result.value as unknown as IBookDb);
      }
    );
  });
}

export function removeBookDb(id: string) {
  try {
    new ObjectId(id);
  } catch {
    console.log('Error in id');
    return new Promise((resolve, reject) => {
      resolve(null);
    });
  }
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('books');
    collection.findOneAndDelete({ _id: new ObjectId(id) }, (error, result) => {
      if (error) {
        console.log(error.message);
        resolve(EMPTY_BOOKDB);
      }
      resolve(result.value);
    });
  });
}
