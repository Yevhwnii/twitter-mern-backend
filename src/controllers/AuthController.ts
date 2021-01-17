import express from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

class AuthController {
  async login(req: express.Request, res: express.Response): Promise<void> {
    try {
      const user = req.user ? (req.user as IUser).toJSON() : undefined;

      res.json({
        status: 'success',
        data: {
          ...user,
          token: jwt.sign({ data: req.user }, process.env.JWT_SECRET, {
            expiresIn: '30 days',
          }),
        },
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }
}

export const AuthCtrl = new AuthController();
