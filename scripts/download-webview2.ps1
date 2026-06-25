# Script para baixar o WebView2 Bootstrapper
# Este arquivo sera incluido no instalador para instalar o WebView2 automaticamente

param(
    [string]$OutputPath = ".\webview2"
)

Write-Host "[INFO] Baixando WebView2 Runtime Bootstrapper..." -ForegroundColor Cyan

# Criar diretorio se nao existir
if (-not (Test-Path $OutputPath)) {
    New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
}

$bootstrapperUrl = "https://go.microsoft.com/fwlink/p/?LinkId=2124703"
$bootstrapperPath = Join-Path $OutputPath "MicrosoftEdgeWebview2Setup.exe"

try {
    # Baixar o bootstrapper
    Invoke-WebRequest -Uri $bootstrapperUrl -OutFile $bootstrapperPath -UseBasicParsing
    
    if (Test-Path $bootstrapperPath) {
        $sizeKB = [math]::Round((Get-Item $bootstrapperPath).Length / 1KB, 2)
        Write-Host "[OK] WebView2 Bootstrapper baixado com sucesso!" -ForegroundColor Green
        Write-Host "[INFO] Arquivo: $bootstrapperPath" -ForegroundColor Gray
        Write-Host "[INFO] Tamanho: $sizeKB KB" -ForegroundColor Gray
    } else {
        Write-Host "[ERRO] Falha ao baixar o bootstrapper!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "[ERRO] Erro ao baixar: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[INFO] O bootstrapper sera incluido no instalador." -ForegroundColor Cyan
Write-Host "[INFO] Durante a instalacao, ele instalara o WebView2 automaticamente." -ForegroundColor Cyan
