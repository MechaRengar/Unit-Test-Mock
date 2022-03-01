/* eslint-disable array-callback-return */
import { Model } from 'objection';
import Customer from './Customer';
import CustomError from '../middlewares/errors/CustomError';

class Employee extends Model {
  static get tableName() {
    return 'employees';
  }

  static get idColumn() {
    return 'employeeNumber';
  }

  static get jsonSchema() {
    return {
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
  }

  static get relationMappings() {
    return {
      customers: {
        relation: Model.HasManyRelation,
        modelClass: Customer,
        join: {
          from: 'employees.employeeNumber',
          to: 'customers.salesRepEmployeeNumber',
        },
      },
      manageBy: {
        relation: Model.BelongsToOneRelation,
        modelClass: Employee,
        join: {
          from: 'employees.reportsTo',
          to: 'employees.employeeNumber',
        },
      },
    };
  }

  static async getEmployees(filter) {
    const { page, limit } = filter;
    const extractSearchObject = {};
    const extractSearchKey = ['employeeNumber', 'officeCode', 'role'];
    extractSearchKey.map((eK) => {
      if (filter[eK]) {
        extractSearchObject[eK] = filter[eK];
      }
    });
    const employees = await Employee.query()
      .where(extractSearchObject)
      .limit(limit)
      .offset(limit * (page - 1));
    if (!employees) {
      return { message: 'Employee is null' };
    }

    return {
      total: employees.length,
      data: employees,
    };
  }

  static async getById(employeeNumber) {
    const id = Number(employeeNumber);
    if (!id) {
      throw new CustomError('Invalid type Employee Number', 400);
    }
    const employee = await Employee.query().findById(employeeNumber);

    return employee;
  }

  static async createEmployee(body) {
    const employee = await Employee.query().insertAndFetch(body);
    if (!employee) {
      throw new CustomError('Internal Server Error', 500);
    }

    return employee;
  }

  static async updateEmployee(id, body) {
    const employee = await Employee.query().patchAndFetchById(id, body);
    if (!employee) {
      throw new CustomError('Internal Server Error', 500);
    }

    return employee;
  }

  static async deleteEmployee(id) {
    const employeeNumber = parseInt(id, 10);
    if (!employeeNumber) {
      throw new Error('employeeNumber must a Number', 400);
    }
    const employee = await Employee.query().deleteById(employeeNumber);

    return employee;
  }

  static async getEmployeeNumbers(employeeNumber) {
    const employeeNumbers = await Employee.query()
      .select('employeeNumber')
      .where('reportsTo', employeeNumber)
      .orWhere('employeeNumber', employeeNumber);

    const listOfEmployeeNumbers = employeeNumbers.map(
      em => em.employeeNumber,
    );

    return listOfEmployeeNumbers;
  }

  static async getByOffice(officeCode) {
    const employees = await Employee.query().where('officeCode', officeCode);

    return employees;
  }
}

export default Employee;
