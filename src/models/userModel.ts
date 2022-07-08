import { IUser } from '../interfaces';
import { getCollectionByName } from '../db';
import { ObjectId } from 'mongodb';

export function findAllUsersDb() {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('users');
    resolve(collection.find({}).toArray());
  });
}

export function findUserByIdDb(userId: string) {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('users');

    collection.findOne({ _id: new ObjectId(userId) }, (error, user) => {
      if (error) {
        console.log(error);
        resolve(null);
      }
      console.log(user);
      resolve(user);
    });
  });
}

export function createUserDb(username: string) {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('users');
    const newUser = {
      username,
    };
    collection.insertOne(newUser, (error) => {
      if (error) {
        console.log(error);
        resolve(null);
      }
    });
    resolve(newUser);
  });
}

export async function updateUserDb(userId: string, username: string) {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('users');
    if (username) {
      collection.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: { username: username } },
        { returnDocument: 'after' },
        (err, result) => {
          if (err) {
            console.log(err);
            resolve(null);
          }
          const user = result.value;
          resolve(user);
        }
      );
    }
  });
}

export function removeUserDb(userId: string) {
  return new Promise((resolve, reject) => {
    const collection = getCollectionByName('users');

    collection.findOneAndDelete(
      { _id: new ObjectId(userId) },
      (error, result) => {
        if (error) {
          console.log(error);
          resolve(null);
        }
        const user = result.value;
        resolve(user);
      }
    );
  });
}
