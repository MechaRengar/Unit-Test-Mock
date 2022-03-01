import Employee from '../../models/Employee';
import logger from '../../utils/logger';

const { getById } = Employee;

const checkParamsEmployeeNumber = async (req, res, next) => {
  const employee = await getById(req.params.employeeNumber);
  if (!employee) {
    return res.status(404).json({
      status: 'Not Found',
      message: 'Employee not found',
    });
  }

  return next();
};

const checkGetManager = async (req, res, next) => {
  try {
    const { employeeNumber } = req.params;
    const { officeCode } = res.locals.auth;
    const employee = await getById(employeeNumber);
    if (res.locals.auth.role === 1) {
      return next();
    }
    if (res.locals.auth.role === 2 && employee.officeCode === officeCode) {
      return next();
    }
    if (res.locals.auth.role === 2 && employee.officeCode !== officeCode) {
      logger.warn(
        `GET / employee by ${res.locals.auth.username} not permission with employeeNumber ${employeeNumber} `,
      );

      return res
        .status(403)
        .json({ message: 'Forbidden' });
    }

    logger.warn(`GET / employee by ${res.locals.auth.username} unauthorized`);

    return res.status(401).json({ message: 'Unauthorized' });
  } catch (error) {
    logger.error(
      `GET / employee by ${res.locals.auth.username} with employeeNumber ${req.params.employeeNumber}`,
    );

    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const checkEmployeeExists = async (req, res, next) => {
  try {
    const employee = await getById(req.body.employeeNumber);
    if (!employee) {
      return next();
    }
    logger.warn(`POST / checkEmployeeExists by ${res.locals.auth.username}`);

    return res.status(400).json({ message: 'Employee does exist' });
  } catch (error) {
    logger.error(
      `POST / checkEmployeeExists by ${res.locals.auth.username} with employeeNumber ${req.body.employeeNumber}`,
    );

    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const checkReportsTo = async (req, res, next) => {
  try {
    const { reportsTo } = req.body;
    const employee = await getById(reportsTo);
    if (employee) {
      return next();
    }
    logger.warn(
      `POST / checkReportsTo ${res.locals.auth.username} Bad request`,
    );

    return res.status(400).json({ message: 'ReportsTo does not exist' });
  } catch (error) {
    logger.error(
      `POST / checkReportsTo by ${res.locals.auth.username} with reportsTo ${req.params.employeeNumber}`,
    );

    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
export { checkParamsEmployeeNumber, checkGetManager, checkEmployeeExists, checkReportsTo };
