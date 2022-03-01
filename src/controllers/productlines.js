import ProductLine from '../models/ProductLine';
import CustomError from '../middlewares/errors/CustomError';
import logger from '../utils/logger';

const { getAllProductLine, createProductline, updateProductline, deleteProductline } = ProductLine;

const fnGetAll = async (req, res) => {
  try {
    const productLines = await getAllProductLine();

    return res
      .status(200)
      .json({ message: 'success', total: productLines.length, productLines });
  } catch (error) {
    logger.error('GET/productLine', error);
    throw new CustomError('Internal server error', 500);
  }
};

const fnCreate = async (req, res) => {
  try {
    const productLine = await createProductline(req.body);

    return res.status(200).json({ message: 'success', productLine });
  } catch (error) {
    logger.error('POST/productLine', error);
    throw new CustomError('Internal server error', 500);
  }
};

const fnUpdate = async (req, res) => {
  try {
    const productLine = await updateProductline(req.params.productLine, req.body);
    if (productLine.message) {
      return res.status(404).json({
        status: 'failure', message: productLine.message,
      });
    }

    return res.status(200).json({ message: 'success', productLine });
  } catch (error) {
    logger.error('PACTH/productLine', error);
    throw new CustomError('Internal server error', 500);
  }
};

const fnDelete = async (req, res) => {
  try {
    const productLine = await deleteProductline(req.params.productLine);
    if (productLine.message) {
      return res.status(404).json({
        status: 'Not Found', message: 'Could not delete product line',
      });
    }


    return res.status(200).json({ message: 'Deleted success' });
  } catch (error) {
    logger.error('DELETE/productLine', error);
    throw new CustomError('Internal server error', 500);
  }
};

export default {
  fnGetAll,
  fnCreate,
  fnUpdate,
  fnDelete,
};
