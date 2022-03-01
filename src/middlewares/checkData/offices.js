import modelsOffice from '../../models/Office';

const { getOfficeByOfficeCode } = modelsOffice;

const checkOfficeCodeCreate = async (req, res, next) => {
  const product = await getOfficeByOfficeCode(req.body.officeCode);

  const message = 'Office not found';

  if (product.message === message) {
    return next();
  }

  return res.status(404).json({ status: 'failure', message: 'Duplicate office code' });
};

const checkOfficeCodeUpdate = async (req, res, next) => {
  const product = await getOfficeByOfficeCode(req.params.officeCode);

  const message = 'Office not found';

  if (product.message === message) {
    return res.status(404).json({ status: 'Not Found', message: 'Office not found' });
  }

  return next();
};

export default {
  checkOfficeCodeCreate,
  checkOfficeCodeUpdate,
};
