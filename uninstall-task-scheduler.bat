@echo off
REM Stand By Scheduler - Windows Task Scheduler Uninstallation Script

echo ========================================
echo Stand By Scheduler - Task Uninstaller
echo ========================================
echo.

REM Check for admin rights
net session >nul 2>&1
if %errorLevel% NEQ 0 (
    echo [ERROR] This script requires Administrator privileges!
    echo Please right-click and select "Run as Administrator"
    pause
    exit /b 1
)

REM Check if task exists
schtasks /query /tn "StandByScheduler" >nul 2>&1
if %errorLevel% NEQ 0 (
    echo [WARN] Task 'StandByScheduler' is not installed.
    pause
    exit /b 0
)

echo [INFO] Task found. Uninstalling...
echo.

REM Stop running instance (if any)
echo [INFO] Stopping any running instances...
taskkill /f /im bun.exe /fi "WINDOWTITLE eq *stand-by-schedule*" >nul 2>&1

timeout /t 2 /nobreak >nul

REM Delete the task
echo [INFO] Removing scheduled task...
schtasks /delete /tn "StandByScheduler" /f

echo.
echo ========================================
echo Uninstallation Complete!
echo ========================================
echo.
echo The scheduled task has been removed.
echo Log files in 'logs' folder are preserved.
echo.
pause
