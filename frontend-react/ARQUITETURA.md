# ?? Arquitetura Frontend - Separação de Responsabilidades

## ?? Objetivo

Separar o **HTML/JSX** (apresentação) da **lógica de negócio** para criar componentes mais testáveis, reutilizáveis e fáceis de manter.

---

## ?? Nova Estrutura

```
frontend-react/src/pages/
??? Login/
?   ??? index.ts              # Barrel export
?   ??? Login.tsx             # Container (orquestra)
?   ??? LoginView.tsx         # Apresentação (HTML/JSX)
?   ??? useLogin.ts           # Hook customizado (lógica)
?
??? AccessControl/
    ??? index.ts              # Barrel export
    ??? AccessControl.tsx     # Container (orquestra)
    ??? AccessControlView.tsx # Apresentação (HTML/JSX)
    ??? useAccessControl.ts   # Hook customizado (lógica)
```

---

## ?? Padrão Implementado: **Container/Presenter**

### **1. Container (Login.tsx / AccessControl.tsx)**
**Responsabilidade**: Orquestração
```tsx
import React from 'react';
import { LoginView } from './LoginView';
import { useLogin } from './useLogin';

export const Login: React.FC = () => {
  const { password, setPassword, isLoading, handleLogin } = useLogin();

  return (
    <LoginView
      password={password}
      isLoading={isLoading}
      onPasswordChange={setPassword}
      onSubmit={handleLogin}
    />
  );
};
```

**O que faz:**
- ? Usa o hook customizado
- ? Passa props para o componente de apresentação
- ? **SEM HTML/JSX** (só orquestra)

---

### **2. Presenter/View (*View.tsx)**
**Responsabilidade**: Apresentação pura
```tsx
interface LoginViewProps {
  password: string;
  isLoading: boolean;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  password,
  isLoading,
  onPasswordChange,
  onSubmit,
}) => {
  return (
    <div>
      {/* TODO O HTML/JSX aqui */}
    </div>
  );
};
```

**O que faz:**
- ? Recebe dados via props
- ? Renderiza HTML/JSX
- ? **SEM lógica de negócio**
- ? **SEM estado** (stateless)
- ? **SEM side effects**

---

### **3. Custom Hook (use*.ts)**
**Responsabilidade**: Lógica de negócio
```tsx
export const useLogin = () => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de validação...
  };

  return {
    password,
    setPassword,
    isLoading,
    handleLogin,
  };
};
```

**O que faz:**
- ? Gerencia estado
- ? Lógica de negócio
- ? Side effects (API calls, navigation)
- ? **SEM HTML/JSX**
- ? Reutilizável e testável

---

### **4. Barrel Export (index.ts)**
**Responsabilidade**: Simplificar imports
```tsx
export { Login } from './Login';
export { LoginView } from './LoginView';
export { useLogin } from './useLogin';
```

**Benefício:**
```tsx
// Antes
import { Login } from './pages/Login/Login';

// Depois
import { Login } from './pages/Login';
```

---

## ? Benefícios da Nova Estrutura

### **1. Testabilidade** ??
```tsx
// Testar lógica independente da UI
describe('useLogin', () => {
  it('should validate password', () => {
    const { result } = renderHook(() => useLogin());
    // Testes sem renderizar componentes
  });
});

// Testar UI independente da lógica
describe('LoginView', () => {
  it('should render form', () => {
    render(<LoginView {...mockProps} />);
    // Testes visuais sem lógica complexa
  });
});
```

### **2. Reutilização** ??
```tsx
// Usar a mesma lógica em contextos diferentes
function MobileLogin() {
  const loginLogic = useLogin();
  return <MobileLoginView {...loginLogic} />;
}

function DesktopLogin() {
  const loginLogic = useLogin();
  return <DesktopLoginView {...loginLogic} />;
}
```

### **3. Manutenibilidade** ??
```tsx
// Mudar UI sem tocar na lógica
LoginView.tsx ? Alterar HTML/CSS

// Mudar lógica sem tocar na UI
useLogin.ts ? Alterar validações
```

### **4. Separação de Preocupações** ??
- **View**: Como mostrar
- **Hook**: O que fazer
- **Container**: Como conectar

---

## ?? Comparação

### **Antes (Monolítico)**
```tsx
export const Login: React.FC = () => {
  // Estado
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Lógica
  const handleLogin = async (e: React.FormEvent) => {
    // ...
  };

  // HTML/JSX misturado
  return (
    <div>
      <form onSubmit={handleLogin}>
        {/* 50 linhas de HTML */}
      </form>
    </div>
  );
};
```

**Problemas:**
- ? Difícil de testar
- ? Difícil de reutilizar
- ? Lógica e apresentação acopladas
- ? Arquivo grande (100+ linhas)

---

### **Depois (Modular)**
```tsx
// Login.tsx (5 linhas)
export const Login: React.FC = () => {
  const logic = useLogin();
  return <LoginView {...logic} />;
};

// useLogin.ts (30 linhas)
export const useLogin = () => {
  // Toda a lógica aqui
};

// LoginView.tsx (50 linhas)
export const LoginView: React.FC<Props> = (props) => {
  // Todo o HTML aqui
};
```

**Benefícios:**
- ? Fácil de testar (isoladamente)
- ? Fácil de reutilizar (hooks)
- ? Lógica e apresentação separadas
- ? Arquivos menores e focados

---

## ?? Fluxo de Dados

```
???????????????????
?   useLogin()    ?  ? Lógica + Estado
?  (Custom Hook)  ?
???????????????????
         ?
         ? { password, isLoading, handleLogin }
         ?
??????????????????
?   Login.tsx    ?  ? Orquestrador
?  (Container)   ?
??????????????????
         ?
         ? props
         ?
??????????????????
?  LoginView.tsx ?  ? Apresentação
?     (View)     ?
??????????????????
```

---

## ?? Convenções

### **Nomenclatura**
```
NomeDaPagina/
??? index.ts              # Export barrel
??? NomeDaPagina.tsx      # Container
??? NomeDaPaginaView.tsx  # View/Presenter
??? useNomeDaPagina.ts    # Custom Hook
```

### **Interfaces**
```tsx
// View Props sempre terminam com "ViewProps"
interface LoginViewProps {
  // ...
}

// Hooks retornam objeto com métodos prefixados
const useLogin = () => {
  return {
    handleLogin,    // handle*
    setPassword,    // set*
    isLoading,      // is* / has*
  };
};
```

---

## ?? Próximos Passos

### **1. Adicionar Testes**
```tsx
// LoginView.test.tsx
describe('LoginView', () => {
  it('should render correctly', () => {
    // ...
  });
});

// useLogin.test.ts
describe('useLogin', () => {
  it('should handle login', () => {
    // ...
  });
});
```

### **2. Storybook** (Opcional)
```tsx
// LoginView.stories.tsx
export default {
  title: 'Pages/Login/LoginView',
  component: LoginView,
};

export const Default = () => (
  <LoginView
    password=""
    isLoading={false}
    onPasswordChange={() => {}}
    onSubmit={() => {}}
  />
);
```

### **3. Documentação de Componentes**
```tsx
/**
 * LoginView - Componente de apresentação da tela de login
 * 
 * @param password - Senha digitada pelo usuário
 * @param isLoading - Estado de carregamento
 * @param onPasswordChange - Callback quando senha muda
 * @param onSubmit - Callback quando formulário é submetido
 */
export const LoginView: React.FC<LoginViewProps> = ({ ... }) => {
  // ...
};
```

---

## ?? Referências

- [React Patterns](https://reactpatterns.com/)
- [Container/Presenter Pattern](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
- [Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

## ?? Dicas

### **Quando usar este padrão?**
? Páginas complexas com muita lógica  
? Componentes que precisam ser testados  
? Lógica que pode ser reutilizada  
? Times grandes (separação de responsabilidades)

### **Quando NÃO usar?**
? Componentes muito simples (ex: botões)  
? Páginas estáticas sem lógica  
? Protótipos rápidos  

---

**Estrutura implementada com sucesso! ??**
