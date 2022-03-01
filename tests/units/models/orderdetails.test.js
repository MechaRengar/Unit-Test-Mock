import { assert, expect } from 'chai';
import OrderDetail from '../../../src/models/OrderDetail';

const {
  tableName,
  idColumn,
  jsonSchema,
  relationMappings,
} = OrderDetail;

const schema = {
  type: 'object',
  required: [
    'orderNumber',
    'productCode',
    'quantityOrdered',
    'priceEach',
    'orderLineNumber',
  ],

  properties: {
    orderNumber: { type: 'integer' },
    productCode: { type: 'string', maxLength: 15 },
    quantityOrdered: { type: 'integer' },
    priceEach: { type: 'number', minimum: 0, maximum: 1e10 },
    orderLineNumber: { type: 'integer' },
  },
};

describe('OrderDetail', () => {
  describe('#model', () => {
    it('Success get table name', () => {
      expect(tableName).to.eql('orderdetails');
    });

    it('Success get value of id column', () => {
      expect(idColumn).to.eql(('orderNumber', 'productCode'));
    });

    it('Success get schema of table', () => {
      expect(jsonSchema).to.eql(schema);
    });

    it('Success get type of relation data of table', () => {
      const result = relationMappings();

      expect(result).to.be.a('object');
    });

    it('Failed get type of relation data of table', async () => {
      try {
        relationMappings();
        assert.fail('Failed');
      } catch (error) {
        expect(error.message).to.eql('Failed');
      }
    });
  });
});
