import { Model } from 'objection';
import Product from './Product';

class OrderDetail extends Model {
  static get tableName() {
    return 'orderdetails';
  }
  static get idColumn() {
    return ('orderNumber', 'productCode');
  }
  static get jsonSchema() {
    return {
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
  }
  static relationMappings() {
    return {
      products: {
        relation: Model.BelongsToOneRelation,
        modelClass: Product,
        join: {
          from: 'orderdetails.productCode',
          to: 'products.productCode',
        },
      },
    };
  }
}

export default OrderDetail;
