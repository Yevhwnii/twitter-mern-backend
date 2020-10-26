import express from 'express';
require('dotenv').config();

import './core/db';
import { UserCtrl } from './controllers/UserController';
import { AuthCtrl } from './controllers/AuthController';
import { signupValidation } from './validators/signup';
import { passport } from './core/passport';

const app = express();

app.use(express.json());
app.use(passport.initialize());

app.get('/users', UserCtrl.index);
app.get('/users/me', passport.authenticate('jwt'), UserCtrl.getMe);
app.get('/users/:id', UserCtrl.show);
app.post('/users/signup', signupValidation, UserCtrl.create);
app.post('/users', signupValidation, UserCtrl.create);
app.get('/users/verify', signupValidation, UserCtrl.verify);
// app.patch('/users', UserCtrl.update)
// app.delete('/users', UserCtrl.delete)
app.post('/auth/signin', passport.authenticate('local'), AuthCtrl.login);

app.listen(process.env.PORT || 8888, (): void => {
  console.log('Server is running!');
});
