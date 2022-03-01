const schema = {
  type: 'object',
  required: [
    'officeCode',
    'city',
    'phone',
    'addressLine1',
    'country',
    'postalCode',
    'territory',
  ],

  properties: {
    officeCode: { type: 'string', maxLength: 10 },
    city: { type: 'string', maxLength: 50 },
    phone: { type: 'string', maxLength: 50 },
    addressLine1: { type: 'string', maxLength: 50 },
    addressLine2: { type: ['string', 'null'], maxLength: 50 },
    state: { type: ['string', 'null'], maxLength: 50 },
    country: { type: 'string', maxLength: 50 },
    postalCode: { type: 'string', maxLength: 15 },
    territory: { type: 'string', maxLength: 10 },
  },
};

const Offices = [
  {
    officeCode: '1',
    city: 'San Francisco',
    phone: '0123456789',
    addressLine1: '100 Market Street',
    addressLine2: 'Suite 300',
    state: 'CA',
    country: 'USA',
    postalCode: '94080',
    territory: 'NA',
  },
  {
    officeCode: '2',
    city: 'San Francisco',
    phone: '0123456789',
    addressLine1: '100 Market Street',
    addressLine2: null,
    state: 'CA',
    country: 'USA',
    postalCode: '94080',
    territory: 'NA',
  },
  {
    officeCode: '3',
    city: 'San Francisco',
    phone: '0123456789',
    addressLine1: '100 Market Street',
    addressLine2: 'Suite 300',
    state: null,
    country: 'USA',
    postalCode: '94080',
    territory: 'NA',
  },
  {
    officeCode: '4',
    city: 'San Francisco',
    phone: '0123456789',
    addressLine1: '100 Market Street',
    addressLine2: 'Suite 300',
    state: 'CA',
    country: 'USA',
    postalCode: '94080',
    territory: 'NA',
  },

];

const officeA = {
  officeCode: '1',
  city: 'San Francisco',
  phone: '0123456789',
  addressLine1: '100 Market Street',
  addressLine2: 'Suite 300',
  state: 'CA',
  country: 'USA',
  postalCode: '94080',
  territory: 'NA',
};

const office = {
  officeCode: '1',
  city: 'San Francisco',
  phone: '0123456789',
  addressLine1: '100 Market Street',
  addressLine2: 'Suite 300',
  state: 'CA',
  country: 'USA',
  postalCode: '94080',
  territory: 'NA',
};

const officeUpdate = {
  officeCode: '1',
  city: 'Update',
  phone: '0123456789',
  addressLine1: '100 Market Street',
  addressLine2: 'Suite 300',
  state: 'CA',
  country: 'USA',
  postalCode: '94080',
  territory: 'NA',
};

export default {
  schema,
  Offices,
  officeA,
  office,
  officeUpdate,
};
