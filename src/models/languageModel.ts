import { ILanguage } from '../interfaces';
import { getCollectionByName } from '../db';
import { ObjectId } from 'mongodb';

export function findAllLanguagesDb() {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('languages');
    resolve(collection.find({}).toArray());
  });
}

export function findLanguageByIdDb(id: string) {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('languages');
    collection.findOne({ _id: new ObjectId(id) }, (error, item) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(item);
    });
  });
}

export function findLanguageByNameDb(name: string): Promise<ILanguage | null> {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('languages');
    collection.findOne({ name: name }, (error, item) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(item as unknown as ILanguage);
    });
  });
}

export function createLanguageDb(name: string): Promise<ILanguage> {
  return new Promise((resolve, reject) => {
    const newLanguage = {
      name: name,
    };
    const collection = getCollectionByName('languages');
    collection.insertOne(newLanguage, (error) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(newLanguage);
    });
  });
}

export function updateLanguageDb(id: string, name: string) {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('languages');
    if (name) {
      collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
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

export function removeLanguageDb(id: string) {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('languages');
    collection.findOneAndDelete({ _id: new ObjectId(id) }, (error, result) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(result.value);
    });
  });
}
