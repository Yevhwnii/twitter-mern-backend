import { body } from 'express-validator';

export const signupValidation = [
  // Email validator
  body('email', 'Provide email')
    .isEmail()
    .withMessage('Invalid email')
    .isLength({ min: 12, max: 40 })
    .withMessage('Email should be at least 12 characters'),
  // Fullname validator
  body('fullname', 'Provide name')
    .isString()
    .isLength({ min: 2, max: 40 })
    .withMessage('Full name should be at least 2 characters'),
  // Username validator
  body('username', 'Provide username')
    .isString()
    .isLength({ min: 2, max: 40 })
    .withMessage('Full name should be at least 2 characters'),
  // Password validator
  body('password', 'Provide password')
    .isString()
    .isLength({ min: 6, max: 40 })
    .withMessage('Password should consist of at least 6 characters')
    .custom((value, { req }) => {
      if (value !== req.body.password2) {
        throw new Error('Passwords don`t match');
      } else {
        return value;
      }
    }),
];
