const Ajv = require('ajv');

const ajv = new Ajv();

const products = [
  {
    productCode: 'productCode',
    productName: 'productName',
    productLine: 'productLine',
    productScale: 'productScale',
    productVendor: 'productVendor',
    productDescription: 'productDescription',
    quantityInStock: 7933,
    buyPrice: 15.91,
    MSRP: 35.36,
  },
  {
    productCode: 'productCode',
    productName: 'productName',
    productLine: 'productLine',
    productScale: 'productScale',
    productVendor: 'productVendor',
    productDescription: 'productDescription',
    quantityInStock: 7933,
    buyPrice: 15.91,
    MSRP: 35.36,
  },
];

const product = {
  productCode: 4,
  productName: 'productName',
  productLine: 'productLine',
  productScale: 'productScale',
  productVendor: 'productVendor',
  productDescription: 'productDescription',
  quantityInStock: 7933,
  buyPrice: 15.91,
  MSRP: 35.36,
};

const { productCode, ...body } = product;

const jsonSchemaValidation = {
  type: 'object',
  required: [
    'productCode',
    'productName',
    'productLine',
    'productScale',
    'productVendor',
    'productDescription',
    'quantityInStock',
    'buyPrice',
    'MSRP',
  ],

  properties: {
    productCode: { type: 'string', maxLength: 15 },
    productName: { type: 'string', maxLength: 70 },
    productLine: { type: 'string', maxLength: 50 },
    productScale: { type: 'string', maxLength: 10 },
    productVendor: { type: ['string', 'null'], maxLength: 50 },
    productDescription: { type: 'string' },
    quantityInStock: { type: 'integer' },
    buyPricepostalCode: {
      type: 'number',
      minimum: 0,
      maximum: 10000000000,
    },
    MSRP: {
      type: 'number',
      minimum: 0,
      maximum: 10000000000,
    },
  },
};

const productSchema = {
  type: 'object',
  properties: {
    productCode: { type: 'string' },
    productName: { type: 'string' },
    productLine: { type: 'string' },
    productScale: { type: 'string' },
    productVendor: { type: ['string', 'null'] },
    productDescription: { type: 'string' },
    quantityInStock: { type: 'integer' },
    buyPricepostalCode: {
      type: 'number',
    },
    MSRP: {
      type: 'number',
    },
  },
  required: [
    'productCode',
    'productName',
    'productLine',
    'productScale',
    'productDescription',
    'quantityInStock',
    'buyPrice',
    'MSRP',
  ],
  additionalProperties: false,
};

const validate = ajv.compile(productSchema);

let req;

req = {
  params: {
    productCode: 'productCode',
  },
  body: {
    productCode: 'productCode',
    productName: 'productName',
    productLine: 'productLine',
    productScale: 'productScale',
    productVendor: 'productVendor',
    productDescription: 'productDescription',
    quantityInStock: 7933,
    buyPrice: 15.91,
    MSRP: 35.36,
  },
  query: {
    page: 1,
    limit: 10,
    productLine: 'productLine',
    productScale: 'productScale',
    productVendor: 'productVendor',
  },
};

let res;

res = {
  locals: {
    auth: {
      role: 2,
      officeCode: 'officeCode',
      username: 'username',
      employeeNumber: 4,
    },
  },
  status: code => ({
    json: data => ({
      status: code,
      data,
    }),
    send: message => ({
      message,
    }),
  }),
};
const next = () => 'allow next';

export {
  products,
  product,
  validate,
  jsonSchemaValidation,
  body,
  req,
  res,
  next,
};
