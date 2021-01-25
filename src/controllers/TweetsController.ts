require('dotenv').config();
import express from 'express';
import { validationResult } from 'express-validator';

import { ITweet, ITweet_raw, TweetModel } from '../models/Tweet';
import { IUser } from '../models/User';
import { isValidObjectId } from '../utils/isValidObjectId';

class TweetsController {
  async index(_: any, res: express.Response): Promise<void> {
    try {
      const tweets = await TweetModel.find({})
        .populate('user')
        .sort({ createdAt: 'desc' })
        .exec();
      res.json({
        status: 'success',
        data: tweets,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }

  async show(req: any, res: express.Response): Promise<void> {
    try {
      const tweetId = req.params.id;
      if (!isValidObjectId(tweetId)) {
        throw new Error('Id is not valid (must be objectId)');
      }
      // prettier-ignore
      const tweet = await TweetModel.findById(tweetId)
        .populate('user')
        .exec();
      if (tweet) {
        res.json({
          status: 'success',
          data: tweet,
        });
      } else {
        throw new Error('Tweet does not exist');
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  async create(req: express.Request, res: express.Response): Promise<void> {
    try {
      const user = req.user as IUser;
      if (user) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json({ status: 'error', errors: errors.array() });
          return;
        }

        const tweetDetails: ITweet_raw = {
          text: req.body.text,
          user: user._id,
        };

        const tweet = await TweetModel.create(tweetDetails);
        res.json({
          status: 'success',
          data: await tweet.populate('user').execPopulate(),
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  async delete(req: express.Request, res: express.Response): Promise<void> {
    const user = req.user as IUser;

    try {
      if (user) {
        const tweetId = req.params.id;

        if (!isValidObjectId(tweetId)) {
          throw new Error('Id is not valid (must be objectId)');
        }

        const tweet = await TweetModel.findById(tweetId);

        if (tweet && tweet.user.toString() === user._id.toString()) {
          tweet.remove();
          res.send();
        } else {
          res.status(404).send();
        }
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  async update(req: express.Request, res: express.Response): Promise<void> {
    const user = req.user as IUser;

    try {
      if (user) {
        const tweetId = req.params.id;

        if (!isValidObjectId(tweetId)) {
          throw new Error('Id is not valid (must be objectId)');
        }

        const tweet = await TweetModel.findById(tweetId);

        if (tweet && tweet.user.toString() === user._id.toString()) {
          const text = req.body.text;
          tweet.text = text;
          await tweet.save();
          res.json({
            status: 'success',
            data: tweet,
          });
        } else {
          res.status(404).send();
        }
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }
}

export const TweetsCtrl = new TweetsController();
