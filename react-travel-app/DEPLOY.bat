@echo off
echo ========================================
echo  Vietnam UrbanQuest - Deploy to Vercel
echo ========================================
echo.

echo Checking if Vercel CLI is installed...
vercel --version >nul 2>&1
if errorlevel 1 (
    echo Vercel CLI not found. Installing...
    call npm install -g vercel
    echo.
)

echo.
echo [1/3] Building project...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo.

echo [2/3] Deploying to Vercel...
echo.
vercel --prod
echo.

echo [3/3] Deployment complete!
echo.
echo ========================================
echo  Your app is now live on Vercel!
echo ========================================
echo.
pause
