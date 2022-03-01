import { Model } from 'objection';
import Knex from 'knex';

import keys from './keys';

const knex = Knex(keys.KNEX_CONFIG);
Model.knex(knex);

export default knex;
