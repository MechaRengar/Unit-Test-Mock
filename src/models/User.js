import { Model } from 'objection';
import Employee from './Employee';
import Customer from './Customer';
import utilsPassword from '../utils/password';
import utilsJwt from '../utils/jwt';

const {
  hashPassword,
  checkPassword,
} = utilsPassword;

const {
  signToken,
} = utilsJwt;
class User extends Model {
  static get tableName() {
    return 'users';
  }
  static get idColumn() {
    return 'username';
  }
  static get jsonSchema() {
    return {
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
  }
  static relationMappings() {
    return {
      employee: {
        relation: Model.BelongsToOneRelation,
        modelClass: Employee,
        join: {
          from: 'users.employeeNumber',
          to: 'employees.employeeNumber',
        },
      },
      customer: {
        relation: Model.BelongsToOneRelation,
        modelClass: Customer,
        join: {
          from: 'users.customerNumber',
          to: 'customers.customerNumber',
        },
      },
    };
  }

  static async getById(username) {
    const user = await User.query().findById(username);
    if (!user) {
      return {
        status: 'failure',
        message: 'Could not find user',
      };
    }

    return user;
  }

  static async register(data) {
    const hashedPassword = await hashPassword(data.password);
    data.password = hashedPassword;
    const user = await User.query().insertAndFetch(data);

    return user;
  }

  static async login(data) {
    const { username, password } = data;
    const user = await User.query()
      .findById(username)
      .withGraphJoined({
        employee: { $relation: 'employee' },
        customer: { $relation: 'customer' },
      });
    if (!user) {
      return {
        status: 'failure',
        message: 'Wrong username or password!',
      };
    }
    const dataToSign = {
      username,
    };
    const match = await checkPassword(password, user.password);
    if (!match) {
      return {
        status: 'failure',
        message: 'Wrong username or password!',
      };
    }
    if (user.employee) {
      const { employeeNumber, role, officeCode } = user.employee;
      dataToSign.employeeNumber = employeeNumber;
      dataToSign.role = role;
      dataToSign.officeCode = officeCode;
    } else {
      const { salesRepEmployeeNumber, customerNumber, role } = user.customer;
      dataToSign.customerNumber = customerNumber;
      dataToSign.role = role;
      dataToSign.salesRepEmployeeNumber = salesRepEmployeeNumber;
    }

    const token = signToken(dataToSign);

    return {
      status: 'success',
      message: `Login with ${user.username}`,
      token,
    };
  }

  // static async activeOrBlock(username) {
  // }
}

export default User;
