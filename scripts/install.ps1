# ?? Script de Instalação - Gym.Net
Write-Host ""
Write-Host "???  Gym.Net - Instalação de Dependências" -ForegroundColor Cyan
Write-Host "??????????????????????????????????????????" -ForegroundColor DarkGray
Write-Host ""

$projectPath = "C:\ghr\Gym.net\Gym.Net"
$frontendPath = "$projectPath\frontend-react"

# Verifica se está na pasta correta
if (-not (Test-Path $projectPath)) {
    Write-Host "? Erro: Projeto não encontrado em $projectPath" -ForegroundColor Red
    pause
    exit
}

# 1. Restaurar pacotes .NET
Write-Host "?? [1/2] Instalando pacotes .NET..." -ForegroundColor Yellow
Write-Host ""
Set-Location $projectPath
dotnet restore

if ($LASTEXITCODE -eq 0) {
    Write-Host "? Pacotes .NET instalados com sucesso!" -ForegroundColor Green
} else {
    Write-Host "? Erro ao instalar pacotes .NET" -ForegroundColor Red
    pause
    exit
}

Write-Host ""
Write-Host "??????????????????????????????????????????" -ForegroundColor DarkGray
Write-Host ""

# 2. Instalar dependências React
Write-Host "?? [2/2] Instalando dependências React..." -ForegroundColor Yellow
Write-Host "   Isso pode levar alguns minutos..." -ForegroundColor Gray
Write-Host ""
Set-Location $frontendPath
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "? Dependências React instaladas com sucesso!" -ForegroundColor Green
} else {
    Write-Host "? Erro ao instalar dependências React" -ForegroundColor Red
    pause
    exit
}

Set-Location $projectPath

Write-Host ""
Write-Host "??????????????????????????????????????????" -ForegroundColor DarkGray
Write-Host ""
Write-Host "?? Instalação concluída com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "?? Próximos passos:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   1??  Abra um novo terminal e execute:" -ForegroundColor White
Write-Host "       .\start-frontend.ps1" -ForegroundColor Yellow
Write-Host ""
Write-Host "   2??  No Visual Studio, pressione F5" -ForegroundColor White
Write-Host ""
Write-Host "?? Credenciais de teste:" -ForegroundColor Cyan
Write-Host "   • Login: admin" -ForegroundColor White
Write-Host "   • Acesso: 123456 ou admin" -ForegroundColor White
Write-Host ""
Write-Host "??????????????????????????????????????????" -ForegroundColor DarkGray
Write-Host ""
pause
