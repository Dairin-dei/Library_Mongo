import { IGenre } from '../tools/interfaces';
import { getCollectionByName } from '../db';
import { ObjectId } from 'mongodb';
import { EMPTY_GENRE } from '../tools/const';

export function findAllGenresDb() {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('genres');
    resolve(collection.find({}).toArray());
  });
}

export function findGenreByIdDb(id: string): Promise<IGenre> {
  try {
    new ObjectId(id);
  } catch {
    console.log('Error in id');
    return new Promise((resolve, reject) => {
      resolve(null);
    });
  }
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('genres');
    collection.findOne({ _id: new ObjectId(id) }, (error, item) => {
      if (error) {
        console.log(error.message);
        resolve(EMPTY_GENRE);
      }
      resolve(item as unknown as IGenre);
    });
  });
}

export function findGenreByNameDb(name: string): Promise<IGenre> {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('genres');
    collection.findOne({ name: name }, (error, item) => {
      if (error) {
        console.log(error.message);
        resolve(EMPTY_GENRE);
      }
      resolve(item as unknown as IGenre);
    });
  });
}

export function createGenreDb(name: string): Promise<IGenre> {
  return new Promise((resolve, reject) => {
    const newGenre = {
      name: name,
    };
    const collection = getCollectionByName('genres');
    collection.insertOne(newGenre, (error) => {
      if (error) {
        console.log(error.message);
        resolve(EMPTY_GENRE);
      }
      resolve(newGenre as unknown as IGenre);
    });
  });
}

export function updateGenreDb(id: string, name: string) {
  try {
    new ObjectId(id);
  } catch {
    console.log('Error in id');
    return new Promise((resolve, reject) => {
      resolve(null);
    });
  }
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
            resolve(EMPTY_GENRE);
          }
          resolve(result.value);
        }
      );
    }
  });
}

export function removeGenreDb(id: string) {
  try {
    new ObjectId(id);
  } catch {
    console.log('Error in id');
    return new Promise((resolve, reject) => {
      resolve(null);
    });
  }
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('genres');
    collection.findOneAndDelete({ _id: new ObjectId(id) }, (error, result) => {
      if (error) {
        console.log(error.message);
        resolve(EMPTY_GENRE);
      }
      resolve(result.value);
    });
  });
}
