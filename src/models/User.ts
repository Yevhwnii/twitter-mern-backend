import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  id?: string;
  email: string;
  fullname: string;
  username: string;
  password: string;
  confirmHash: string;
  confirmed?: boolean;
  location?: string;
  about?: string;
  website?: string;
}

const UserSchema: Schema = new Schema(
  {
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
    confirmHash: {
      type: String,
      required: true,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    location: String,
    about: String,
    website: String,
  },
  { timestamps: true }
);

UserSchema.set('toJSON', {
  transform: function (_, obj) {
    delete obj.password;
    delete obj.confirmHash;
    return obj;
  },
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);
