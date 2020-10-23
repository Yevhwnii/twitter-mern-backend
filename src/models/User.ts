import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  email: {
    unique: true,
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  username: {
    unique: true,
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmed_hash: {
    type: String,
    required: true,
  },
  location: String,
  confirmed: Boolean,
  about: String,
  website: String,
});

export const UserModel = mongoose.model('User', UserSchema);
