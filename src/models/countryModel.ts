import { ICountry } from '../tools/interfaces';
import { getCollectionByName } from '../db';
import { resolve } from 'path';
import { ObjectId } from 'mongodb';
import { EMPTY_COUNTRY } from '../tools/const';

export function findAllCountriesDb() {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('countries');
    resolve(collection.find({}).toArray());
  });
}

export function findCountryByIdDb(id: string): Promise<ICountry | null> {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('countries');
    collection.findOne({ _id: new ObjectId(id) }, (error, item) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(item as unknown as ICountry);
    });
  });
}

export function findCountryByNameDb(name: string): Promise<ICountry> {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('countries');
    collection.findOne({ name: name }, (error, item) => {
      if (error) {
        console.log(error.message);
        resolve(EMPTY_COUNTRY);
      }
      resolve(item as unknown as ICountry);
    });
  });
}

export function createCountryDb(name: string): Promise<ICountry> {
  return new Promise((resolve, reject) => {
    const newCountry = {
      name: name,
    };
    const collection = getCollectionByName('countries');
    collection.insertOne(newCountry, (error) => {
      if (error) {
        console.log(error.message);
        resolve(EMPTY_COUNTRY);
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

export function removeCountryDb(id: string) {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('countries');
    collection.findOneAndDelete({ _id: new ObjectId(id) }, (error, result) => {
      if (error) {
        console.log(error.message);
        resolve(null);
      }
      resolve(result.value);
    });
  });
}
