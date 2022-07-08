import { IGenre } from '../interfaces';
import { getCollectionByName } from '../db';
import { ObjectId } from 'mongodb';

export function findAllGenresDb() {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('genres');
    resolve(collection.find({}).toArray());
  });
}

export function findGenreByIdDb(id: string) {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('genres');
    collection.findOne({ _id: new ObjectId(id) }, (error, item) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(item);
    });
  });
}

export function findGenreByNameDb(name: string): Promise<IGenre | null> {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('genres');
    collection.findOne({ name: name }, (error, item) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(item as unknown as IGenre);
    });
  });
}

export function createGenreDb(name: string): Promise<IGenre | null> {
  return new Promise((resolve, reject) => {
    const newGenre = {
      name: name,
    };
    const collection = getCollectionByName('genres');
    collection.insertOne(newGenre, (error) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(newGenre);
    });
  });
}

export function updateGenreDb(id: string, name: string) {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('genres');
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

export function removeGenreDb(id: string) {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('genres');
    collection.findOneAndDelete({ _id: new ObjectId(id) }, (error, result) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(result.value);
    });
  });
}
