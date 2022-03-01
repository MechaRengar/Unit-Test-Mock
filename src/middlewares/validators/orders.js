import { celebrate, Joi } from 'celebrate';
import validatorCustomer from './customers';

const { customerSchemaUpdate, customerSchema } = validatorCustomer;

const statusValid = [
  'On Hold',
  'Shipped',
  'Disputed',
  'Resolved',
  'Cancelled',
];

const schemaOrderDetails = {
  productCode: Joi.string().max(15).optional(),
  quantityOrdered: Joi.number().min(1).required(),
  priceEach: Joi.number().min(1).precision(2).required(),
};

const dateValid = ['asc', 'desc'];
const schema = {
  order: Joi.object({
    orderNumber: Joi.number().min(1).required(),
    requiredDate: Joi.date().min(Date.now()).required(),
    comments: Joi.string().max(4000).allow(null).required(),
  }).required(),
  customerNumber: Joi.number().positive().required(),
  orderDetails: Joi.array().items(schemaOrderDetails).required(),
  update: Joi.object(customerSchemaUpdate).allow(null).optional(),
  create: Joi.object(customerSchema).allow(null).optional(),
};

const schemaId = {
  orderNumber: Joi.number().min(1).required(),
};

const shemaUpdate = {
  status: Joi.string().max(15).valid(...statusValid).optional(),
  requiredDate: Joi.date().min(Date.now()).optional(),
};

const schemaQuery = {
  customerNumber: Joi.number().min(1).required(),
  status: Joi.string().max(15).valid(...statusValid).optional(),
  orderDate: Joi.string().valid(...dateValid).optional(),
  requiredDate: Joi.string().valid(...dateValid).optional(),
  shippedDate: Joi.string().valid(...dateValid).optional(),
  minOrderDate: Joi.string().allow(null).optional(),
  maxOrderDate: Joi.string().allow(null).optional(),
  minRequiredDate: Joi.string().allow(null).optional(),
  maxRequiredDate: Joi.string().allow(null).optional(),
  minShippedDate: Joi.string().allow(null).optional(),
  maxShippedDate: Joi.string().allow(null).optional(),
  page: Joi.number().allow(null).optional(),
  limit: Joi.number().allow(null).optional(),
};

const validateQuery = celebrate(
  {
    params: Joi.object().keys({}),
    query: Joi.object().keys(schemaQuery),
    body: Joi.object().keys({}),
  },
  {
    abortEarly: false,
    convert: true,
    escapeHTML: false,
  },
);

const validateCreate = celebrate(
  {
    params: Joi.object().keys({}),
    query: Joi.object().keys({}),
    body: Joi.object(schema).xor('update', 'create'),
  },
  {
    abortEarly: false,
    convert: true,
    escapeHTML: false,
  },
);
const validateUpdate = celebrate(
  {
    params: Joi.object().keys(schemaId),
    query: Joi.object().keys({}),
    body: Joi.object().keys(shemaUpdate),
  },
  {
    abortEarly: false,
    convert: true,
    escapeHTML: false,
  },
);

export default { validateCreate, validateUpdate, validateQuery };
