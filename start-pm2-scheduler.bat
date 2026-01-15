@echo off
REM Start PM2 scheduler on Windows boot
pm2 resurrect >nul 2>&1
pm2 start ecosystem.config.cjs --update-env >nul 2>&1
exit /b 0
