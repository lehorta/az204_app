import { Academy } from '../types';
import { mockAcademies } from '../mocks';

export const academyService = {
  /**
   * Busca as academias vinculadas ao usuário logado
   * TODO: Substituir pela chamada à API quando disponível
   */
  async getMyAcademies(): Promise<Academy[]> {
    // Temporariamente usando mock dados
    // Remover este bloco quando a API estiver pronta
    console.warn('[DEV] Usando mock de academias. Configure a API em academyService.getMyAcademies()');
    
    return new Promise((resolve) => {
      // Simular delay de rede
      setTimeout(() => {
        resolve(mockAcademies);
      }, 500);
    });

    /* 
    // Código original - reativar quando API estiver pronta
    const token = authService.getToken();

    if (!token) {
      throw new Error('Token não encontrado. Faça login novamente.');
    }

    const response = await fetch(`${getApiUrl()}/Academy/my-academies`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw createApiError(error, 'Erro ao buscar academias');
    }

    const data: Academy[] = await response.json();
    return data;
    */
  },
};
