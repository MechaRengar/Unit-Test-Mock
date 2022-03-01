import { celebrate, Joi } from 'celebrate';

const schema = {
  productCode: Joi.string().max(15).optional(),
  productName: Joi.string().max(70).required(),
  productLine: Joi.string().max(50).required(),
  productScale: Joi.string().max(10).required(),
  productVendor: Joi.string().max(50).required(),
  productDescription: Joi.string().max(4000).required(),
  quantityInStock: Joi.number().positive().required(),
  buyPrice: Joi.number().precision(2).required(),
  MSRP: Joi.number().precision(2).required(),
};

const schemaId = {
  productCode: Joi.string().max(15).required(),
};

const shemaUpdate = {
  productCode: Joi.string().max(15).optional(),
  productName: Joi.string().max(70).optional(),
  productLine: Joi.string().max(50).optional(),
  productScale: Joi.string().max(10).optional(),
  productVendor: Joi.string().max(50).optional(),
  productDescription: Joi.string().max(4000).optional(),
  quantityInStock: Joi.number().positive().optional(),
  buyPrice: Joi.number().precision(2).optional(),
  MSRP: Joi.number().precision(2).optional(),
};

const productValidate = celebrate(
  {
    params: Joi.object().keys({}),
    query: Joi.object().keys({}),
    body: Joi.object().keys(schema),
  },
  {
    abortEarly: false,
    convert: true,
    escapeHTML: false,
  },
);
const productUpdateValidate = celebrate(
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

export { productValidate, productUpdateValidate };
