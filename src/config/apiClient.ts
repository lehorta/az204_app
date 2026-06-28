import axios, { AxiosInstance, AxiosError } from 'axios';

const getAuthToken = (): string | null => localStorage.getItem('gym_auth_token');

let clientInstance: AxiosInstance | null = null;

export function initializeApiClient(baseURL: string): AxiosInstance {
  clientInstance = axios.create({
    baseURL,
    timeout: 30_000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Interceptor de requisição: adicionar token
  clientInstance.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Interceptor de resposta: tratar erros
  clientInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // Token expirado - redirecionar para login
        window.location.href = '/';
        localStorage.removeItem('authToken');
      }

      return Promise.reject(error);
    }
  );

  return clientInstance;
}

export function getApiClient(): AxiosInstance {
  if (!clientInstance) {
    throw new Error(
      'API client not initialized. Call initializeApiClient() first.'
    );
  }
  return clientInstance;
}

// Exportar para uso nos hooks
export const apiClient = new Proxy({} as AxiosInstance, {
  get(_target, property) {
    const client = getApiClient() as unknown as Record<string, unknown>;
    const value = client[String(property)];

    if (typeof value === 'function') {
      return (value as (...args: unknown[]) => unknown).bind(client);
    }

    return value;
  },
});
