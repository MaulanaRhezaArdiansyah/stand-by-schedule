@echo off
REM Stand By Scheduler - Windows Task Scheduler Installation Script
REM This script creates a scheduled task that runs on system startup

echo ========================================
echo Stand By Scheduler - Task Installer
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

REM Get current directory
set SCRIPT_DIR=%~dp0
set PROJECT_DIR=%SCRIPT_DIR:~0,-1%

echo [INFO] Project directory: %PROJECT_DIR%
echo.

REM Check if Bun is installed
where bun >nul 2>&1
if %errorLevel% NEQ 0 (
    echo [ERROR] Bun is not installed or not in PATH!
    echo.
    echo Please install Bun first from: https://bun.sh
    echo.
    pause
    exit /b 1
)

echo [OK] Bun found
echo.

REM Get Bun path
for /f "tokens=*" %%i in ('where bun') do set BUN_PATH=%%i
echo [INFO] Bun path: %BUN_PATH%
echo.

REM Check if task already exists
schtasks /query /tn "StandByScheduler" >nul 2>&1
if %errorLevel% EQU 0 (
    echo [WARN] Task 'StandByScheduler' already exists!
    echo.
    set /p REINSTALL="Do you want to reinstall? (y/n): "
    if /i not "%REINSTALL%"=="y" (
        echo Installation cancelled.
        pause
        exit /b 0
    )
    echo.
    echo [INFO] Removing existing task...
    schtasks /delete /tn "StandByScheduler" /f
    timeout /t 2 /nobreak >nul
)

REM Create logs directory if not exists
if not exist "%PROJECT_DIR%\logs" (
    mkdir "%PROJECT_DIR%\logs"
    echo [INFO] Created logs directory
)

REM Create scheduled task
echo [INFO] Creating Windows Scheduled Task...
echo.

schtasks /create ^
  /tn "StandByScheduler" ^
  /tr "\"%BUN_PATH%\" run src/server/index.ts" ^
  /sc onstart ^
  /ru "SYSTEM" ^
  /rl highest ^
  /f ^
  /sd "%date%" ^
  /st 00:00

if %errorLevel% NEQ 0 (
    echo.
    echo [ERROR] Failed to create scheduled task!
    pause
    exit /b 1
)

REM Set working directory via XML update
echo [INFO] Configuring task settings...

REM Export task to XML
schtasks /query /tn "StandByScheduler" /xml > "%TEMP%\StandByScheduler.xml"

REM Create PowerShell script to update XML
echo $xml = [xml](Get-Content "%TEMP%\StandByScheduler.xml") > "%TEMP%\update-task.ps1"
echo $xml.Task.Actions.Exec.WorkingDirectory = "%PROJECT_DIR%" >> "%TEMP%\update-task.ps1"
echo $xml.Task.Settings.MultipleInstancesPolicy = "IgnoreNew" >> "%TEMP%\update-task.ps1"
echo $xml.Task.Settings.DisallowStartIfOnBatteries = "false" >> "%TEMP%\update-task.ps1"
echo $xml.Task.Settings.StopIfGoingOnBatteries = "false" >> "%TEMP%\update-task.ps1"
echo $xml.Task.Settings.ExecutionTimeLimit = "PT0S" >> "%TEMP%\update-task.ps1"
echo $xml.Task.Settings.RestartOnFailure.Interval = "PT1M" >> "%TEMP%\update-task.ps1"
echo $xml.Task.Settings.RestartOnFailure.Count = "3" >> "%TEMP%\update-task.ps1"
echo $xml.Save("%TEMP%\StandByScheduler_updated.xml") >> "%TEMP%\update-task.ps1"

powershell -ExecutionPolicy Bypass -File "%TEMP%\update-task.ps1"

REM Re-import updated task
schtasks /delete /tn "StandByScheduler" /f >nul
schtasks /create /tn "StandByScheduler" /xml "%TEMP%\StandByScheduler_updated.xml" /f

REM Clean up temp files
del "%TEMP%\StandByScheduler.xml" >nul 2>&1
del "%TEMP%\StandByScheduler_updated.xml" >nul 2>&1
del "%TEMP%\update-task.ps1" >nul 2>&1

echo.
echo [OK] Task created successfully!
echo.

REM Start the task
echo [INFO] Starting task...
schtasks /run /tn "StandByScheduler"

timeout /t 3 /nobreak >nul

REM Check status
schtasks /query /tn "StandByScheduler" /fo list | findstr /i "status"
echo.

echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Task Name: StandByScheduler
echo Trigger: On system startup
echo User: SYSTEM
echo.
echo Useful commands:
echo   - Check status:  schtasks /query /tn "StandByScheduler"
echo   - Start task:    schtasks /run /tn "StandByScheduler"
echo   - Stop task:     taskkill /f /im bun.exe
echo   - View logs:     logs folder
echo.
echo The task will start automatically on boot.
echo.
echo To manage: Win+R ^> taskschd.msc ^> Task Scheduler Library
echo.
pause
