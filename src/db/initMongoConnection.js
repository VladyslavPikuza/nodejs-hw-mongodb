require('dotenv').config();

const mongoose = require('mongoose');

const initMongoConnection = async () => {
  try {
    const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;
    console.log('MongoDB User:', MONGODB_USER);
    console.log('MongoDB Password:', MONGODB_PASSWORD);
    console.log('MongoDB URL:', MONGODB_URL);
    console.log('MongoDB DB:', MONGODB_DB);

    const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority&appName=Cluster0`;
    await mongoose.connect(uri);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = { initMongoConnection };
