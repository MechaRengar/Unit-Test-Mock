import { celebrate, Joi } from 'celebrate';

const productLineSchema = {
  productLine: Joi.string().max(50).required(),
  textDescription: Joi.string().max(4000).required(),
  htmlDescription: Joi.string().max(20).allow(null).optional(),
  image: Joi.string().max(20).allow(null).optional(),
};

const schemaId = {
  productLine: Joi.string().max(50).required(),
};

const ProductLineUpdateSchema = {
  productLine: Joi.string().max(50).optional(),
  textDescription: Joi.string().max(4000).optional(),
  htmlDescription: Joi.string().max(20).allow(null).optional(),
  image: Joi.string().max(20).allow(null).optional(),
};

const validateProductLine = celebrate(
  {
    params: Joi.object().keys({}),
    query: Joi.object().keys({}),
    body: Joi.object().keys(productLineSchema),
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
    body: Joi.object().keys(ProductLineUpdateSchema),
  },
  {
    abortEarly: false,
    convert: false,
    escapeHTML: false,
  },
);

export default { validateProductLine, validateUpdate };
