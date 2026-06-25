@echo off
cls
REM ===============================================
REM Gerador de Imagens - Instalador Gym.Net
REM Para Windows PowerShell
REM ===============================================

title Gerador de Imagens Gym.Net

color 0A
echo.
echo ===============================================
echo   Gerador de Imagens do Instalador Gym.Net
echo ===============================================
echo.
echo Verificando Python...
echo.

REM Verificar se Python está instalado
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Python encontrado!
    echo.
    echo Executando generate-images.py...
    echo.
    python generate-images.py
) else (
    echo [ERRO] Python nao encontrado!
    echo.
    echo Opcoes:
    echo  1. Instale Python: https://python.org/downloads
    echo.
    echo OU crie as imagens manualmente:
    echo.
    echo  1. wizard-image.bmp (164x386) - Paint do Windows
    echo  2. wizard-small-image.bmp (55x55) - Paint do Windows
    echo  3. icon.ico (32x32) - Canva.com ou Paint
    echo.
    echo Mais detalhes em: README.md
    echo.
    pause
)
