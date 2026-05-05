@echo off
:: Script batch para iniciar a aplicação SisBurpee
:: Execute com: start-dev.bat

title SisBurpee - Inicializador
color 0A

echo.
echo ========================================
echo    SISBURPEE - Inicializador de Aplicacao
echo ========================================
echo.

echo Escolha uma opcao:
echo 1 - Iniciar TUDO (Backend + Frontend)
echo 2 - Iniciar apenas Backend (.NET)
echo 3 - Iniciar apenas Frontend (React)
echo 4 - Sair
echo.

set /p opcao="Digite o numero da opcao: "

if "%opcao%"=="1" goto :full
if "%opcao%"=="2" goto :backend
if "%opcao%"=="3" goto :frontend
if "%opcao%"=="4" goto :sair
goto :invalido

:full
echo.
echo [*] Iniciando aplicacao completa...
start "Backend .NET" cmd /k "dotnet run --project Gym.Net.csproj"
timeout /t 2 /nobreak >nul
start "Frontend React" cmd /k "cd frontend-react && npm run dev"
echo.
echo [OK] Aplicacao iniciada com sucesso!
echo [*] Backend: http://localhost:5000
echo [*] Frontend: http://localhost:5173
goto :fim

:backend
echo.
echo [*] Iniciando Backend (.NET)...
start "Backend .NET" cmd /k "dotnet run --project Gym.Net.csproj"
echo.
echo [OK] Backend iniciado!
echo [*] URL: http://localhost:5000
goto :fim

:frontend
echo.
echo [*] Iniciando Frontend (React)...
start "Frontend React" cmd /k "cd frontend-react && npm run dev"
echo.
echo [OK] Frontend iniciado!
echo [*] URL: http://localhost:5173
goto :fim

:invalido
echo.
echo [ERRO] Opcao invalida!
goto :fim

:sair
echo.
echo Ate logo!
exit

:fim
echo.
pause
