import { IVolume } from '../tools/interfaces';
import { getCollectionByName } from '../db';
import { ObjectId } from 'mongodb';

export function findAllVolumesDb() {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('volumes');
    resolve(collection.find({}).toArray());
  });
}

export function findVolumeByIdDb(id: string): Promise<IVolume> {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('volumes');
    collection.findOne({ _id: new ObjectId(id) }, (error, item) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(item as unknown as IVolume);
    });
  });
}

export function findVolumeByNameDb(name: string): Promise<IVolume | null> {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('volumes');
    collection.findOne({ name: name }, (error, item) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(item as unknown as IVolume);
    });
  });
}

export function createVolumeDb(
  name: string,
  cabinet = 0,
  shelf = 0,
  picture = '',
  year = 0
): Promise<IVolume | null> {
  return new Promise((resolve, reject) => {
    const newVolume = {
      name: name,
      cabinet: cabinet,
      shelf: shelf,
      picture: picture,
      year: year,
    };
    const collection = getCollectionByName('volumes');
    collection.insertOne(newVolume, (error) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(newVolume);
    });
  });
}

export async function updateVolumeDb(
  id: string,
  name = '',
  cabinet = 0,
  shelf = 0,
  picture = '',
  year = 1
) {
  const currentVolume: IVolume = await findVolumeByIdDb(id);
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('volumes');
    if (name || cabinet || shelf || picture || year) {
      collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
          $set: {
            name: name || currentVolume.name,
            cabinet: cabinet || currentVolume.cabinet,
            shelf: shelf || currentVolume.shelf,
            picture: picture || currentVolume.picture,
            year: year || currentVolume.year,
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
    const collection = getCollectionByName('volumes');
    collection.findOneAndDelete({ _id: new ObjectId(id) }, (error, result) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(result.value);
    });
  });
}
