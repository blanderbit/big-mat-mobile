import axios from 'axios';

import { BASE_URL } from '@env';

export const API = axios.create({
  baseURL: BASE_URL,
});
