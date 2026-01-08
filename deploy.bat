@echo off
echo ==========================================
echo Stand By Schedule - Deployment Script
echo ==========================================
echo.

echo [1/3] Checking Vercel CLI...
where vercel >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Vercel CLI not found. Installing...
    npm install -g vercel
)

echo.
echo [2/3] Building project...
call bun run build

echo.
echo [3/3] Deploying to Vercel...
echo.
echo Anda akan diminta untuk login ke Vercel jika belum login.
echo Browser akan terbuka untuk authentication.
echo.
pause

vercel --prod

echo.
echo ==========================================
echo Deployment Complete!
echo ==========================================
echo.
echo Salin URL di atas untuk mengakses website Anda!
echo.
pause
