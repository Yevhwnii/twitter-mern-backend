require('dotenv').config();

import express from 'express';
import { validationResult } from 'express-validator';

import { UserModel } from '../models/User';
import { generateMD5 } from '../utils/generateHash';
import { sendEmail } from '../utils/sendEmail';

class UserController {
  async index(_: any, res: express.Response): Promise<void> {
    try {
      const users = await UserModel.find({}).exec();
      res.json({
        status: 'success',
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: JSON.stringify(error),
      });
    }
  }

  async create(req: express.Request, res: express.Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ status: 'error', errors: errors.array() });
        return;
      }

      const userData = {
        email: req.body.email,
        fullname: req.body.fullname,
        username: req.body.username,
        password: req.body.password,
        confirmHash: generateMD5(
          process.env.SECRET_KEY || Math.random().toString()
        ),
      };

      const user = await UserModel.create(userData);

      await user.save();

      sendEmail(
        {
          emailTo: userData.email,
          subject: 'Email confirmation from Twitter clone',
          html: `In order to confirm this email, click on <a href="http://localhost:${
            process.env.PORT || 8888
          }/users/verify?hash=${userData.confirmHash}"> this link </a>`,
        },
        (err: Error | null) => {
          if (err) {
            res.status(400).json({
              status: 'error',
              message: err,
            });
          } else {
            res.status(201).json({
              status: 'success',
              data: user,
            });
          }
        }
      );
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error,
      });
    }
  }

  async verify(req: any, res: express.Response): Promise<void> {
    const hash = req.query.hash;
    if (!hash) {
      res.status(400).send();
    }

    const user = await UserModel.findOne({ confirmHash: hash }).exec();

    if (user) {
      user.confirmed = true;
      await user.save();
    } else {
      res.status(404).json({ status: 'error', message: 'Hash is not valid' });
    }

    res.json({
      status: 'success',
    });
  }
}

export const UserCtrl = new UserController();
