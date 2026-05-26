import axios from 'axios';

import {
  PROD_BASE_URL,
  // STG_BASE_URL
} from '@env';

export const API = axios.create({
  baseURL: PROD_BASE_URL,
});
