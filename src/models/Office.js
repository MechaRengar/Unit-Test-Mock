import { Model } from 'objection';
import Employee from './Employee';
import CustomError from '../middlewares/errors/CustomError';


class Office extends Model {
  static get tableName() {
    return 'offices';
  }
  static get idColumn() {
    return 'officeCode';
  }
  static get jsonSchema() {
    return {
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
  }
  static relationMappings() {
    return {
      employees: {
        relation: Model.HasManyRelation,
        modelClass: Employee,
        join: {
          from: 'offices.officeCode',
          to: 'employees.officeCode',
        },
      },
    };
  }

  static async getAllOffice() {
    try {
      const result = await Office.query();

      if (!result) {
        return { status: 'failure', message: 'Get office failed' };
      }

      return result;
    } catch (error) {
      throw new CustomError('Internal server error', 500);
    }
  }

  static async getOfficeByOfficeCode(officeCode) {
    try {
      const result = await Office.query().findById(officeCode);
      if (!result) {
        return { message: 'Office not found' };
      }

      return result;
    } catch (error) {
      throw new CustomError('Internal server error', 500);
    }
  }

  static async createOffice(data) {
    try {
      const result = await Office.query().insertAndFetch(data);

      return result;
    } catch (error) {
      console.log(error.message);
      throw new CustomError('Internal server error', 500);
    }
  }

  static async updateOffice(officeCode, data) {
    try {
      const result = await Office.query().patchAndFetchById(officeCode, data);

      return result;
    } catch (error) {
      throw new CustomError('Internal server error', 500);
    }
  }

  static async deleteOffice(officeCode) {
    try {
      await Office.query().deleteById(officeCode);

      return {
        status: 'success',
        message: `Successfully delete office with officeCode ${officeCode}`,
      };
    } catch (error) {
      throw new CustomError('Internal server error', 500);
    }
  }
}

export default Office;
