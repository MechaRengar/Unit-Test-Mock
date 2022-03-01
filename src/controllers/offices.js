import Office from '../models/Office';
import CustomError from '../middlewares/errors/CustomError';
import logger from '../utils/logger';

const { getAllOffice, getOfficeByOfficeCode, createOffice, updateOffice, deleteOffice } = Office;

const fnGetAll = async (req, res) => {
  try {
    const Offices = await getAllOffice();

    return res
      .status(200)
      .json({ message: 'success', total: Offices.length, Offices });
  } catch (error) {
    logger.error('GET/office', error);
    throw new CustomError('Internal server error', 500);
  }
};

const fnGetOffice = async (req, res) => {
  try {
    const office = await getOfficeByOfficeCode(req.params.officeCode);
    if (office.message) {
      return res.status(404).json(office);
    }

    return res
      .status(200)
      .json({ message: 'success', office });
  } catch (error) {
    logger.error('GET/office/officeCode', error);
    throw new CustomError('Internal server error', 500);
  }
};

const fnCreate = async (req, res) => {
  try {
    const office = await createOffice(req.body);

    return res.status(200).json({ message: 'success', office });
  } catch (error) {
    logger.error('POST/office', error);
    throw new CustomError('Internal server error', 500);
  }
};

const fnUpdate = async (req, res) => {
  try {
    const office = await updateOffice(req.params.officeCode, req.body);

    return res.status(200).json({ message: 'success', office });
  } catch (error) {
    logger.error('FACTH/office', error);
    throw new CustomError('Internal server error', 500);
  }
};

const fnDelete = async (req, res) => {
  try {
    await deleteOffice(req.params.officeCode);

    return res.status(200).json({ message: 'Deleted success' });
  } catch (error) {
    logger.error('DELETE/office', error);
    throw new CustomError('Internal server error', 500);
  }
};

export default {
  fnGetAll,
  fnCreate,
  fnGetOffice,
  fnUpdate,
  fnDelete,
};
