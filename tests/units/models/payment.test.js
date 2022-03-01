import { assert, expect } from 'chai';
import { it } from 'mocha';
import sinon from 'sinon';
import Payment from '../../../src/models/Payment';

const {
  tableName,
  idColumn,
  jsonSchema,
  destroy,
} = Payment;

const schema = {
  type: 'object',
  required: ['customerNumber', 'checkNumber', 'paymentDate', 'amount'],

  properties: {
    customerNumber: { type: 'integer', minimum: 1 },
    checkNumber: { type: 'string', maxLength: 50 },
    paymentDate: { type: 'date' },
    amount: {
      type: 'number',
      minimum: 0,
      maximum: 1e10,
    },
  },
};

describe('Payment', () => {
  describe('#model', () => {
    it('Success get table name', () => {
      expect(tableName).to.eql('payments');
    });

    it('Success get value of id column', () => {
      expect(idColumn).to.eql(('customerNumber', 'checkNumber'));
    });

    it('Success get schema of table', () => {
      expect(jsonSchema).to.eql(schema);
    });
  });

  describe('destroy', () => {
    afterEach(() => sinon.restore());

    it('Success destroy payments by customer mumber', async () => {
      const where = sinon.fake.returns(Promise.resolve(4));
      const fakeQuery = () => ({
        delete: () => ({ where }),
      });
      sinon.replace(Payment, 'query', fakeQuery);
      const result = await destroy(100);
      assert(where.called);

      expect(result).to.eql(4);
    });
  });
});
