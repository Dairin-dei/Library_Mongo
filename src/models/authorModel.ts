import { IAuthorDb, ICountry } from '../interfaces';
import { getCollectionByName } from '../db';
import { ObjectId } from 'mongodb';

export function findAllAuthorsDb() {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('authors');
    resolve(collection.find({}).toArray());
  });
}

export function findAuthorByIdDb(id: string): Promise<IAuthorDb> {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('authors');
    collection.findOne({ _id: new ObjectId(id) }, async (error, item) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(item as unknown as IAuthorDb);
    });
  });
}

export function findAuthorByNameDb(name: string): Promise<IAuthorDb> {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('authors');
    collection.findOne({ name: name.trim() }, async (error, item) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(item as unknown as IAuthorDb);
    });
  });
}

export async function createAuthorDb(
  name: string,
  fullName = '',
  originalName = '',
  country: ICountry | null = null
) {
  const collection = getCollectionByName('authors');
  return new Promise((resolve, reject) => {
    const newAuthor = {
      name: name,
      fullName: fullName,
      originalName: originalName,
      countryId: country === null ? '' : country._id,
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
  fullName = 0,
  originalName = 0,
  country: ICountry | string = ''
) {
  const currentAuthor: IAuthorDb = await findAuthorByIdDb(id);

  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('authors');
    if (name || fullName || originalName || country) {
      collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: {
            name: name || currentAuthor.name,
            fullName: fullName || currentAuthor.fullName,
            originalName: originalName || currentAuthor.originalName,
            country:
              country === ''
                ? currentAuthor.countryId
                : (country as ICountry)._id,
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

export function removeAuthorDb(id: string) {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('authors');
    collection.findOneAndDelete({ _id: new ObjectId(id) }, (error, result) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(result.value);
    });
  });
}
