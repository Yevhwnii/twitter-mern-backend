import mongoose, { Schema, Document } from 'mongoose';

export interface ITweet extends Document {
  text: string;
  user: string;
}

export interface ITweet_raw {
  _id?: string;
  text: string;
  user: string;
}

const TweetSchema: Schema = new Schema(
  {
    text: { type: String, required: true, maxlength: 280 },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const TweetModel = mongoose.model<ITweet>('Tweet', TweetSchema);
