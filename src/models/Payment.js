import { Model } from 'objection';

class Payment extends Model {
  static get tableName() {
    return 'payments';
  }
  static get idColumn() {
    return ('customerNumber', 'checkNumber');
  }
  static get jsonSchema() {
    return {
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
  }
  static async destroy(customerNumber) {
    const result = await Payment.query().delete().where('customerNumber', customerNumber);

    return result;
  }
}

export default Payment;
