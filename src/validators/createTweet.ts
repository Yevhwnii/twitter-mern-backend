import { body } from 'express-validator';

export const createTweetValidation = [
  // Text validator
  body('text', 'Provide tweet`s text')
    .isString()
    .withMessage('Text should be string')
    .isLength({ min: 1, max: 280 })
    .withMessage(
      'Text should not be empty and should not exceed 280 characters length'
    ),
];
