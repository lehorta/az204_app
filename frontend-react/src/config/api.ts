/**
 * Configurações de API
 * A URL base pode ser carregada do arquivo api-config.json externo para permitir alterações pós-instalação
 */

interface ExternalApiConfig {
  apiBaseUrl: string;
  timeout: number;
}

// Configuração padrão (fallback se não conseguir carregar o arquivo externo)
const DEFAULT_CONFIG = {
  apiBaseUrl: 'http://localhost:5159/api',
  timeout: 10000,
};

let configLoaded = false;
let loadedConfig = { ...DEFAULT_CONFIG };

/**
 * Carrega a configuração do arquivo api-config.json
 * Esta função deve ser chamada no início da aplicação
 */
export async function loadApiConfig(): Promise<void> {
  if (configLoaded) return;
  
  try {
    const response = await fetch('/api-config.json');
    if (response.ok) {
      const config: ExternalApiConfig = await response.json();
      loadedConfig = config;
      console.log('Configuração da API carregada:', config.apiBaseUrl);
    }
  } catch (error) {
    console.warn('Usando configuração padrão da API. Arquivo api-config.json não encontrado.');
  }
  
  configLoaded = true;
}

/**
 * Retorna a configuração da API
 * Se ainda não foi carregada, retorna a configuração padrão
 */
export function getApiConfig() {
  return {
    // URL base da API do backend
    baseURL: loadedConfig.apiBaseUrl,

    // Timeout padrão para requisições (em millisegundos)
    timeout: loadedConfig.timeout,

    // Chaves de armazenamento local
    storage: {
      token: 'gym_auth_token',
      refreshToken: 'gym_refresh_token',
      user: 'gym_user',
      expiresAt: 'gym_expires_at',
    },
  };
}

/**
 * Permite alterar dinamicamente a URL da API (útil para testes/desenvolvimento)
 */
export function setApiUrl(newUrl: string): void {
  loadedConfig.apiBaseUrl = newUrl;
  console.log('URL da API alterada para:', newUrl);
}

/**
 * Retorna a URL atual da API
 */
export function getApiUrl(): string {
  return loadedConfig.apiBaseUrl;
}

// Export para compatibilidade com código existente
export const API_CONFIG = getApiConfig();

// Nota: API_URL não é mais uma constante, use getApiUrl() para obter valor atualizado
export let API_URL = loadedConfig.apiBaseUrl;
