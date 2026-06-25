# Script para iniciar a aplicação SisBurpee em modo de desenvolvimento
# Execute com: .\start-dev.ps1

Write-Host "🚀 Iniciando SisBurpee - Aplicação Completa" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# Função para iniciar o backend
function Start-Backend {
    Write-Host "🔧 Iniciando Backend (.NET)..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '🔧 Backend .NET' -ForegroundColor Cyan; dotnet run --project Gym.Net.csproj"
}

# Função para iniciar o frontend
function Start-Frontend {
    Write-Host "⚛️  Iniciando Frontend (React + Vite)..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '⚛️  Frontend React' -ForegroundColor Cyan; Set-Location frontend-react; npm run dev"
}

# Menu de opções
Write-Host "Escolha uma opção:" -ForegroundColor Yellow
Write-Host "1 - Iniciar TUDO (Backend + Frontend)" -ForegroundColor White
Write-Host "2 - Iniciar apenas Backend (.NET)" -ForegroundColor White
Write-Host "3 - Iniciar apenas Frontend (React)" -ForegroundColor White
Write-Host "4 - Sair" -ForegroundColor White
Write-Host ""

$opcao = Read-Host "Digite o número da opção"

switch ($opcao) {
    "1" {
        Write-Host ""
        Write-Host "🚀 Iniciando aplicação completa..." -ForegroundColor Green
        Start-Backend
        Start-Sleep -Seconds 2
        Start-Frontend
        Write-Host ""
        Write-Host "✅ Aplicação iniciada com sucesso!" -ForegroundColor Green
        Write-Host "📍 Backend: http://localhost:5001" -ForegroundColor Yellow
        Write-Host "📍 Frontend: http://localhost:5177" -ForegroundColor Yellow
    }
    "2" {
        Write-Host ""
        Start-Backend
        Write-Host ""
        Write-Host "✅ Backend iniciado!" -ForegroundColor Green
        Write-Host "📍 URL: http://localhost:5001" -ForegroundColor Yellow
    }
    "3" {
        Write-Host ""
        Start-Frontend
        Write-Host ""
        Write-Host "✅ Frontend iniciado!" -ForegroundColor Green
        Write-Host "📍 URL: http://localhost:5177" -ForegroundColor Yellow
    }
    "4" {
        Write-Host "👋 Até logo!" -ForegroundColor Yellow
        exit
    }
    default {
        Write-Host "❌ Opção inválida!" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Pressione qualquer tecla para fechar esta janela..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
