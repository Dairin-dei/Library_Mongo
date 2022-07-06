import { MongoClient } from 'mongodb';

type TCallback = (a: Error) => void;

const client = new MongoClient(
  'mongodb+srv://user:user@usersapi.6kx7kln.mongodb.net/?retryWrites=true&w=majority'
);

export const setMongoConnection = async (callback: TCallback) => {
  try {
    await client.connect();
    console.log('Database connected');
    client
      .db()
      .listCollections({ name: 'users' })
      .next(async (err, isCollectionExists) => {
        if (err) {
          console.log(err.message);
        } else if (!isCollectionExists) {
          await client.db().createCollection('users');
        }
        if (!err) {
          console.log('Collection "users" is accessed');
        }
      });
    client
      .db()
      .listCollections({ name: 'countries' })
      .next(async (err, isCollectionExists) => {
        if (err) {
          console.log(err.message);
        } else if (!isCollectionExists) {
          await client.db().createCollection('countries');
        }
        if (!err) {
          console.log('Collection "countries" is accessed');
        }
      });
    client
      .db()
      .listCollections({ name: 'genres' })
      .next(async (err, isCollectionExists) => {
        if (err) {
          console.log(err.message);
        } else if (!isCollectionExists) {
          await client.db().createCollection('genres');
        }
        if (!err) {
          console.log('Collection "genres" is accessed');
        }
      });
    client
      .db()
      .listCollections({ name: 'languages' })
      .next(async (err, isCollectionExists) => {
        if (err) {
          console.log(err.message);
        } else if (!isCollectionExists) {
          await client.db().createCollection('languages');
        }
        if (!err) {
          console.log('Collection "languages" is accessed');
        }
      });
    client
      .db()
      .listCollections({ name: 'authors' })
      .next(async (err, isCollectionExists) => {
        if (err) {
          console.log(err.message);
        } else if (!isCollectionExists) {
          await client.db().createCollection('genres');
        }
        if (!err) {
          console.log('Collection "genres" is accessed');
        }
      });
    client
      .db()
      .listCollections({ name: 'books' })
      .next(async (err, isCollectionExists) => {
        if (err) {
          console.log(err.message);
        } else if (!isCollectionExists) {
          await client.db().createCollection('books');
        }
        if (!err) {
          console.log('Collection "books" is accessed');
        }
      });
    client
      .db()
      .listCollections({ name: 'volumes' })
      .next(async (err, isCollectionExists) => {
        if (err) {
          console.log(err.message);
        } else if (!isCollectionExists) {
          await client.db().createCollection('volumes');
        }
        if (!err) {
          console.log('Collection "books" is accessed');
        }
      });
  } catch (error) {
    console.log(error);
    return callback(error);
  }
};

export const getCollectionUsers = () => {
  return client.db().collection('users');
};
