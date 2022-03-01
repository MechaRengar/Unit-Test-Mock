import { Model } from 'objection';
import Product from './Product';
import CustomError from '../middlewares/errors/CustomError';

class ProductLine extends Model {
  static get tableName() {
    return 'productlines';
  }
  static get idColumn() {
    return 'productLine';
  }
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['productLine', 'textDescription', 'htmlDescription', 'image'],

      properties: {
        productLine: { type: 'string', maxLength: 50 },
        textDescription: { type: 'string', maxLength: 4000 },
        htmlDescription: { type: ['string', 'null'] },
        image: { type: ['string', 'null'] },
      },
    };
  }

  static relationMappings() {
    return {
      products: {
        relation: Model.HasManyRelation,
        modelClass: Product,
        join: {
          from: 'productlines.productLine',
          to: 'products.productLine',
        },
      },
    };
  }

  static async getAllProductLine() {
    try {
      const result = await ProductLine.query();

      if (!result) {
        return {
          status: 'failure',
          message: 'Get productLine failed',
        };
      }

      return result;
    } catch (error) {
      throw new CustomError('Internal server error', 500);
    }
  }

  static async createProductline(data) {
    try {
      const result = await ProductLine.query().insertAndFetch(data);
      if (!result) {
        return { message: 'Create productLine Failed' };
      }

      return result;
    } catch (error) {
      throw new CustomError('Internal server error', 500);
    }
  }

  static async updateProductline(productLine, data) {
    try {
      const result = await ProductLine.query().patchAndFetchById(productLine, data);

      if (!result) return { message: 'Update productLine failed' };

      return result;
    } catch (error) {
      throw new CustomError('Internal server error', 500);
    }
  }

  static async deleteProductline(productLine) {
    try {
      const result = await ProductLine.query().deleteById(productLine);
      if (result === 0) return { message: 'Delete failed' };

      return {
        status: 'success',
      };
    } catch (error) {
      throw new CustomError('Internal server error', 500);
    }
  }

}

export default ProductLine;
