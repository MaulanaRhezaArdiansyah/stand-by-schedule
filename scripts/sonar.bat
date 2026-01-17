@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   SonarCloud Analysis Runner
echo ========================================
echo.

:: Check if .env.local exists
if not exist "%~dp0..\.env.local" (
    echo [ERROR] .env.local file not found!
    echo.
    echo Please create .env.local in the project root with:
    echo   SONAR_TOKEN=your_token_here
    echo.
    exit /b 1
)

:: Load SONAR_TOKEN from .env.local
for /f "tokens=1,* delims==" %%a in ('type "%~dp0..\.env.local" ^| findstr "SONAR_TOKEN"') do (
    set "SONAR_TOKEN=%%b"
)

:: Check if token was loaded
if "%SONAR_TOKEN%"=="" (
    echo [ERROR] SONAR_TOKEN not found in .env.local!
    echo.
    exit /b 1
)

echo [OK] Token loaded from .env.local
echo [INFO] Running SonarCloud analysis...
echo.

:: Change to project root and run sonar
cd /d "%~dp0.."
call npx sonar-scanner -Dsonar.token=%SONAR_TOKEN%

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   Analysis completed successfully!
    echo   View results at: https://sonarcloud.io
    echo ========================================
) else (
    echo.
    echo [ERROR] Analysis failed with code %errorlevel%
)

endlocal
