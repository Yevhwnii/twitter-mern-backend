require('dotenv').config();

import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));

export { db, mongoose };
