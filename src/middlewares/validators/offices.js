import { celebrate, Joi } from 'celebrate';

const officeSchema = {
  officeCode: Joi.string().max(10).required(),
  city: Joi.string().max(50).required(),
  phone: Joi.string().max(50).required(),
  addressLine1: Joi.string().max(50).required(),
  addressLine2: Joi.string().max(20).allow(null).optional(),
  state: Joi.string().max(50).allow(null).optional(),
  country: Joi.string().max(50).required(),
  postalCode: Joi.string().max(15).required(),
  territory: Joi.string().max(10).required(),
};

const schemaId = {
  officeCode: Joi.string().max(15).required(),
};

const officeUpdateSchema = {
  city: Joi.string().max(50).optional(),
  phone: Joi.string().max(50).optional(),
  addressLine1: Joi.string().max(50).optional(),
  addressLine2: Joi.string().max(20).allow(null).optional(),
  state: Joi.string().max(50).allow(null).optional(),
  country: Joi.string().max(50).optional(),
  postalCode: Joi.string().max(15).optional(),
  territory: Joi.string().max(10).optional(),
};

const validateOffice = celebrate(
  {
    params: Joi.object().keys({}),
    query: Joi.object().keys({}),
    body: Joi.object().keys(officeSchema),
  },
  {
    abortEarly: false,
    convert: false,
    escapeHTML: false,
  },
);

const validateUpdate = celebrate(
  {
    params: Joi.object().keys(schemaId),
    query: Joi.object().keys({}),
    body: Joi.object().keys(officeUpdateSchema),
  },
  {
    abortEarly: false,
    convert: false,
    escapeHTML: false,
  },
);

export default { validateOffice, validateUpdate };
