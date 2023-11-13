import * as Joi from 'joi'
import { Card } from '../../model/card.model'

export const CardSchema = Joi.object<Card>({
  card_number: Joi.string()
    .min(13)
    .max(16)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      'string.base': `card_number should be a type of string`,
      'string.empty': `card_number cannot be an empty field`,
      'any.required': `card_number is a required field`,
      'string.min':
        'card_number length must be at least {{#limit}} characters long',
      'string.max':
        'card_number length must be less than or equal to {{#limit}} characters long',
      'string.pattern.base':
        'card_number must contains number from 0 to 9',
    }),
  cvv: Joi.string()
    .min(3)
    .max(4)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      'string.base': `cvv should be a type of string`,
      'string.empty': `cvv cannot be an empty field`,
      'any.required': `cvv is a required field`,
      'string.min':
        'cvv length must be at least {{#limit}} characters long',
      'string.max':
        'cvv length must be less than or equal to {{#limit}} characters long',
      'string.pattern.base': 'cvv must contains number from 0 to 9',
    }),
  expiration_month: Joi.string()
    .min(1)
    .max(2)
    .regex(/^([1-9]|0[1-9]|1[0-2])$/)
    .required()
    .messages({
      'string.base': `expiration_month should be a type of string`,
      'string.empty': `expiration_month cannot be an empty field`,
      'any.required': `expiration_month is a required field`,
      'string.min':
        'expiration_month must be greater than or equal to {{#limit}}',
      'string.max':
        'expiration_month must be less than or equal to {{#limit}}',
      'string.pattern.base':
        'expiration_month must contains number from 1 to 12',
    }),
  expiration_year: Joi.string()
    .min(4)
    .max(4)
    .pattern(/^202[3-8]$/)
    .required()
    .messages({
      'number.base': `expiration_year should be a type of string`,
      'string.empty': `expiration_year cannot be an empty field`,
      'any.required': `expiration_year is a required field`,
      'string.min':
        'expiration_year must be greater than or equal to {{#limit}}',
      'string.max':
        'expiration_year must be less than or equal to {{#limit}}',
      'string.pattern.base':
        'expiration_year must contain a year from 2023 to 2028',
    }),
  email: Joi.string()
    .email()
    .regex(/^[a-zA-Z0-9_.+-]+@(gmail.com|hotmail.com|yahoo.es)$/)
    .required()
    .messages({
      'string.base': `email should be a type of string`,
      'string.empty': `email cannot be an empty field`,
      'string.email': `email must be a valid email`,
      'any.required': `email is a required field`,
      'string.pattern.base':
        'email must have a gmail.com or hotmail.com or yahoo.es domain',
    }),
}).meta({ className: 'Card' })
