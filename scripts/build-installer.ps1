# Script Completo de Build e Criacao do Instalador
# Automatiza todo o processo de geracao do instalador do SisBurpee

param(
    [switch]$SkipFrontend,
    [switch]$SkipPublish,
    [switch]$SkipInstaller,
    [string]$InnoSetupPath = "C:\Program Files (x86)\Inno Setup 6\ISCC.exe"
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host "            SISBURPEE - GERADOR DE INSTALADOR                " -ForegroundColor Cyan

# Funcao para exibir etapas
function Write-Step {
    param([string]$Message)
    Write-Host ""
    Write-Host "> $Message" -ForegroundColor Yellow
    Write-Host ("=" * 60) -ForegroundColor DarkGray
}

# 1. BUILD DO FRONTEND REACT
if (-not $SkipFrontend) {
    Write-Step "1/3 - Compilando Frontend React"
    
    if (Test-Path ".\frontend-react") {
        Push-Location ".\frontend-react"
        
        # Verificar se o node_modules existe
        if (-not (Test-Path "node_modules")) {
            Write-Host "[INFO] Instalando dependencias npm..." -ForegroundColor Cyan
            npm install
            if ($LASTEXITCODE -ne 0) {
                Write-Host "[ERRO] Erro ao instalar dependencias!" -ForegroundColor Red
                Pop-Location
                exit 1
            }
        }
        
        # Build do frontend
        Write-Host "[INFO] Construindo frontend..." -ForegroundColor Cyan
        npm run build
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[ERRO] Erro ao compilar frontend!" -ForegroundColor Red
            Pop-Location
            exit 1
        }
        
        Write-Host "[OK] Frontend compilado com sucesso!" -ForegroundColor Green

        # Validar artefatos do frontend
        $frontendIndex = Join-Path (Get-Location) "dist\index.html"
        if (-not (Test-Path $frontendIndex)) {
            Write-Host "[ERRO] Build do frontend concluido, mas dist\\index.html nao foi encontrado!" -ForegroundColor Red
            Pop-Location
            exit 1
        }

        Pop-Location
    } else {
        Write-Host "[AVISO] Pasta frontend-react nao encontrada. Pulando..." -ForegroundColor Yellow
    }
} else {
    Write-Host "[INFO] Pulando build do frontend" -ForegroundColor Gray
}

# 2. PUBLICACAO DO .NET
if (-not $SkipPublish) {
    Write-Step "2/3 - Publicando Aplicacao .NET"
    
    # Executar script de publicacao
    .\publish.ps1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERRO] Erro na publicacao!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "[INFO] Pulando publicacao .NET" -ForegroundColor Gray
}

# 2.5. BAIXAR WEBVIEW2 BOOTSTRAPPER
Write-Step "2.5/3 - Baixando WebView2 Runtime"

# Verificar se ja existe
if (Test-Path ".\webview2\MicrosoftEdgeWebview2Setup.exe") {
    Write-Host "[INFO] WebView2 Bootstrapper ja existe. Pulando download..." -ForegroundColor Cyan
} else {
    # Executar script de download
    .\download-webview2.ps1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERRO] Erro ao baixar WebView2!" -ForegroundColor Red
        exit 1
    }
}

# 3. CRIACAO DO INSTALADOR
if (-not $SkipInstaller) {
    Write-Step "3/3 - Gerando Instalador Windows"
    
    # Verificar se o Inno Setup esta instalado
    if (-not (Test-Path $InnoSetupPath)) {
        Write-Host "`n[ERRO] Inno Setup nao encontrado em: $InnoSetupPath" -ForegroundColor Red
        Write-Host "`n[INFO] Para criar o instalador, voce precisa:" -ForegroundColor Yellow
        Write-Host "   1. Baixar o Inno Setup: https://jrsoftware.org/isdl.php" -ForegroundColor Gray
        Write-Host "   2. Instalar no caminho padrao ou especificar com -InnoSetupPath" -ForegroundColor Gray
        Write-Host "`n[DICA] Exemplo:" -ForegroundColor Cyan
        Write-Host '   .\build-installer.ps1 -InnoSetupPath "C:\Seu\Caminho\ISCC.exe"' -ForegroundColor Gray
        
        # Oferecer para abrir a pagina de download
        $response = Read-Host "`nDeseja abrir a pagina de download do Inno Setup? (S/N)"
        if ($response -eq 'S' -or $response -eq 's') {
            Start-Process "https://jrsoftware.org/isdl.php"
        }
        exit 1
    }
    
    # Compilar o script do Inno Setup
    Write-Host "[INFO] Compilando instalador com Inno Setup..." -ForegroundColor Cyan
    & $InnoSetupPath "installer.iss"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Instalador criado com sucesso!" -ForegroundColor Green
        
        # Mostrar informacoes do instalador
        if (Test-Path ".\installer-output") {
            $installerFiles = Get-ChildItem ".\installer-output" -Filter "*.exe"
            if ($installerFiles) {
                Write-Host "`n[INFO] Instalador gerado:" -ForegroundColor Cyan
                foreach ($file in $installerFiles) {
                    $sizeMB = [math]::Round($file.Length / 1MB, 2)
                    Write-Host "   - $($file.Name)" -ForegroundColor White
                    Write-Host "   - Tamanho: $sizeMB MB" -ForegroundColor Gray
                    Write-Host "   - Local: $($file.FullName)" -ForegroundColor Gray
                }
            }
        }
    } else {
        Write-Host "[ERRO] Erro ao criar instalador!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "[INFO] Pulando criacao do instalador" -ForegroundColor Gray
}

# RESUMO FINAL
Write-Host ""
Write-Host "==============================================================" -ForegroundColor Green
Write-Host "                 PROCESSO CONCLUIDO!                          " -ForegroundColor Green
Write-Host "==============================================================" -ForegroundColor Green
Write-Host ""

Write-Host "[OK] Instalador do SisBurpee gerado com sucesso!" -ForegroundColor Green
Write-Host "`n[INFO] Proximos passos:" -ForegroundColor Cyan
Write-Host "   1. Teste o instalador em uma maquina limpa" -ForegroundColor Gray
Write-Host "   2. Verifique se todos os recursos funcionam corretamente" -ForegroundColor Gray
Write-Host "   3. Distribua o instalador para seus usuarios" -ForegroundColor Gray
Write-Host ""
