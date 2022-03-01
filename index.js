import express from 'express';
import bodyParser from 'body-parser';
import { errors } from 'celebrate';

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import keys from './src/config/keys';
import router from './src/routes';
import errorHandler from './src/middlewares/errors/handleErrors';

const swaggerDocument = YAML.load('./swagger.yaml');

const {
  handleErrors,
} = errorHandler;

const app = express();
const PORT = keys.PORT;

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(router);

app.use(errors());
app.use(handleErrors);

app.listen(PORT, () => console.log(`> Server listening on port ${PORT}`));
