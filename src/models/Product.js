import { Model } from 'objection';
import CustomError from '../middlewares/errors/CustomError';

class Product extends Model {
  static get tableName() {
    return 'products';
  }

  static get idColumn() {
    return 'productCode';
  }

  static get jsonSchema() {
    return {
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
  }

  static async getProducts(filter) {
    const { page, limit } = filter;
    const likeSearchKey = [
      'productName',
      'productScale',
      'productVendor',
      'productDescription',
    ];

    const queryBuilder = (q) => {
      filter.productLine ? q.where('productLine', filter.productLine) : false;
      filter.min ? q.where('MSRP', '>', filter.min) : false;
      filter.max ? q.where('MSRP', '<', filter.max) : false;
      likeSearchKey.forEach((eachKey) => {
        filter[eachKey]
          ? q.where(eachKey, 'like', `%${filter[eachKey]}%`)
          : false;
      });
    };

    const products = await Product.query()
      .modify(queryBuilder)
      .limit(limit)
      .offset(limit * (page - 1));

    return products;
  }


  static async getById(productCode) {
    const product = await Product.query().findById(productCode);

    return product;
  }

  static async createProduct(body) {
    const product = await Product.query().insertAndFetch(body);
    if (!product) {
      throw new CustomError('Internal Server Error', 500);
    }

    return product;
  }

  static async updateProduct(id, body) {
    const product = await Product.query().patchAndFetchById(id, body);

    return product;
  }

  static async deleteProduct(productCode) {
    const product = await Product.query().deleteById(productCode);

    return product;
  }
}

export default Product;
