// eslint-disable-next-line no-unused-vars
const handleErrors = (error, req, res, next) => {
  const { statusCode = 500, status = 'error', message } = error;

  return res.status(statusCode).json({
    status,
    message,
  });
};

const handleError = fn => (req, res, next) => fn(req, res, next).catch(next);


export default { handleErrors, handleError };
