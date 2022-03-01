const Ajv = require('ajv');

const ajv = new Ajv();

const body = {
  firstName: 'firstName',
  lastName: 'lastName',
  extension: 'extension',
  email: 'email3@gmail.com',
  officeCode: 'officeCode',
  reportsTo: 1102,
  jobTitle: 'jobTitle',
  role: 2,
};
const updatedBody = {
  firstName: 'firstName',
  lastName: 'lastName',
  extension: 'extension',
  email: 'emailupdated@gmail.com',
  officeCode: 'officeCode',
  reportsTo: 1102,
  jobTitle: 'jobTitle',
  role: 2,
};

const employees = [
  {
    employeeNumber: 1,
    firstName: 'firstName',
    lastName: 'lastName',
    extension: 'extension',
    email: 'email@gmail.com',
    officeCode: 'officeCode',
    reportsTo: 100,
    jobTitle: 'jobTitle',
    role: 2,
  },
  {
    employeeNumber: 2,
    firstName: 'firstName',
    lastName: 'lastName',
    extension: 'extension',
    email: 'email1@gmail.com',
    officeCode: 'officeCode',
    reportsTo: 100,
    jobTitle: 'jobTitle',
    role: 2,
  },
  {
    employeeNumber: 3,
    firstName: 'firstName',
    lastName: 'lastName',
    extension: 'extension',
    email: 'email2@gmail.com',
    officeCode: 'officeCode',
    reportsTo: 100,
    jobTitle: 'jobTitle',
    role: 2,
  },
];

const employee = {
  employeeNumber: 4,
  firstName: 'firstName',
  lastName: 'lastName',
  extension: 'extension',
  email: 'email3@gmail.com',
  officeCode: 'officeCode',
  reportsTo: 1102,
  jobTitle: 'jobTitle',
  role: 2,
};

const jsonSchemaValidation = {
  type: 'object',
  required: [
    'employeeNumber',
    'lastName',
    'firstName',
    'extension',
    'email',
    'officeCode',
    'jobTitle',
    'role',
  ],

  properties: {
    employeeNumber: { type: 'integer', minimum: 1 },
    lastName: { type: 'string', minLength: 3, maxLength: 50 },
    firstName: { type: 'string', minLength: 3, maxLength: 50 },
    extension: { type: 'string', maxLength: 50 },
    email: { type: 'string', minLength: 10, maxLength: 100 },
    officeCode: {
      type: 'string',
      enum: ['1', '2', '3', '4', '5', '6', '7'],
    },
    reportsTo: { type: ['integer', 'null'], minimum: 1 },
    jobTitle: { type: 'string' },
    role: { enum: [1, 2, 3] },
  },
};

const employeeSchema = {
  type: 'object',
  properties: {
    employeeNumber: { type: 'integer' },
    lastName: { type: 'string' },
    firstName: { type: 'string' },
    extension: { type: 'string' },
    email: { type: 'string' },
    officeCode: { type: 'string' },
    reportsTo: { type: ['integer', 'null'] },
    jobTitle: { type: 'string' },
    role: { type: 'integer' },
  },
  required: [
    'employeeNumber',
    'lastName',
    'firstName',
    'extension',
    'email',
    'officeCode',
    'jobTitle',
    'role',
  ],
  additionalProperties: false,
};

const validate = ajv.compile(employeeSchema);

let req;

req = {
  params: {
    employeeNumber: 1,
  },
  body: {
    employeeNumber: 4,
    firstName: 'firstName',
    lastName: 'lastName',
    extension: 'extension',
    email: 'email3@gmail.com',
    officeCode: 'officeCode',
    reportsTo: 1102,
    jobTitle: 'jobTitle',
    role: 2,
  },
  query: {
    page: 1,
    limit: 10,
    role: 1,
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
  status: (code) => ({
    json: (data) => ({
      status: code,
      data,
      total: data.length,
    }),
    send: (message) => ({
      message,
    }),
  }),
};
const next = () => 'allow next';

export {
  employees,
  employee,
  validate,
  body,
  updatedBody,
  jsonSchemaValidation,
  req,
  res,
  next,
};
