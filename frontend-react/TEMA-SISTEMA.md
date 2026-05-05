# Sistema de Temas - Documentação

## Visão Geral

O sistema agora suporta dois temas: **Dark** (padrão) e **Light**, com troca dinâmica e persistência.

## Componentes Criados

### 1. **ThemeContext** (`src/contexts/ThemeContext.tsx`)
- Contexto React para gerenciar o estado global do tema
- Salva preferência no localStorage
- Aplica classes CSS no elemento root

#### Hooks:
- `useTheme()` - Acesso ao tema atual e funções de controle

```typescript
const { theme, setTheme, toggleTheme } = useTheme();
```

### 2. **Página de Configurações** (`src/pages/Settings/`)
- Interface visual para selecionar tema
- Exibição clara das opções Dark e Light
- Feedback visual da seleção ativa

**Rota:** `/admin/configuracoes`

### 3. **Hook Customizado** (`src/hooks/useThemeColors.ts`)
- Retorna as cores do tema atual
- Facilita uso de cores dinâmicas em componentes

```typescript
const themeColors = useThemeColors();
const bgPrimary = themeColors.colors.background.primary;
```

### 4. **Componente ToggleTheme** (`src/components/ThemeToggle.tsx`)
- Botão reutilizável para troca rápida de tema
- Pode ser adicionado ao Header/Sidebar
- Um clique alterna entre Dark e Light

```tsx
import { ThemeToggle } from './components/ThemeToggle';

<ThemeToggle />
```

## Temas Definidos

### Dark Theme (Padrão)
- Fundo: azul escuro profundo (#0a1929)
- Texto: branco (#ffffff)
- Bordas: azul médio (#1e3a5f)

### Light Theme
- Fundo: branco (#ffffff)
- Texto: cinza/preto (#1a1f36)
- Bordas: cinza médio (#d1dce6)

## CSS Variables

O sistema usa CSS variables para transições suave entre temas:

```css
--color-bg-primary
--color-bg-secondary
--color-text-primary
--color-text-secondary
--gradient-primary
/* ... e mais */
```

## Onde é Aplicado

O ThemeProvider envolve toda a aplicação em `App.tsx`:

```tsx
<ThemeProvider>
  <BrowserRouter>
    ...
  </BrowserRouter>
</ThemeProvider>
```

## Persistência

A preferência de tema é salva em `localStorage` com a chave `gym-theme` e restaurada automaticamente ao retornar à aplicação.

## Próximos Passos

1. Adicionar `<ThemeToggle />` ao Header/Sidebar para acesso rápido
2. Considerar tema automático baseado em preferências do SO
3. Adicionar mais opções de personalização (fonte, espaçamento, etc.)
