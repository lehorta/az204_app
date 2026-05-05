# 📦 Guia de Criação do Instalador - SisBurpee

Este guia explica como gerar o instalador profissional do SisBurpee para distribuição.

## 🎯 Visão Geral

O sistema de instalação do SisBurpee utiliza:
- **Publicação .NET**: Gera binários otimizados e self-contained
- **Inno Setup**: Cria instalador Windows professional (.exe)
- **WebView2 Runtime**: Incluído automaticamente no instalador
- **Automação PowerShell**: Scripts automatizados para todo o processo

## 📋 Pré-requisitos

### 1. Ferramentas Necessárias

- ✅ .NET 10.0 SDK instalado
- ✅ Node.js e npm instalados (para compilar o frontend)
- ✅ **Inno Setup 6.0+** - [Download aqui](https://jrsoftware.org/isdl.php)

### 2. Instalação do Inno Setup

1. Baixe o Inno Setup do site oficial
2. Execute o instalador
3. Siga as instruções de instalação
4. Instale no caminho padrão: `C:\Program Files (x86)\Inno Setup 6\`

## 🚀 Gerando o Instalador

### Método Rápido (Recomendado)

Execute o script automatizado que faz tudo:

```powershell
.\build-installer.ps1
```

Este script irá:
1. ✅ Compilar o frontend React
2. ✅ Publicar a aplicação .NET
3. ✅ Criar o instalador Windows

### Método Passo a Passo

Se preferir executar cada etapa manualmente:

#### 1. Compilar o Frontend
```powershell
cd frontend-react
npm install
npm run build
cd ..
```

#### 2. Publicar a Aplicação .NET
```powershell
.\publish.ps1
```

#### 3. Gerar o Instalador
```powershell
"C:\Program Files (x86)\Inno Setup 6\ISCC.exe" installer.iss
```

## ⚙️ Opções Avançadas

### Customizar o Script de Publicação

```powershell
# Publicação em modo Debug
.\publish.ps1 -Configuration Debug

# Especificar runtime diferente
.\publish.ps1 -Runtime win-x86

# Publicação não self-contained (requer .NET instalado)
.\publish.ps1 -SelfContained:$false
```

### Customizar o Build do Instalador

```powershell
# Pular compilação do frontend (se já estiver compilado)
.\build-installer.ps1 -SkipFrontend

# Pular publicação .NET (se já estiver publicado)
.\build-installer.ps1 -SkipPublish

# Especificar caminho customizado do Inno Setup
.\build-installer.ps1 -InnoSetupPath "D:\MeuCaminho\ISCC.exe"
```

## 📝 Customização do Instalador

### Editar Informações do Instalador

Edite o arquivo `installer.iss` para customizar:

```pascal
#define MyAppName "Gym.Net"
#define MyAppVersion "1.0.0"          ; 👈 Versão da aplicação
#define MyAppPublisher "Gym.Net Team" ; 👈 Nome da empresa
#define MyAppURL "https://gym.net"    ; 👈 Website
```

### Adicionar Ícone Customizado

1. Crie ou obtenha um arquivo `.ico` com o ícone da aplicação
2. Salve como `icon.ico` na raiz do projeto
3. Descomente a linha no `installer.iss`:
```pascal
SetupIconFile=icon.ico
```

### Adicionar Licença

1. Crie um arquivo `LICENSE.txt` na raiz do projeto
2. Descomente a linha no `installer.iss`:
```pascal
LicenseFile=LICENSE.txt
```

### Mensagens em Português

O instalador já está configurado para usar português brasileiro como idioma padrão:
```pascal
[Languages]
Name: "brazilianportuguese"; MessagesFile: "compiler:Languages\BrazilianPortuguese.isl"
```

## 📦 Resultado

Após a execução bem-sucedida, você encontrará:

```
installer-output/
  └── SisBurpee-Setup-1.0.0.exe  👈 Instalador final
```

### Características do Instalador

✅ Interface moderna e profissional  
✅ Instalação em `C:\Program Files\SisBurpee`  
✅ Ícones no Menu Iniciar  
✅ Opção de ícone na Área de Trabalho  
✅ Desinstalador automático  
✅ Suporte para Windows 10/11 (64-bit)  
✅ Compressão LZMA2 ultra (instalador menor)  
✅ Self-contained (não requer .NET instalado)  

## 🧪 Testando o Instalador

### Checklist de Testes

1. ✅ Execute o instalador em uma máquina limpa (VM recomendada)
2. ✅ Verifique se o instalador solicita privilégios de administrador
3. ✅ Confirme a criação dos ícones no Menu Iniciar
4. ✅ Teste a execução da aplicação
5. ✅ Verifique se todos os recursos funcionam
6. ✅ Teste o desinstalador

### Máquinas Virtuais para Teste

Recomendado testar em:
- Windows 10 (64-bit) - clean install
- Windows 11 (64-bit) - clean install

## 🔧 Solução de Problemas

### Erro: "Inno Setup não encontrado"

**Solução:**
```powershell
# Especifique o caminho manualmente
.\build-installer.ps1 -InnoSetupPath "C:\Seu\Caminho\ISCC.exe"
```

### Erro: "Pasta publish não encontrada"

**Solução:**
```powershell
# Execute a publicação manualmente primeiro
.\publish.ps1
```

### Erro na Compilação do Frontend

**Solução:**
```powershell
cd frontend-react
rm -r node_modules
npm install
npm run build
```

### Instalador muito grande

**Soluções:**
1. Use publicação não self-contained (requer .NET no cliente)
2. Otimize a compilação React para produção
3. Remova dependências desnecessárias

## 📊 Estrutura de Arquivos

```
Gym.Net/
├── publish.ps1              # Script de publicação .NET
├── installer.iss            # Script do Inno Setup
├── build-installer.ps1      # Script automatizado completo
├── INSTALADOR.md           # Este guia
├── publish/                # (gerado) Binários publicados
│   └── Gym.Net.exe
└── installer-output/       # (gerado) Instalador final
    └── GymNet-Setup-1.0.0.exe
```

## 🚢 Distribuição

### Onde Hospedar o Instalador

Opções para distribuir seu instalador:

1. **GitHub Releases** - Gratuito para projetos open source
2. **Google Drive / OneDrive** - Fácil compartilhamento
3. **Website próprio** - Mais profissional
4. **Microsoft Store** - Para alcance maior (requer cadastro)

### Exemplo de Release no GitHub

```powershell
# Criar uma release no GitHub
gh release create v1.0.0 `
  .\installer-output\GymNet-Setup-1.0.0.exe `
  --title "Gym.Net v1.0.0" `
  --notes "Primeira versão estável"
```

## 📈 Versionamento

Siga o padrão Semantic Versioning:
- **MAJOR.MINOR.PATCH** (ex: 1.0.0)
- MAJOR: Mudanças incompatíveis
- MINOR: Novas funcionalidades compatíveis
- PATCH: Correções de bugs

Atualize a versão em:
1. `installer.iss` → `#define MyAppVersion`
2. `Gym.Net.csproj` → `<Version>`
3. `frontend-react/package.json` → `"version"`

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs de compilação
2. Consulte a documentação do Inno Setup
3. Revise este guia

---

**Última atualização:** Fevereiro 2026  
**Versão do guia:** 1.0.0
