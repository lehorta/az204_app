# Mocks de Desenvolvimento

Este diretório contém dados mock para desenvolvimento e testes da aplicação.

## Uso

### Importar Academias Mock

```typescript
import { mockAcademies, mockAcademyById } from '@/mocks';

// Obter todas as academias
console.log(mockAcademies);

// Obter academia por ID
const academy = mockAcademyById('ac_001');

// Obter academias por role
import { mockAcademyByRoleResponsible } from '@/mocks';
const adminAcademies = mockAcademyByRoleResponsible();
```

## Dados Disponíveis

### Academias

- **Academia Fitness Center - Zona Sul** (ac_001)
- **Power Gym - Centro** (ac_002)
- **Mega Fitness - Zona Norte** (ac_003)
- **Elite Training Studio** (ac_004)
- **Sports Club Premium - Campinas** (ac_005) - Inativa

## Como Usar em Desenvolvimento

1. **No serviço de Academia**, você pode criar uma função que retorna mocks em ambiente de desenvolvimento:

```typescript
// academy.ts
async getMyAcademies(): Promise<Academy[]> {
  // Em desenvolvimento
  if (import.meta.env.DEV) {
    console.warn('Usando dados mock de academias');
    return mockAcademies;
  }
  
  // Em produção
  const response = await fetch(...);
  // ... resto do código
}
```

2. **No hook useAcademies**, você pode adicionar um fallback:

```typescript
const fetchAcademies = async () => {
  try {
    const data = await academyService.getMyAcademies();
    setAcademies(data);
  } catch (err) {
    // Fallback para mocks em caso de erro
    console.warn('Erro ao buscar academias, usando mocks');
    setAcademies(mockAcademies);
  }
};
```

## Notas

- Os mocks incluem dados realistas de academias em São Paulo
- Cada academia tem informações de contato e endereço
- As funções separadas por role simulam as permissões do sistema
