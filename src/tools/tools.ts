import { resolve } from 'path';
import { findAuthor } from '../controllers/authorController';
import { findAuthorByIdDb } from '../models/authorModel';
import { findCountryByIdDb } from '../models/countryModel';
import { EMPTY_AUTHOR, EMPTY_COUNTRY } from './const';
import { IAuthor, IAuthorDb, IGenre, ILanguage, IVolume } from './interfaces';

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
  return {
    _id: authorDb._id,
    name: authorDb.name,
    fullName: authorDb.fullName,
    originalName: authorDb.originalName,
    country: authorDb._id
      ? await findCountryByIdDb(authorDb._id)
      : EMPTY_COUNTRY,
  };
}

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
