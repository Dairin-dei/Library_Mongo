import { IGenre } from '../interfaces';
import { getCollectionByName } from '../db';

export function findAllGenres() {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('genres');
    resolve(collection.find({}).toArray());
  });
}

export function findGenreByIdDb(id: string) {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('genres');
    collection.findOne({ _id: new Object(id) }, (error, item) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(item);
    });
  });
}

export function createGenreDb(name: string) {
  return new Promise((resolve, reject) => {
    const newGenre: IGenre = {
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

export function removeGenreDb(id: string) {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('genres');
    collection.findOneAndDelete({ _id: new Object(id) }, (error, result) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(result.value);
    });
  });
}
