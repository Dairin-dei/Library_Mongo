//import { Collection, WithId } from 'mongodb';
//import { v4 as uuid } from 'uuid';
import { IUser } from '../interfaces';
import { getCollectionUsers } from '../db';
import { ObjectId } from 'mongodb';

//const USERS: Array<IUser> = [];

export function findAllUsersInDataBase() {
  return new Promise((resolve, reject) => {
    //resolve(USERS);
    const collection = getCollectionUsers();
    resolve(collection.find({}).toArray());
  });
}

export function findUserByIdInDataBase(userId: string) {
  return new Promise((resolve, reject) => {
    const collection = getCollectionUsers();

    collection.findOne({ _id: new ObjectId(userId) }, (error, user) => {
      if (error) {
        return console.log(error);
      }
      console.log(user);
      resolve(user);
    });
  });
}

export function createNewUserInDatabase(
  username: string
  //age: string,
  //hobbies: string[]
) {
  return new Promise((resolve, reject) => {
    const collection = getCollectionUsers();
    const newUser: IUser = {
      //id: uuid(),
      username,
      // age: Number(age),
      //  hobbies,
    };
    collection.insertOne(newUser, (error) => {
      if (error) {
        return console.log(error);
      }
    });
    resolve(newUser);
  });
}

export async function updateUserInDatabase(
  userId: string,
  username: string
  // age: string,
  // hobbies: string[]
) {
  return new Promise((resolve, reject) => {
    const collection = getCollectionUsers();
    if (username) {
      collection.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: { username: username } },
        { returnDocument: 'after' },
        (err, result) => {
          if (err) {
            return console.log(err);
          }
          const user = result.value;
          resolve(user);
        }
      );
    }
  });
}

export function removeUserFromDatabase(userId: string) {
  return new Promise((resolve, reject) => {
    const collection = getCollectionUsers();

    collection.findOneAndDelete(
      { _id: new ObjectId(userId) },
      (error, result) => {
        if (error) {
          return console.log(error);
        }
        const user = result.value;
        resolve(user);
      }
    );
  });
}
