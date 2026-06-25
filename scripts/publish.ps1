# Script de Publicacao do SisBurpee
# Gera os binarios otimizados da aplicacao

param(
    [string]$Configuration = "Release",
    [string]$Runtime = "win-x64",
    [switch]$SelfContained = $true
)

Write-Host "[INFO] Publicando SisBurpee..." -ForegroundColor Cyan
Write-Host "Configuracao: $Configuration" -ForegroundColor Gray
Write-Host "Runtime: $Runtime" -ForegroundColor Gray
Write-Host "Self-Contained: $SelfContained" -ForegroundColor Gray
Write-Host ""

# Limpar publicacoes anteriores
Write-Host "[INFO] Limpando publicacoes anteriores..." -ForegroundColor Yellow
if (Test-Path ".\publish") {
    Remove-Item -Path ".\publish" -Recurse -Force
}

# Publicar a aplicacao
Write-Host "[INFO] Publicando aplicacao .NET..." -ForegroundColor Yellow
dotnet publish `
    --configuration $Configuration `
    --runtime $Runtime `
    --self-contained:$SelfContained `
    --output ".\publish" `
    /p:PublishSingleFile=false `
    /p:PublishReadyToRun=true `
    /p:IncludeNativeLibrariesForSelfExtract=true

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Publicacao concluida com sucesso!" -ForegroundColor Green
    Write-Host "[INFO] Arquivos em: $(Resolve-Path '.\publish')" -ForegroundColor Cyan
    
    # Listar arquivos principais
    Write-Host "`n[INFO] Arquivos principais:" -ForegroundColor Cyan
    Get-ChildItem ".\publish" -Filter "*.exe" | ForEach-Object {
        Write-Host "   - $($_.Name) ($([math]::Round($_.Length / 1MB, 2)) MB)" -ForegroundColor Gray
    }
} else {
    Write-Host "[ERRO] Erro na publicacao!" -ForegroundColor Red
    exit 1
}
