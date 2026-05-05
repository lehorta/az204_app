import { Academy } from '../types';

export const mockAcademies: Academy[] = [
  {
    academyId: 'ac_001',
    academyName: 'Academia Fitness Center - Zona Sul',
    status: 'Active',
    email: 'contato@academy-zona-sul.com.br',
    telefone: '(11) 3456-7890',
    address: 'Avenida Paulista, 1000',
    city: 'São Paulo',
    state: 'SP',
  },
  {
    academyId: 'ac_002',
    academyName: 'Power Gym - Centro',
    status: 'Active',
    email: 'contato@powergym-centro.com.br',
    telefone: '(11) 4567-8901',
    address: 'Rua Augusta, 500',
    city: 'São Paulo',
    state: 'SP',
  },
  {
    academyId: 'ac_003',
    academyName: 'Mega Fitness - Zona Norte',
    status: 'Active',
    email: 'info@megafitness-norte.com.br',
    telefone: '(11) 5678-9012',
    address: 'Avenida Tietê, 2000',
    city: 'São Paulo',
    state: 'SP',
  },
  {
    academyId: 'ac_004',
    academyName: 'Elite Training Studio',
    status: 'Active',
    email: 'contact@elitetraining.com.br',
    telefone: '(11) 6789-0123',
    address: 'Rua Oscar Freire, 800',
    city: 'São Paulo',
    state: 'SP',
  },
  {
    academyId: 'ac_005',
    academyName: 'Sports Club Premium - Campinas',
    status: 'Inactive',
    email: 'admin@sportsclub-campinas.com.br',
    telefone: '(19) 7890-1234',
    address: 'Avenida Dr. Moraes, 300',
    city: 'Campinas',
    state: 'SP',
  },
];

export const mockAcademyByRoleResponsible = () => {
  // Simula academias de um administrador específico
  // Usuários Admin podem ter múltiplas academias
  return mockAcademies.slice(0, 4); // Retorna as 4 primeiras academias
};

export const mockAcademyByReceptionist = () => {
  // Simula academias de um recepcionista (geralmente apenas 1)
  return [mockAcademies[0]];
};

export const mockAcademyByTeacher = () => {
  // Simula academias de um professor
  return mockAcademies.slice(0, 2);
};

export const mockAcademyById = (academyId: string): Academy | undefined => {
  return mockAcademies.find(academy => academy.academyId === academyId);
};
