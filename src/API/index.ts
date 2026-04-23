import axios from 'axios';

import { STG_BASE_URL } from '@env';

export const API = axios.create({
  baseURL: STG_BASE_URL,
});
