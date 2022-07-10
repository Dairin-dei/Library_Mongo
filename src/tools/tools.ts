import { resolve } from 'path';
import { findAuthor } from '../controllers/authorController';
import { findGenre } from '../controllers/genreController';
import { findLanguage } from '../controllers/languageController';
import { findAuthorByIdDb } from '../models/authorModel';
import { findCountryByIdDb } from '../models/countryModel';
import { findGenreByIdDb } from '../models/genreModel';
import { findLanguageByIdDb } from '../models/languageModel';
import { findVolumeByIdDb } from '../models/volumeModel';
import { EMPTY_AUTHOR, EMPTY_BOOK, EMPTY_BOOKDB, EMPTY_COUNTRY } from './const';
import {
  IAuthor,
  IAuthorDb,
  IBook,
  IBookDb,
  IGenre,
  ILanguage,
  IVolume,
} from './interfaces';

export function convertArrayToArrayIds(
  arrayObjects: IGenre[] | ILanguage[] | IVolume[] | IAuthor[]
): string[] {
  return arrayObjects.length ? arrayObjects.map((item) => item._id) : [];
}

export function addNewItemIntoArrayIDs(arrayOfIds: string[], id: string) {
  if (arrayOfIds.findIndex((item) => item === id) < 0) {
    return [...arrayOfIds, ...id];
  }
  return arrayOfIds;
}

export async function convertAuthorFromDbFormat(
  authorDb: IAuthorDb
): Promise<IAuthor> {
  if (authorDb === null || authorDb?._id === '') {
    return EMPTY_AUTHOR;
  }
  return {
    _id: authorDb._id,
    name: authorDb.name,
    fullName: authorDb.fullName,
    originalName: authorDb.originalName,
    country: authorDb.countryId
      ? await findCountryByIdDb(authorDb.countryId)
      : EMPTY_COUNTRY,
  };
}

export async function convertBookFromDbFormat(bookDb: IBookDb): Promise<IBook> {
  if (bookDb === null || bookDb?._id === '') {
    return EMPTY_BOOK;
  }
  const authorsArray = [];
  for (const authorId of bookDb.authorsIds) {
    authorsArray.push(
      await convertAuthorFromDbFormat(await findAuthorByIdDb(authorId))
    );
  }

  const genresArray = [];
  for (const genreId of bookDb.genresIds) {
    genresArray.push(await findGenreByIdDb(genreId));
  }

  const volumesArray = [];
  for (const volumeId of bookDb.volumesIds) {
    volumesArray.push(await findVolumeByIdDb(volumeId));
  }

  return {
    _id: bookDb._id,
    name: bookDb.name,
    originalName: bookDb.originalName,
    authorMain: await convertAuthorFromDbFormat(
      await findAuthorByIdDb(bookDb.authorMainId)
    ),
    authors: authorsArray,
    language: await findLanguageByIdDb(bookDb.languageId),
    genreMain: await findGenreByIdDb(bookDb.genreMainId),
    genres: genresArray,
    year: bookDb.year,
    volumes: volumesArray,
    country: await findCountryByIdDb(bookDb.countryId),
  };
}

/*
  _id?: string;
  name: string;
  originalName: string;
  authorMainId: string;
  authorsIds: string[];
  languageId: string;
  genreMainId: string;
  genresIds: string[];
  year: number;
  volumesIds: string[];
  countryId: string;
  */

/*export async function convertAuthorFromIdToIAuthor(
  id: string
): Promise<IAuthor> {
  if (id) {
    const foundAuthor = await convertAuthorFromDbFormat(
      await findAuthorByIdDb(id)
    );
    if (foundAuthor) {
      return foundAuthor;
    }
  }
  return EMPTY_AUTHOR;
}*/
