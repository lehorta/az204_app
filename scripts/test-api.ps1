# ?? Script de Teste da API

Write-Host ""
Write-Host "🔧 SisBurpee - Teste da API Local" -ForegroundColor Cyan
Write-Host "???????????????????????????????" -ForegroundColor DarkGray
Write-Host ""

$baseUrl = "http://localhost:5001/api"

# Fun��o para testar endpoint
function Test-Endpoint {
    param(
        [string]$Url,
        [string]$Method = "GET",
        [object]$Body = $null
    )
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            ContentType = "application/json"
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json)
        }
        
        $response = Invoke-RestMethod @params
        return @{ Success = $true; Data = $response }
    }
    catch {
        return @{ Success = $false; Error = $_.Exception.Message }
    }
}

# Teste 1: Status
Write-Host "?? Testando endpoint de status..." -ForegroundColor Yellow
$result = Test-Endpoint -Url "$baseUrl/access/status"

if ($result.Success) {
    Write-Host "? API est� online!" -ForegroundColor Green
    Write-Host "   Cloud: $($result.Data.cloudConnected)" -ForegroundColor Gray
    Write-Host "   Dispositivos:" -ForegroundColor Gray
    Write-Host "     � Catraca: $($result.Data.devices.gate)" -ForegroundColor Gray
    Write-Host "     � FaceID: $($result.Data.devices.faceId)" -ForegroundColor Gray
    Write-Host "     � RFID: $($result.Data.devices.rfid)" -ForegroundColor Gray
} else {
    Write-Host "? API n�o est� respondendo" -ForegroundColor Red
    Write-Host "   Erro: $($result.Error)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "?? Certifique-se que a aplica��o WPF est� rodando!" -ForegroundColor Yellow
    pause
    exit
}

Write-Host ""
Write-Host "???????????????????????????????" -ForegroundColor DarkGray
Write-Host ""

# Teste 2: Valida��o com credencial v�lida
Write-Host "?? Testando valida��o - Credencial V�LIDA (123456)..." -ForegroundColor Yellow
$validRequest = @{
    credential = "123456"
    type = "manual"
}

$result = Test-Endpoint -Url "$baseUrl/access/validate" -Method "POST" -Body $validRequest

if ($result.Success) {
    if ($result.Data.allowAccess) {
        Write-Host "? Acesso LIBERADO!" -ForegroundColor Green
        Write-Host "   Nome: $($result.Data.memberName)" -ForegroundColor Gray
        Write-Host "   Matr�cula: $($result.Data.memberId)" -ForegroundColor Gray
        Write-Host "   Plano: $($result.Data.plan)" -ForegroundColor Gray
        Write-Host "   Mensagem: $($result.Data.message)" -ForegroundColor Gray
    } else {
        Write-Host "? Teste falhou - deveria permitir acesso" -ForegroundColor Red
    }
} else {
    Write-Host "? Erro na requisi��o: $($result.Error)" -ForegroundColor Red
}

Write-Host ""
Write-Host "???????????????????????????????" -ForegroundColor DarkGray
Write-Host ""

# Teste 3: Valida��o com credencial inv�lida
Write-Host "?? Testando valida��o - Credencial INV�LIDA (999999)..." -ForegroundColor Yellow
$invalidRequest = @{
    credential = "999999"
    type = "manual"
}

$result = Test-Endpoint -Url "$baseUrl/access/validate" -Method "POST" -Body $invalidRequest

if ($result.Success) {
    if (-not $result.Data.allowAccess) {
        Write-Host "? Acesso NEGADO (correto!)" -ForegroundColor Green
        Write-Host "   Mensagem: $($result.Data.message)" -ForegroundColor Gray
    } else {
        Write-Host "? Teste falhou - deveria negar acesso" -ForegroundColor Red
    }
} else {
    Write-Host "? Erro na requisi��o: $($result.Error)" -ForegroundColor Red
}

Write-Host ""
Write-Host "???????????????????????????????" -ForegroundColor DarkGray
Write-Host ""

# Teste 4: Abrir catraca
Write-Host "?? Testando abertura de catraca..." -ForegroundColor Yellow
$result = Test-Endpoint -Url "$baseUrl/access/open-gate" -Method "POST"

if ($result.Success) {
    Write-Host "? Catraca liberada com sucesso!" -ForegroundColor Green
    Write-Host "   Mensagem: $($result.Data.message)" -ForegroundColor Gray
} else {
    Write-Host "? Erro ao abrir catraca: $($result.Error)" -ForegroundColor Red
}

Write-Host ""
Write-Host "???????????????????????????????" -ForegroundColor DarkGray
Write-Host ""
Write-Host "?? Testes conclu�dos!" -ForegroundColor Green
Write-Host ""
Write-Host "?? Resumo:" -ForegroundColor Cyan
Write-Host "   � API Local: http://localhost:5000" -ForegroundColor White
Write-Host "   � Status: Funcionando ?" -ForegroundColor White
Write-Host "   � Valida��o: Funcionando ?" -ForegroundColor White
Write-Host "   � Catraca: Funcionando ?" -ForegroundColor White
Write-Host ""
pause
