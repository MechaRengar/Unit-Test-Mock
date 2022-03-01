import Product from '../../models/Product';
import ProductLine from '../../models/ProductLine';
import logger from '../../utils/logger';

const checkParamsProductCode = async (req, res, next) => {
  const product = await Product.getById(req.params.productCode);

  if (!product) {
    logger.error(`Can not find product with code ${req.params.productCode}`);

    return res.status(404).json({ status: 'failure', message: `Can not find product with code ${req.params.productCode}` });
  }

  return next();
};

const checkBodyProductCode = async (req, res, next) => {
  const product = await Product.getById(req.body.productCode);
  if (!product) {
    return next();
  }
  logger.error(`${req.method} ${req.originalUrl} - ${res.locals.auth.username} - Duplicate product code`);

  return res.status(500).json({ status: 'failure', message: 'Duplicate info product code.' });
};

const checkProductLine = async (req, res, next) => {
  if (req.body.productLine) {
    const productline = await ProductLine.query().findById(req.body.productLine);
    if (!productline) {
      logger.error('Product Line not found');

      return res.status(404).json({ status: 'failure', message: 'Product Line not found' });
    }

    return next();
  }

  return next();
};

export default {
  checkParamsProductCode,
  checkBodyProductCode,
  checkProductLine,
};
