# Script de Geração de Imagens para o Instalador Gym.Net
# Este script cria as imagens padrão se não existirem
# Requisitos: Windows PowerShell 5.0+

param(
    [switch]$Force,
    [string]$ImagemWizard,
    [string]$ImagemIcon,
    [string]$ImagemSmall
)

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   Gerador de Imagens do Instalador Gym.Net" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$OutputDir = $ScriptDir

Write-Host "📂 Pasta: $OutputDir" -ForegroundColor Yellow
Write-Host ""

# Validar se Python está disponível
$PythonAvailable = $null
try {
    $PythonAvailable = python --version 2>&1
    Write-Host "✅ Python encontrado: $PythonAvailable" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Python não encontrado" -ForegroundColor Yellow
}

# Se Python estiver disponível, usar o script Python
if ($PythonAvailable) {
    Write-Host ""
    Write-Host "Usando Python para gerar imagens..." -ForegroundColor Cyan
    
    $PythonScript = Join-Path $ScriptDir "generate-images.py"
    
    if (Test-Path $PythonScript) {
        python $PythonScript
        exit
    } else {
        Write-Host "⚠️  generate-images.py não encontrado" -ForegroundColor Yellow
    }
}

# Fallback: Usar apenas PowerShell
Write-Host "Usando PowerShell para gerar imagens padrão..." -ForegroundColor Yellow
Write-Host ""

# Verificar se Pillow será necessário
Write-Host "📝 Criando imagens padrão..." -ForegroundColor Cyan
Write-Host ""

$IconPath = Join-Path $OutputDir "icon.ico"
$WizardPath = Join-Path $OutputDir "wizard-image.bmp"
$SmallPath = Join-Path $OutputDir "wizard-small-image.bmp"

# Verificar se as imagens já existem
if ((Test-Path $IconPath) -and -not $Force) {
    Write-Host "⏭️  icon.ico já existe" -ForegroundColor Yellow
} else {
    Write-Host "Criando icon.ico..."
    # PowerShell puro não consegue criar imagens facilmente
    # Mostraremmos instruções ao usuário
}

if ((Test-Path $WizardPath) -and -not $Force) {
    Write-Host "⏭️  wizard-image.bmp já existe" -ForegroundColor Yellow
} else {
    Write-Host "Criando wizard-image.bmp (164x386)..."
}

if ((Test-Path $SmallPath) -and -not $Force) {
    Write-Host "⏭️  wizard-small-image.bmp já existe" -ForegroundColor Yellow
} else {
    Write-Host "Criando wizard-small-image.bmp (55x55)..."
}

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "⚠️  INSTRUÇÕES:" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Instale Python: https://python.org/downloads" -ForegroundColor White
Write-Host "2. Execute: pip install pillow" -ForegroundColor White
Write-Host "3. Execute este script novamente" -ForegroundColor White
Write-Host ""
Write-Host "OU crie as imagens manualmente:" -ForegroundColor Cyan
Write-Host ""
Write-Host "📄 icon.ico (32×32 px):" -ForegroundColor White
Write-Host "   - Use o Paint do Windows" -ForegroundColor Gray
Write-Host "   - Ou Canva: https://canva.com" -ForegroundColor Gray
Write-Host ""
Write-Host "🎨 wizard-image.bmp (164×386 px):" -ForegroundColor White
Write-Host "   - Imagem com tema de academia" -ForegroundColor Gray
Write-Host "   - Screenshots do sistema" -ForegroundColor Gray
Write-Host "   - Gradiente de cores" -ForegroundColor Gray
Write-Host ""
Write-Host "🔷 wizard-small-image.bmp (55×55 px):" -ForegroundColor White
Write-Host "   - Ícone pequeno da marca" -ForegroundColor Gray
Write-Host ""
Write-Host "📖 Leia: PERSONALIZAR-INSTALADOR.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
