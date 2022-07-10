import { ILanguage } from '../tools/interfaces';
import { getCollectionByName } from '../db';
import { ObjectId } from 'mongodb';
import { EMPTY_LANGUAGE } from '../tools/const';

export function findAllLanguagesDb() {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('languages');
    resolve(collection.find({}).toArray());
  });
}

export function findLanguageByIdDb(id: string): Promise<ILanguage> {
  try {
    new ObjectId(id);
  } catch {
    console.log('Error in id');
    return new Promise((resolve, reject) => {
      resolve(null);
    });
  }
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('languages');
    collection.findOne({ _id: new ObjectId(id) }, (error, item) => {
      if (error) {
        console.log(error.message);
        resolve(EMPTY_LANGUAGE);
      }
      resolve(item as unknown as ILanguage);
    });
  });
}

export function findLanguageByNameDb(name: string): Promise<ILanguage> {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('languages');
    collection.findOne({ name: name }, (error, item) => {
      if (error) {
        console.log(error.message);
        resolve(EMPTY_LANGUAGE);
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
  try {
    new ObjectId(id);
  } catch {
    console.log('Error in id');
    return new Promise((resolve, reject) => {
      resolve(null);
    });
  }
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
            resolve(EMPTY_LANGUAGE);
          }
          resolve(result.value);
        }
      );
    }
  });
}

export function removeLanguageDb(id: string) {
  try {
    new ObjectId(id);
  } catch {
    console.log('Error in id');
    return new Promise((resolve, reject) => {
      resolve(null);
    });
  }
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('languages');
    collection.findOneAndDelete({ _id: new ObjectId(id) }, (error, result) => {
      if (error) {
        console.log(error.message);
        resolve(EMPTY_LANGUAGE);
      }
      resolve(result.value);
    });
  });
}
