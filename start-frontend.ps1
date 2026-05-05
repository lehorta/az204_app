# ?? Script para Iniciar Frontend React
Write-Host ""
Write-Host "🌐  SisBurpee - Iniciando Frontend React" -ForegroundColor Cyan
Write-Host "???????????????????????????????????????" -ForegroundColor DarkGray
Write-Host ""

$frontendPath = "C:\ghr\Gym.net\Gym.Net\frontend-react"

if (Test-Path $frontendPath) {
    Write-Host "? Pasta encontrada: $frontendPath" -ForegroundColor Green
    Write-Host ""
    Set-Location $frontendPath
    
    Write-Host "?? Iniciando servidor Vite..." -ForegroundColor Yellow
    Write-Host "   URL: http://localhost:5173" -ForegroundColor White
    Write-Host ""
    Write-Host "?? Dica: Deixe este terminal aberto!" -ForegroundColor Cyan
    Write-Host "   Pressione Ctrl+C para parar o servidor" -ForegroundColor Gray
    Write-Host ""
    Write-Host "???????????????????????????????????????" -ForegroundColor DarkGray
    Write-Host ""
    
    npm run dev
} else {
    Write-Host "? Erro: Pasta n�o encontrada!" -ForegroundColor Red
    Write-Host "   Esperado: $frontendPath" -ForegroundColor Gray
    Write-Host ""
    Write-Host "?? Execute este script da raiz do projeto" -ForegroundColor Yellow
    pause
}
