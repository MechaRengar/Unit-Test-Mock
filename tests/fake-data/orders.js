import Ajv from 'ajv';

const ajv = new Ajv();
const schema = {
  type: 'object',
  required: [
    'orderNumber',
    'orderDate',
    'requiredDate',
    'status',
    'comments',
    'customerNumber',
  ],
  properties: {
    orderNumber: { type: 'integer' },
    orderDate: { type: 'string' },
    requiredDate: { type: 'string' },
    shippedDate: { type: ['string', 'null'] },
    status: {
      type: 'string',
      enum: [
        'On Hold',
        'In Process',
        'Shipped',
        'Disputed',
        'Resolved',
        'Cancelled',
      ],
    },
    comments: {
      type: ['string', 'null'],
      maxLength: 4000,
    },
    customerNumber: { type: 'integer' },
  },
};
const validate = ajv.compile(schema);

const schemaOrders = {
  type: 'array',
  items: {
    type: 'object',
    required: [
      'orderNumber',
      'orderDate',
      'requiredDate',
      'shippedDate',
      'status',
      'comments',
      'customerNumber',
    ],
    properties: {
      orderNumber: { type: 'integer' },
      orderDate: { type: 'string' },
      requiredDate: { type: 'string' },
      shippedDate: { type: ['string', 'null'] },
      status: {
        type: 'string',
        enum: [
          'On Hold',
          'In Process',
          'Shipped',
          'Disputed',
          'Resolved',
          'Cancelled',
        ],
      },
      comments: {
        type: ['string', 'null'],
        maxLength: 4000,
      },
      customerNumber: { type: 'integer' },
    },
  },
};

const validateOrders = ajv.compile(schemaOrders);

const orders = [
  {
    orderNumber: 10123,
    orderDate: '2003-05-19T17:00:00.000Z',
    requiredDate: '2003-05-28T17:00:00.000Z',
    shippedDate: '2003-05-21T17:00:00.000Z',
    status: 'Shipped',
    comments: null,
    customerNumber: 103,
  },
  {
    orderNumber: 10298,
    orderDate: '2004-09-26T17:00:00.000Z',
    requiredDate: '2004-10-04T17:00:00.000Z',
    shippedDate: '2004-09-30T17:00:00.000Z',
    status: 'Shipped',
    comments: null,
    customerNumber: 103,
  },
  {
    orderNumber: 10345,
    orderDate: '2004-11-24T17:00:00.000Z',
    requiredDate: '2004-11-30T17:00:00.000Z',
    shippedDate: '2004-11-25T17:00:00.000Z',
    status: 'Shipped',
    comments: null,
    customerNumber: 103,
  },
];

const order = {
  orderNumber: 10431,
  orderDate: '2021-12-24T17:00:00.000Z',
  requiredDate: '2021-12-29T17:00:00.000Z',
  shippedDate: null,
  status: 'In Process',
  comments: 'Hi there',
  customerNumber: 103,
  orderdetails: [
    {
      orderNumber: 10431,
      productCode: 'S10_1678',
      quantityOrdered: 50,
      priceEach: 48.81,
      orderLineNumber: 1,
    },
    {
      orderNumber: 10431,
      productCode: 'S18_2957',
      quantityOrdered: 42,
      priceEach: 59.34,
      orderLineNumber: 2,
    },
  ],
};

const dataCreate = {
  order: {
    orderNumber: 10427,
    requiredDate: '2021-12-30',
    comments: 'Hi there',
    customerNumber: 103,
    orderDate: '2021-12-25',
  },
  orderDetails: [
    {
      productCode: 'S10_1678',
      quantityOrdered: 50,
      priceEach: 48.81,
      orderNumber: 10427,
      orderLineNumber: 1,
    },
    {
      productCode: 'S18_2957',
      quantityOrdered: 42,
      priceEach: 59.34,
      orderNumber: 10427,
      orderLineNumber: 2,
    },
  ],
};

const resultCreateOrder = {
  status: 'success',
  message: '1 order and 2 order details have been created!',
};

const resultCreateOrderDt = {
  status: 'success',
  message: '2 order details have been created!',
};

const reqBodyUpdate = {
  order: {
    orderNumber: 10427,
    requiredDate: '2021-12-30T17:00:00.000Z',
    comments: 'Hi there',
  },
  orderDetails: [
    {
      productCode: 'S10_1678',
      quantityOrdered: 50,
      priceEach: 48.81,
    },
    {
      productCode: 'S18_2957',
      quantityOrdered: 42,
      priceEach: 59.34,
    },
  ],
  customerNumber: 103,
  update: {
    customerName: 'HaiNN update',
    contactLastName: 'Schmitt',
    contactFirstName: 'Carine ',
    phone: '0123456789',
  },
};

const reqBodyUpdate1 = {
  order: {
    orderNumber: 10427,
    requiredDate: new Date(2021, 12, 30),
    comments: 'Hi there',
  },
  orderDetails: [
    {
      productCode: 'S10_1678',
      quantityOrdered: 50,
      priceEach: 48.81,
    },
    {
      productCode: 'S18_2957',
      quantityOrdered: 42,
      priceEach: 59.34,
    },
  ],
  customerNumber: 103,
  update: {
    customerName: 'HaiNN update',
    contactLastName: 'Schmitt',
    contactFirstName: 'Carine ',
    phone: '0123456789',
  },
};

const reqBodyUpdate2 = {
  order: {
    orderNumber: 10427,
    requiredDate: new Date(),
    comments: 'Hi there',
  },
  orderDetails: [
    {
      productCode: 'S10_1678',
      quantityOrdered: 50,
      priceEach: 48.81,
    },
    {
      productCode: 'S18_2957',
      quantityOrdered: 42,
      priceEach: 59.34,
    },
  ],
  customerNumber: 103,
};

const reqBodyCreate = {
  order: {
    orderNumber: 10428,
    requiredDate: '2021-12-30T17:00:00.000Z',
    comments: 'Hi there',
  },
  orderDetails: [
    {
      productCode: 'S10_1678',
      quantityOrdered: 50,
      priceEach: 48.81,
    },
    {
      productCode: 'S18_2957',
      quantityOrdered: 42,
      priceEach: 59.34,
    },
  ],
  customerNumber: 602,
  create: {
    customerNumber: 602,
    customerName: 'Atelier graphique',
    contactLastName: 'Schmitt',
    contactFirstName: 'Carine ',
    phone: '40.32.2555',
    addressLine1: '54, rue Royale',
    addressLine2: null,
    city: 'Nantes',
    state: null,
    postalCode: '44000',
    country: 'France',
    salesRepEmployeeNumber: 1370,
    creditLimit: 21000,
  },
};

const filter = {
  customerNumber: 103,
  page: 1,
  limit: 10,
  status: 'Shipped',
  orderDate: 'desc',
  requiredDate: 'desc',
  shippedDate: 'asc',
  minOrderDate: '2000-01-01',
  maxOrderDate: '2021-12-30',
  minRequireDate: '2000-01-01',
  maxRequireDate: '2021-12-30',
  minShippedDate: '2000-01-01',
  maxShippedDate: '2021-12-30',
};

export default {
  schema,
  schemaOrders,
  validate,
  validateOrders,
  orders,
  order,
  dataCreate,
  resultCreateOrder,
  resultCreateOrderDt,
  reqBodyUpdate,
  reqBodyCreate,
  reqBodyUpdate1,
  reqBodyUpdate2,
  filter,
};
