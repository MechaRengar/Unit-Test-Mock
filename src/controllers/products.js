import Product from '../models/Product';
import logger from '../utils/logger';
import CustomError from '../middlewares/errors/CustomError';

const {
  getProducts,
  getById,
  createProduct,
  updateProduct,
  deleteProduct,
} = Product;

const create = async (req, res) => {
  try {
    const product = await createProduct(req.body);

    return res.status(200).json({ status: 'success', product });
  } catch (error) {
    logger.error(`POST/product/ by ${res.locals.auth.username}`);
    throw new CustomError('Internal server error', 500);
  }
};

const getAll = async (req, res) => {
  try {
    const filter = req.query;
    if (!filter.page) filter.page = 1;
    if (!filter.limit) filter.limit = 10;
    const products = await getProducts(req.query);
    if (products.length === 0) {
      return res.status(404).json({
        status: 'Not Found',
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      page: filter.page,
      limit: filter.limit,
      products,
    });
  } catch (error) {
    logger.error(`GET /products by ${res.locals.auth.username}`);
    throw new CustomError('Internal server error', 500);
  }
};

const getProductByCode = async (req, res) => {
  try {
    const product = await getById(req.params.productCode);

    return res.status(200).json({ status: 'success', product });
  } catch (error) {
    logger.error(`GET /product by ${res.locals.auth.username}`);
    throw new CustomError('Internal server error', 500);
  }
};

const deleted = async (req, res) => {
  try {
    await deleteProduct(req.params.productCode);

    return res.status(200).json({ status: 'success', message: 'Deleted success' });
  } catch (error) {
    logger.error(`DELETE /products/${req.params.productCode} by ${res.locals.auth.username}`);
    throw new CustomError('Internal server error', 500);
  }
};

const update = async (req, res) => {
  try {
    const product = await updateProduct(req.params.productCode, req.body);
    if (!product) {
      return res.status(500).json({
        message: 'Update failed',
      });
    }

    return res.status(200).json({ status: 'success', product });
  } catch (error) {
    logger.error(`PATCH /products/${req.params.productCode} by ${res.locals.auth.username} ${error}`);
    throw new CustomError('Internal server error', 500);
  }
};

export { create, getAll, getProductByCode, deleted, update };
