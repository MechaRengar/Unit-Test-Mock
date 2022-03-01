import { celebrate, Joi } from 'celebrate';
import customers from './customers';

const { customerSchema } = customers;

const schema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string()
    .min(6)
    .max(100)
    .pattern(/(?=.*[0-9])(?=.*[@#$%^&*?-_/><;:'",\\|.])/)
    .required(),
  customer: Joi.object(customerSchema),
  customerNumber: Joi.number().integer().min(1),
  employeeNumber: Joi.number().integer().min(1),
}).xor('customerNumber', 'employeeNumber', 'customer');

const schemaLogin = {
  username: Joi.string().required(),
  password: Joi.string().required(),
};

const vaidateRegister = celebrate(
  {
    params: Joi.object().keys({}),
    query: Joi.object().keys({}),
    body: schema,
  },
  {
    abortEarly: false,
    convert: false,
    escapeHTML: false,
  },
);

const vaidateLogin = celebrate(
  {
    params: Joi.object().keys({}),
    query: Joi.object().keys({}),
    body: Joi.object().keys(schemaLogin),
  },
  {
    abortEarly: false,
    convert: false,
    escapeHTML: false,
  },
);

export default { vaidateRegister, vaidateLogin };
