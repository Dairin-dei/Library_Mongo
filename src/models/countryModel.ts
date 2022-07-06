import { ICountry } from '../interfaces';
import { getCollectionByName } from '../db';
import { resolve } from 'path';

export function findAllCountries() {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('countries');
    resolve(collection.find({}).toArray());
  });
}

export function findCountryByIdDb(id: string): Promise<ICountry | null> {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('countries');
    collection.findOne({ _id: new Object(id) }, (error, item) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(item as unknown as ICountry);
    });
  });
}

export function findCountryByNameDb(name: string):Promise<ICountry|null {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('countries');
    collection.findOne({ name: name }, (error, item) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(item as unknown as ICountry);
    });
  });
}

export async function findOrCreateCountryByName(name: string):Promise<ICountry> {
  const country: ICountry | null = await findCountryByNameDb(name);
  return new Promise((resolve, reject) => {
  if (country) {
    resolve(country);
  }
  const newCountry:ICountry = await createCountryDb(name)
  resolve(newCountry);
})
}


export function createCountryDb(name: string):Promise<ICountry> {
  return new Promise((resolve, reject) => {
    const newCountry: ICountry = {
      name: name,
    };
    const collection = getCollectionByName('countries');
    collection.insertOne(newCountry, (error) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(newCountry);
    });
  });
}

export function updateCountryDb(id: string, name: string) {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('countries');
    if (name) {
      collection.findOneAndUpdate(
        { id: new Object(id) },
        { $set: { name: name } },
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

export function removeCountryDb(id: string) {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('countries');
    collection.findOneAndDelete({ _id: new Object(id) }, (error, result) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(result.value);
    });
  });
}
