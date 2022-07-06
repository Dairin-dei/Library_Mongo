import { ILanguage } from '../interfaces';
import { getCollectionByName } from '../db';

export function findAllLanguages() {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('languages');
    resolve(collection.find({}).toArray());
  });
}

export function findLanguageByIdDb(id: string) {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('languages');
    collection.findOne({ _id: new Object(id) }, (error, item) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(item);
    });
  });
}

export function createLanguageDb(name: string) {
  return new Promise((resolve, reject) => {
    const newCountry: ILanguage = {
      name: name,
    };
    const collection = getCollectionByName('languages');
    collection.insertOne(newCountry, (error) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(newCountry);
    });
  });
}

export function updateLanguageDb(id: string, name: string) {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('languages');
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
    const collection = getCollectionByName('languages');
    collection.findOneAndDelete({ _id: new Object(id) }, (error, result) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(result.value);
    });
  });
}
