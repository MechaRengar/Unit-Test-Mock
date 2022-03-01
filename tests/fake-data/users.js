import Ajv from 'ajv';

const schema = {
  type: 'object',
  properties: {
    username: { type: 'string', maxLength: 20 },
    password: { type: 'string', maxLength: 100 },
    employeeNumber: { type: ['integer', 'null'] },
    customerNumber: { type: ['integer', 'null'] },
  },
  oneOf: [
    { required: ['username', 'password', 'employeeNumber'] },
    { required: ['username', 'password', 'customerNumber'] },
  ],
};

const userC = {
  username: 'customer103',
  password: 'Pass@1234',
  customerNumber: 103,
};

const userE = {
  username: 'employee1286',
  password: 'Pass@1234',
  employeeNumber: 1286,
};

const dataLoginE = {
  username: 'staff1056',
  password: 'Pass@1234',
};

const dataLoginC = {
  username: 'customer103',
  password: 'Pass@1234',
};

const dataLoginSuccessE = {
  username: 'staff1056',
  password: '$2a$10$K9LqFwz9BP1EUoP94WyNG.lH4duHMHwijHs9QQROmVB8IiOdEGF32',
  employeeNumber: 1,
  customerNumber: null,
  isActive: 1,
  employee: {
    employeeNumber: 1056,
    lastName: 'Doe',
    firstName: 'John',
    extension: 'x1000',
    email: 'johndoe@example.com',
    officeCode: '1',
    reportsTo: null,
    jobTitle: 'Staff',
    role: 3,
  },
  customer: null,
};

const dataLoginFailedE = {
  username: 'employee',
  password: 'abc',
};

const dataLoginSuccessC = {
  username: 'customer103',
  password: '$2a$10$06YZ2bT7Afm5P0Q94WlBX.Xh9ns8dJ1GdQ6sdY0Kdyr56M0ru4XrS',
  employeeNumber: null,
  customerNumber: 103,
  isActive: 1,
  customer: {
    customerNumber: 103,
    customerName: 'John Doe',
    contactLastName: 'Doe',
    contactFirstName: 'John',
    phone: '0123.456789',
    addressLine1: '54, rue Royale',
    addressLine2: null,
    city: 'Nantes',
    state: null,
    postalCode: '44000',
    country: 'France',
    salesRepEmployeeNumber: 1,
    creditLimit: 1000,
    role: 4,
  },
  employee: null,
};

const user = {
  username: 'customer103',
  password: '$2a$10$06YZ2bT7Afm5P0Q94WlBX.Xh9ns8dJ1GdQ6sdY0Kdyr56M0ru4XrS',
  employeeNumber: null,
  customerNumber: 103,
  isActive: 1,
};

const schemaLoginSuccess = {
  type: 'object',
  properties: {
    status: { type: 'string' },
    message: { type: 'string' },
    token: { type: 'string' },
  },
};

const ajv = new Ajv();
const validate = ajv.compile(schemaLoginSuccess);

const statusFailure = {
  status: 'failure',
  message: 'Register failed',
};

export default {
  schema,
  userC,
  userE,
  dataLoginE,
  dataLoginC,
  dataLoginSuccessE,
  dataLoginSuccessC,
  dataLoginFailedE,
  user,
  validate,
  statusFailure,
};
