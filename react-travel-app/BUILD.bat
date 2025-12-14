@echo off
echo ========================================
echo  Vietnam UrbanQuest - Build Script
echo ========================================
echo.

echo [1/4] Checking Node.js installation...
node --version
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)
echo.

echo [2/4] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)
echo.

echo [3/4] Building React app...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo.

echo [4/4] Build completed successfully!
echo.
echo ========================================
echo  Build output is in the 'build' folder
echo ========================================
echo.
echo Next steps:
echo 1. Test locally: npm start
echo 2. Deploy to Vercel: vercel
echo.
pause
