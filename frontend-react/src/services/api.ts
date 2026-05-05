import axios from 'axios';
import { AccessRequest, AccessResponse, SystemStatus } from '../types';
import { createApiError } from './apiError';

const api = axios.create({
  baseURL: 'https://f12f-138-185-96-36.ngrok-free.app/api',
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const responseData = error?.response?.data ?? null;
    const fallback = typeof error?.message === 'string' && error.message.trim()
      ? error.message
      : 'Erro ao comunicar com a API';
    return Promise.reject(createApiError(responseData, fallback));
  }
);

export const accessService = {
  validateAccess: async (request: AccessRequest): Promise<AccessResponse> => {
    const { data } = await api.post<AccessResponse>('/access/validate', request);
    return data;
  },

  openGate: async (): Promise<void> => {
    await api.post('/access/open-gate');
  },

  getStatus: async (): Promise<SystemStatus> => {
    const { data } = await api.get<SystemStatus>('/access/status');
    return data;
  },
};

export default api;
