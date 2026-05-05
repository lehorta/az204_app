# ?? GUIA DE INÍCIO RÁPIDO - Gym.Net

## ? Status: PRONTO PARA EXECUTAR!

Tudo está compilado e instalado. Siga estes passos simples:

---

## ?? Executar o Projeto

### **Passo 1: Iniciar o Frontend React**

Abra um **novo terminal** e execute:

```powershell
cd "C:\ghr\Gym.net\Gym.Net\frontend-react"
npm run dev
```

? O React vai iniciar em: **http://localhost:5173**

---

### **Passo 2: Executar o Backend WPF**

No **Visual Studio**:

1. Pressione **F5** ou clique em **? Start**
2. A aplicação WPF vai:
   - Iniciar API em **http://localhost:5000**
   - Abrir janela com WebView2
   - Carregar o React automaticamente

---

## ?? Como Testar

### **Tela de Login**
- **Senha**: `admin`
- Click em "Entrar no Sistema"

### **Tela de Controle de Acesso**
Digite uma credencial para testar:
- ? `123456` ? Acesso **LIBERADO**
- ? `admin` ? Acesso **LIBERADO**
- ? Qualquer outro ? Acesso **NEGADO**

---

## ?? Arquitetura

```
???????????????????????????????
?     React Frontend          ?
?   http://localhost:5173     ?
?  - Vite + TailwindCSS       ?
?  - Login                    ?
?  - Controle de Acesso       ?
???????????????????????????????
             ? HTTP Requests
             ?
???????????????????????????????
?   WPF Host (WebView2)       ?
?   + ASP.NET Core API        ?
?   http://localhost:5000     ?
?                             ?
?  Endpoints:                 ?
?  - POST /api/access/validate?
?  - POST /api/access/open-gate?
?  - GET  /api/access/status  ?
???????????????????????????????
```

---

## ?? Comandos Úteis

### React (Frontend)
```powershell
# Instalar dependências
npm install

# Iniciar dev server
npm run dev

# Build para produção
npm run build
```

### .NET (Backend)
```powershell
# Restaurar pacotes
dotnet restore

# Compilar
dotnet build

# Executar
dotnet run
```

---

## ?? Estrutura de Arquivos

```
C:\ghr\Gym.net\Gym.Net\
?
??? Controllers/
?   ??? AccessController.cs      # ? API REST
?
??? frontend-react/               # ? Frontend React
?   ??? src/
?   ?   ??? components/
?   ?   ?   ??? Button.tsx
?   ?   ?   ??? Card.tsx
?   ?   ??? pages/
?   ?   ?   ??? Login.tsx
?   ?   ?   ??? AccessControl.tsx
?   ?   ??? services/
?   ?   ?   ??? api.ts
?   ?   ??? types/
?   ?       ??? index.ts
?   ??? package.json
?
??? MainWindow.xaml              # ? UI WPF com WebView2
??? MainWindow.xaml.cs
??? App.xaml                     # ? Inicialização
??? App.xaml.cs
??? Gym.Net.csproj               # ? Projeto configurado
```

---

## ?? Features Implementadas

? **Backend (.NET 10)**
- WPF Host com WebView2
- API REST local (ASP.NET Core)
- Controller de validação de acesso
- CORS configurado
- Endpoints funcionais

? **Frontend (React + Vite)**
- TypeScript configurado
- TailwindCSS para estilização
- React Router para navegação
- Componentes reutilizáveis
- Tela de Login
- Tela de Controle de Acesso
- Feedback visual (sucesso/erro)
- Status de conexão

---

## ?? Solução de Problemas

### ? "WebView2 Runtime não encontrado"
**Solução**: Instale o WebView2 Runtime:
https://developer.microsoft.com/microsoft-edge/webview2/

### ? "Erro ao carregar interface"
**Solução**: Certifique-se que o React está rodando:
```powershell
cd frontend-react
npm run dev
```

### ? "Erro ao validar acesso"
**Solução**: Verifique se a API está rodando:
- Abra: http://localhost:5000/api/access/status
- Deve retornar JSON com status

---

## ?? Próximos Passos

### 1?? **Integração de Hardware**
- [ ] Adicionar drivers de catraca
- [ ] Implementar leitor RFID
- [ ] Integrar sistema de reconhecimento facial

### 2?? **Integração com API Cloud**
- [ ] Conectar com backend na nuvem
- [ ] Sincronização de dados
- [ ] Cache offline

### 3?? **Melhorias de UX**
- [ ] Histórico de acessos
- [ ] Relatórios em tempo real
- [ ] Configurações do sistema
- [ ] Multi-idioma (PT/EN/ES)

---

## ?? Suporte

Se encontrar algum problema:

1. Verifique se o React está rodando (`npm run dev`)
2. Verifique se o .NET compilou sem erros
3. Verifique os logs no console do navegador (F12)
4. Verifique o console da aplicação WPF

---

## ? Tudo Pronto!

Execute os comandos acima e o sistema estará funcionando! ??

**Desenvolvido com ?? usando .NET 10 + React 18**
