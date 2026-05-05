# ??? SisBurpee - Sistema de Controle de Acesso

Sistema desktop para academias com interface React integrada via WebView2.

## ? **STATUS: COMPILADO E PRONTO!**

?? **Localiza��o**: `C:\ghr\Gym.net\Gym.Net\`

### ?? In�cio R�pido

**Terminal 1 - Frontend:**
```powershell
cd "C:\ghr\Gym.net\Gym.Net\frontend-react"
npm run dev
```

**Visual Studio - Backend:**
- Pressione **F5**

**Credenciais:**
- Login: `admin`
- Acesso: `123456` ou `admin`

?? **[Guia Completo ?](INICIO-RAPIDO.md)**

---

## ??? Arquitetura

```
????????????????????????????
?        React UI          ?  ? Interface, UX, anima��es
?   (WebView2 / SPA)       ?
????????????????????????????
           ? HTTP
????????????????????????????
?  Backend Local .NET 10   ?  ? API REST + Hardware
?  (Desktop Host WPF)      ?
????????????????????????????
?   Controllers            ?
?   Services               ?
?   Hardware Integration   ?
????????????????????????????
           ? HTTPS
????????????????????????????
?   API na Nuvem           ?  ? Regra de neg�cio
????????????????????????????
```

## ?? Tecnologias

### Backend (.NET 10)
- **WPF** - Host principal
- **WebView2** - Renderiza React
- **ASP.NET Core** - API local (localhost:5000)
- **Clean Architecture** - Separa��o de responsabilidades

### Frontend (React)
- **React 18** - UI moderna
- **TypeScript** - Type safety
- **Vite** - Build tool r�pido
- **TailwindCSS** - Estiliza��o
- **React Router** - Navega��o
- **Axios** - HTTP client

## ?? Como Executar

### 1?? Backend (.NET)

No Visual Studio:

```bash
# Restaurar pacotes (se necess�rio)
dotnet restore

# Executar (F5)
```

A aplica��o vai:
1. Iniciar API local em `http://localhost:5000`
2. Abrir janela WPF com WebView2
3. Carregar React de `http://localhost:5173`

### 2?? Frontend (React)

Em um terminal separado, na pasta `frontend-react`:

```bash
# Instalar depend�ncias (primeira vez)
npm install

# Iniciar dev server
npm run dev
```

O Vite vai subir em `http://localhost:5173`

## ?? Fluxo de Uso

1. **Login** ? Senha: `admin`
2. **Tela de Acesso** ? Digite credencial
3. **Teste com**:
   - `123456` ? Acesso liberado
   - `admin` ? Acesso liberado
   - Qualquer outro ? Acesso negado
4. **Sistema valida** ? Exibe resultado
5. **Catraca abre** ? Se permitido

## ?? Estrutura de Arquivos

```
Gym.Net/
??? Controllers/
?   ??? AccessController.cs       # API de acesso
??? MainWindow.xaml               # UI principal
??? MainWindow.xaml.cs            # L�gica WebView2
??? App.xaml.cs                   # Inicializa��o API + WPF
??? Gym.Net.csproj

frontend-react/
??? src/
?   ??? components/
?   ?   ??? Button.tsx
?   ?   ??? Card.tsx
?   ??? pages/
?   ?   ??? Login.tsx
?   ?   ??? AccessControl.tsx
?   ??? services/
?   ?   ??? api.ts                # Cliente HTTP
?   ??? types/
?   ?   ??? index.ts
?   ??? App.tsx
?   ??? main.tsx
?   ??? index.css
??? package.json
??? vite.config.ts
??? tailwind.config.js
```

## ?? Endpoints da API

### `POST /api/access/validate`
Valida credencial de acesso

```json
{
  "credential": "123456",
  "type": "rfid"
}
```

**Response:**
```json
{
  "success": true,
  "allowAccess": true,
  "memberName": "Jo�o Silva",
  "memberId": "M-001",
  "photo": "https://...",
  "message": "Acesso liberado!",
  "plan": "Premium - Ativo",
  "expiresAt": "2024-06-15T00:00:00"
}
```

### `POST /api/access/open-gate`
Abre a catraca

### `GET /api/access/status`
Status do sistema e dispositivos

## ?? Features Implementadas

? Login com autentica��o  
? Valida��o de acesso em tempo real  
? Feedback visual (sucesso/negado)  
? Foto do membro  
? Status de conex�o  
? Estat�sticas b�sicas  
? Design responsivo  
? Anima��es suaves  

## ?? Pr�ximos Passos

1. **Integra��o Hardware**
   - Adicionar drivers de catraca
   - Implementar leitor RFID
   - Integrar FaceID

2. **Integra��o Cloud**
   - Conectar com API na nuvem
   - Sincroniza��o de dados
   - Cache offline

3. **Melhorias**
   - Hist�rico de acessos
   - Relat�rios
   - Configura��es
   - Multi-idioma

## ?? Licen�a

Projeto propriet�rio - Gym.Net � 2024
