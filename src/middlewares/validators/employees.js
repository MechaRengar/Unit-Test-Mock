import { celebrate, Joi } from 'celebrate';

const jobTitles = ['Admin', 'Manager', 'Staff'];
const employeeSchema = {
  employeeNumber: Joi.number().positive().required(),
  firstName: Joi.string().min(3).max(50).required(),
  lastName: Joi.string().min(3).max(50).required(),
  extension: Joi.string().max(10).required(),
  email: Joi.string().email().min(6).max(100)
    .required(),
  officeCode: Joi.string().max(10).required(),
  reportsTo: Joi.number().allow(null).required(),
  jobTitle: Joi.string()
    .valid(...jobTitles)
    .required(),
  role: Joi.number().valid(1, 2, 3).required(),
};
const employeeUpdateSchema = {
  firstName: Joi.string().min(3).max(50).optional(),
  lastName: Joi.string().min(3).max(50).optional(),
  extension: Joi.string().max(10).optional(),
  email: Joi.string().email().min(6).max(100)
    .optional(),
  officeCode: Joi.string().max(10).optional(),
  reportsTo: Joi.number().allow(null).optional(),
  jobTitle: Joi.string()
    .valid(...jobTitles)
    .optional(),
  role: Joi.number().valid(1, 2, 3).optional(),
};

const schemaId = {
  employeeNumber: Joi.number().positive().required(),
};

const employeeValidate = celebrate(
  {
    params: Joi.object().keys({}),
    query: Joi.object().keys({}),
    body: Joi.object().keys(employeeSchema),
  },
  {
    abortEarly: false,
    convert: true,
    presence: 'required',
    escapeHtml: true,
  },
);
const employeeUpdateValidate = celebrate(
  {
    params: Joi.object().keys(schemaId),
    query: Joi.object().keys({}),
    body: Joi.object().keys(employeeUpdateSchema),
  },
  {
    abortEarly: false,
    convert: true,
    escapeHtml: true,
  },
);

export { employeeUpdateValidate, employeeValidate };
