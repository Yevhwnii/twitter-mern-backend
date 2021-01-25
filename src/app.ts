require('dotenv').config();
import express from 'express';

import './core/db';
import { UserCtrl } from './controllers/UserController';
import { AuthCtrl } from './controllers/AuthController';
import { signupValidation } from './validators/signup';
import { passport } from './core/passport';
import { createTweetValidation } from './validators/createTweet';
import { TweetsCtrl } from './controllers/TweetsController';

const app = express();

// Initialization
app.use(express.json());
app.use(passport.initialize());

// User routes
app.get('/users', UserCtrl.index);
app.get(
  '/users/me',
  passport.authenticate('jwt', { session: false }),
  UserCtrl.getMe
);
app.get('/users/verify', UserCtrl.verify);
app.get('/users/:id', UserCtrl.show);
app.post('/users/signup', signupValidation, UserCtrl.create);
app.post('/users', signupValidation, UserCtrl.create);
// app.patch('/users', UserCtrl.update)
// app.delete('/users', UserCtrl.delete)

// Auth routes
app.post('/auth/signin', passport.authenticate('local'), AuthCtrl.login);

// Tweet routes
app.get('/tweets', TweetsCtrl.index);
app.get('/tweets/:id', TweetsCtrl.show);
app.delete('/tweets/:id', passport.authenticate('jwt'), TweetsCtrl.delete);
app.patch(
  '/tweets/:id',
  passport.authenticate('jwt'),
  createTweetValidation,
  TweetsCtrl.update
);
app.post(
  '/tweets',
  passport.authenticate('jwt'),
  createTweetValidation,
  TweetsCtrl.create
);

app.listen(process.env.PORT || 8888, (): void => {
  console.log('Server is running!');
});
