import { IAuthorDb, ICountry } from '../tools/interfaces';
import { getCollectionByName } from '../db';
import { ObjectId } from 'mongodb';
import { EMPTY_AUTHOR, EMPTY_AUTHORDB, EMPTY_COUNTRY } from '../tools/const';

export function findAllAuthorsDb(): Promise<Array<IAuthorDb>> {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('authors');
    resolve(collection.find({}).toArray() as unknown as Array<IAuthorDb>);
  });
}

export function findAuthorByIdDb(id: string): Promise<IAuthorDb> {
  try {
    new ObjectId(id);
  } catch {
    console.log('Error in id');
    return new Promise((resolve, reject) => {
      resolve(null);
    });
  }
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('authors');
    collection.findOne({ _id: new ObjectId(id) }, async (error, item) => {
      if (error) {
        console.log(error.message);
        resolve(EMPTY_AUTHORDB);
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
        resolve(EMPTY_AUTHORDB);
      }
      resolve(item as unknown as IAuthorDb);
    });
  });
}

export async function createAuthorDb(
  name: string,
  fullName = '',
  originalName = '',
  country: ICountry = EMPTY_COUNTRY
): Promise<IAuthorDb> {
  const collection = getCollectionByName('authors');
  return new Promise((resolve, reject) => {
    const newAuthor = {
      name: name,
      fullName: fullName,
      originalName: originalName,
      countryId: country === EMPTY_COUNTRY ? '' : country._id,
    };
    collection.insertOne(newAuthor, (error) => {
      if (error) {
        console.log(error.message);
        resolve(EMPTY_AUTHORDB);
      }
      resolve(newAuthor as unknown as IAuthorDb);
    });
  });
}

export async function updateAuthorDb(
  id: string,
  name = '',
  fullName = 0,
  originalName = 0,
  country: ICountry
): Promise<IAuthorDb> {
  try {
    new ObjectId(id);
  } catch {
    console.log('Error in id');
    return new Promise((resolve, reject) => {
      resolve(null);
    });
  }
  const currentAuthor: IAuthorDb = await findAuthorByIdDb(id);
  console.log({
    name: name || currentAuthor.name,
    fullName: fullName || currentAuthor.fullName,
    originalName: originalName || currentAuthor.originalName,
    countryId:
      country === EMPTY_COUNTRY ? currentAuthor.countryId : country._id,
  });

  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('authors');
    if (name || fullName || originalName || country) {
      console.log('updateAuthorDb', country === EMPTY_COUNTRY, country._id);
      collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: {
            name: name || currentAuthor.name,
            fullName: fullName || currentAuthor.fullName,
            originalName: originalName || currentAuthor.originalName,
            countryId:
              country === EMPTY_COUNTRY ? currentAuthor.countryId : country._id,
          },
        },
        { returnDocument: 'after' },
        (error, result) => {
          if (error) {
            console.log(error.message);
            resolve(EMPTY_AUTHORDB);
          }
          resolve(result.value as unknown as IAuthorDb);
        }
      );
    }
  });
}

export function removeAuthorDb(id: string) {
  try {
    new ObjectId(id);
  } catch {
    console.log('Error in id');
    return new Promise((resolve, reject) => {
      resolve(null);
    });
  }
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('authors');
    collection.findOneAndDelete({ _id: new ObjectId(id) }, (error, result) => {
      if (error) {
        console.log(error.message);
        resolve(EMPTY_AUTHOR);
      }
      resolve(result.value);
    });
  });
}
