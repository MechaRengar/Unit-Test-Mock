import { celebrate, Joi } from 'celebrate';

const customerSchema = {
  customerNumber: Joi.number().positive().required(),
  customerName: Joi.string().min(5).max(50).required(),
  contactLastName: Joi.string().min(3).max(50).required(),
  contactFirstName: Joi.string().min(3).max(50).required(),
  phone: Joi.string().min(8).max(20).required(),
  addressLine1: Joi.string().min(10).max(50).required(),
  addressLine2: Joi.string().min(3).max(50).allow(null)
    .optional(),
  city: Joi.string().min(2).max(50).required(),
  state: Joi.string().min(2).max(50).allow(null)
    .optional(),
  postalCode: Joi.string().min(5).max(15).allow(null)
    .optional(),
  country: Joi.string().min(2).max(50).required(),
  salesRepEmployeeNumber: Joi.number().positive().allow(null).required(),
  creditLimit: Joi.number().precision(2).allow(null).optional(),
};

const validateCustomer = celebrate(
  {
    params: Joi.object().keys({}),
    query: Joi.object().keys({}),
    body: Joi.object().keys(customerSchema),
  },
  {
    abortEarly: false,
    convert: false,
    presence: 'required',
    escapeHtml: true,
  },
);

const customerSchemaUpdate = {
  customerName: Joi.string().min(5).max(50).optional(),
  contactLastName: Joi.string().min(3).max(50).optional(),
  contactFirstName: Joi.string().min(3).max(50).optional(),
  phone: Joi.string().min(8).max(20).optional(),
  addressLine1: Joi.string().min(10).max(50).optional(),
  addressLine2: Joi.string().max(50).allow(null).optional(),
  city: Joi.string().min(2).max(50).optional(),
  state: Joi.string().min(2).max(50).allow(null)
    .optional(),
  postalCode: Joi.string().min(5).max(15).allow(null)
    .optional(),
  country: Joi.string().min(2).max(50).optional(),
  salesRepEmployeeNumber: Joi.number().positive().allow(null).optional(),
  creditLimit: Joi.number().precision(2).allow(null).optional(),
};

const schemaNumber = {
  customerNumber: Joi.number().positive().required(),
};

const validateCustomerUpdate = celebrate(
  {
    params: Joi.object().keys(schemaNumber),
    query: Joi.object().keys({}),
    body: Joi.object().keys(customerSchemaUpdate),
  },
  {
    abortEarly: false,
    convert: true,
    escapeHtml: true,
  },
);
export default {
  validateCustomer,
  validateCustomerUpdate,
  customerSchema,
  customerSchemaUpdate,
};
