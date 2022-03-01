import bcrypt from 'bcryptjs';
import keys from '../config/keys';

const salt = keys.BCRYPT_SALT;

const hashPassword = (password) => {
  if (!password) {
    return { message: 'Can not find password' };
  }
  const hashedPassword = bcrypt.hash(password, salt);
  if (!hashedPassword) {
    return { message: 'Can not encrypt password' };
  }

  return hashedPassword;
};

const checkPassword = (password, hashedPassword) => {
  if (!password || !hashedPassword) {
    return { message: 'Can not find input to compare' };
  }
  const result = bcrypt.compare(password, hashedPassword);

  return result;
};

export default { hashPassword, checkPassword };
