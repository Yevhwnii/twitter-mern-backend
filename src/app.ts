import express from 'express';
require('dotenv').config();

import './core/db';
import { UserCtrl } from './controllers/UserController';
import { signupValidation } from './validators/signup';

const app = express();

app.use(express.json());

app.get('/users', UserCtrl.index);
app.post('/users', signupValidation, UserCtrl.create);
app.get('/users/verify', signupValidation, UserCtrl.verify);
// app.patch('/users', UserCtrl.update)
// app.delete('/users', UserCtrl.delete)

app.listen(process.env.PORT || 8888, (): void => {
  console.log('Server is running!');
});
