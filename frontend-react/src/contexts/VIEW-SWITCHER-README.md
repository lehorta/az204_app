# Sistema de Alternância de Visão (View Switcher)

Este sistema permite que usuários Administrador alternem entre diferentes visões/roles da aplicação, facilitando o teste e compreensão de como cada perfil vê o sistema.

## Como Funciona

### 1. ViewContext
- Gerencia a visão atual do usuário (`currentView`)
- Armazena a role real do usuário (`actualRole`)
- Permite alternar entre visões disponíveis
- Pode restaurar para a visão real/original

### 2. Seletor de Visão no Header
- **Localizado**: Lado esquerdo do header, ao lado do seletor de academias
- **Disponível para**: Apenas usuários Administrador
- **Botão**: Mostra a visão atual com ícone de olho
- **Destacado**: Fica laranja quando a visão é diferente da role real

### 3. Uso

#### Importar o Hook
```typescript
import { useView } from '@/contexts/ViewContext';

const { currentView, setCurrentView, availableViews, resetToActualRole } = useView();
```

#### Trocar de Visão
```typescript
// Mudar para visão de Recepcionista
setCurrentView('Recepcionista');

// Voltar à visão real
resetToActualRole();
```

#### Verificar Visão Atual
```typescript
if (currentView === 'Recepcionista') {
  // Renderizar componente de Recepcionista
}
```

## Roles Disponíveis

- `Administrador` - Visão administrativa completa
- `Gerente` - Gerenciamento da academia
- `Financeiro` - Gestão financeira
- `Recepcionista` - Recepção e controle de acesso
- `Professor` - Gerenciamento de aulas

## Exemplos de Implementação

### Dashboard Com Visão Dinâmica
```typescript
import { useView } from '@/contexts/ViewContext';
import { ReceptionistDashboard } from './Receptionist';

export const Dashboard = () => {
  const { currentView } = useView();

  if (currentView === 'Recepcionista') {
    return <ReceptionistDashboard />;
  }

  return <AdminDashboard />;
};
```

### Componente Sensível à Visão
```typescript
export const MyComponent = () => {
  const { currentView } = useView();

  return (
    <div>
      {currentView === 'Financeiro' ? (
        <FinanceirContent />
      ) : (
        <RegularContent />
      )}
    </div>
  );
};
```

## Indicadores Visuais

### Quando a visão é diferente da role:
- ⚠️ Botão fica **laranja**
- 🏷️ Mostra "Ver como: [Role]" embaixo do nome do usuário
- 🔄 Um botão "Restaurar visão real" aparece no dropdown

### Quando a visão é a role real:
- ✅ Botão mostra apenas a role atual
- 🔵 Aparência normal (azul)

## Nota Importante

Este sistema é principalmente para **desenvolvimento e testes**. Em produção, você pode:

1. Desabilitar o seletor de visão para usuários não-admin
2. Adicionar logs de auditoria quando uma visão é alterada
3. Implementar permissões específicas para cada visão

## Estrutura de Arquivos

```
contexts/
├── ViewContext.tsx       # Context e hook useView
src/components/
├── Header.tsx           # Seletor de visão no header
src/pages/Dashboard/
├── Dashboard.tsx        # Dashboard com suporte a visão dinâmica
└── Receptionist/
    └── ReceptionistDashboard.tsx
```
