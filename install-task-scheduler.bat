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

REM Get current username
set CURRENT_USER=%USERNAME%

REM Create task with onlogon trigger for PM2
schtasks /create ^
  /tn "StandByScheduler" ^
  /tr "\"%PROJECT_DIR%\start-pm2-scheduler.bat\"" ^
  /sc onlogon ^
  /rl highest ^
  /f

REM Add delay to ensure system is ready
timeout /t 2 /nobreak >nul

REM Add onlogon trigger as backup using XML
schtasks /query /tn "StandByScheduler" /xml > "%TEMP%\StandByScheduler.xml"
powershell -Command "$xml = [xml](Get-Content '%TEMP%\StandByScheduler.xml'); $trigger = $xml.CreateElement('LogonTrigger', $xml.Task.Triggers.NamespaceURI); $trigger.InnerXml = '<Enabled>true</Enabled>'; $xml.Task.Triggers.AppendChild($trigger); $xml.Task.Settings.ExecutionTimeLimit = 'PT0S'; $xml.Task.Settings.DisallowStartIfOnBatteries = 'false'; $xml.Task.Settings.StopIfGoingOnBatteries = 'false'; $xml.Task.Settings.MultipleInstancesPolicy = 'IgnoreNew'; $xml.Save('%TEMP%\StandByScheduler_updated.xml')"
schtasks /delete /tn "StandByScheduler" /f >nul
schtasks /create /tn "StandByScheduler" /xml "%TEMP%\StandByScheduler_updated.xml" /ru "%USERNAME%" /f
del "%TEMP%\StandByScheduler.xml" >nul 2>&1
del "%TEMP%\StandByScheduler_updated.xml" >nul 2>&1

if %errorLevel% NEQ 0 (
    echo.
    echo [ERROR] Failed to create scheduled task!
    pause
    exit /b 1
)

echo [INFO] Task configured to run on user logon

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
echo Trigger: On user logon
echo User: %USERNAME%
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
