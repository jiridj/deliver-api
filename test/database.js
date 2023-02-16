const mongoose = require('mongoose');
const dbserver = require('mongodb-memory-server').MongoMemoryServer;

mongoose.set('strictQuery', false);

let mongo = null;

const setUp = async () => {
  mongo = await dbserver.create();
  await mongoose.connect(mongo.getUri());
};

const dropDb = async () => {
  if (mongo) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
  }
};

const dropCollections = async () => {
  if (mongo) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
};

module.exports = { setUp, dropDb, dropCollections };
