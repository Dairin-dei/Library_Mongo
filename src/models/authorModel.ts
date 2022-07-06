import { IAuthor, ICountry } from '../interfaces';
import { getCollectionByName } from '../db';
import { findCountryByNameDb, findOrCreateCountryByName } from './countryModel';

export function findAllAuthors() {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('authors');
    resolve(collection.find({}).toArray());
  });
}

export function findAuthorByIdDb(id: string): Promise<IAuthor> {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('authors');
    collection.findOne({ _id: new Object(id) }, (error, item) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(item as unknown as IAuthor);
    });
  });
}

export async function createAuthorDb(
  name: string,
  fullName: string,
  originalName: string,
  countryName: string
) {
  const collection = getCollectionByName('authors');
  const country = await findOrCreateCountryByName(countryName);
  return new Promise((resolve, reject) => {
    const newAuthor = {
      name: name,
      fullName: fullName,
      originalName: originalName,
      countryId: country._id,
    };
    collection.insertOne(newAuthor, (error) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(newAuthor);
    });
  });
}

export async function updateAuthorDb(
  id: string,
  name = '',
  fullName: 0,
  originalName: 0,
  countryName: ''
) {
  const currentAuthor: IAuthor = await findAuthorByIdDb(id);

  const country =
    countryName === '' ? null : await findOrCreateCountryByName(countryName);

  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('authors');
    if (name || fullName || originalName || countryName) {
      collection.findOneAndUpdate(
        { id: new Object(id) },
        {
          $set: {
            name: name || currentAuthor.name,
            fullName: fullName || currentAuthor.fullName,
            originalName: originalName || currentAuthor.originalName,
            country: country === null ? currentAuthor.country._id : country._id,
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
    }
  });
}

export function removeVolumeDb(id: string) {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('authors');
    collection.findOneAndDelete({ _id: new Object(id) }, (error, result) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(result.value);
    });
  });
}
