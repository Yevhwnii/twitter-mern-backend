import express from 'express';
import jwt from 'jsonwebtoken';

class AuthController {
  async login(req: any, res: express.Response): Promise<void> {
    const user = req.user.toObject();

    res.json({
      status: 'success',
      data: {
        ...user,
        token: jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '30d' }),
      },
    });
  }
}

export const AuthCtrl = new AuthController();
