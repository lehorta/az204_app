# ?? Como Iniciar a Aplicação Gym.Net

Este guia contém todas as formas de iniciar a aplicação de desenvolvimento.

## ?? Scripts Disponíveis

### 1. **start-dev.ps1** (Recomendado para Windows/PowerShell)
Script interativo com menu de opções.

```powershell
.\start-dev.ps1
```

**Opções:**
- `1` - Iniciar Backend + Frontend juntos
- `2` - Iniciar apenas Backend (.NET)
- `3` - Iniciar apenas Frontend (React)
- `4` - Sair

### 2. **start-dev.bat** (Para Prompt de Comando)
Versão batch do script interativo.

```cmd
start-dev.bat
```

### 3. **Scripts Rápidos** (Sem menu)

#### Iniciar apenas Backend:
```powershell
.\start-backend.ps1
```

#### Iniciar apenas Frontend:
```powershell
.\start-frontend.ps1
```

## ?? URLs da Aplicação

Após iniciar, acesse:

- **Frontend React**: http://localhost:5173
- **Backend .NET**: http://localhost:5000
- **API Backend**: http://localhost:5000/api

## ?? Comandos Manuais

Se preferir executar manualmente:

### Backend (.NET)
```powershell
dotnet run --project Gym.Net.csproj
```

### Frontend (React)
```powershell
cd frontend-react
npm run dev
```

## ?? Requisitos

Certifique-se de ter instalado:
- ? .NET SDK 10 ou superior
- ? Node.js 18+ e npm
- ? Dependências instaladas (`npm install` no frontend-react)

## ??? Troubleshooting

### Erro de Política de Execução (PowerShell)
Se receber erro ao executar `.ps1`, execute:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Portas em Uso
Se as portas estiverem ocupadas:
- Backend: Altere em `Properties/launchSettings.json`
- Frontend: Altere em `frontend-react/vite.config.ts`

### Dependências não instaladas
```powershell
# Frontend
cd frontend-react
npm install

# Backend (se necessário)
dotnet restore
```

## ?? Dica Rápida

Para desenvolvimento diário, use:
```powershell
.\start-dev.ps1
# Escolha opção 1 para iniciar tudo
```

---

**Gym.Net** - Sistema de Gerenciamento de Academia
