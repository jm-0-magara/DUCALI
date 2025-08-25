@echo off
echo ========================================
echo    DUCALI Development Server Manager
echo ========================================
echo.

echo Checking for existing Node processes...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Killed existing Node processes
) else (
    echo ℹ️  No existing Node processes found
)

echo.
echo Cleaning build cache...
if exist .next (
    rmdir /s /q .next
    echo ✅ Removed .next folder
) else (
    echo ℹ️  No .next folder found
)

echo.
echo Starting development server...
echo 🌐 Server will be available at: http://localhost:3000
echo 📝 Press Ctrl+C to stop the server
echo.

npm run dev

pause
