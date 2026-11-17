@echo off
title Wachemo University Accommodation & Property Management System
echo =========================================================================
echo    WACHEMO UNIVERSITY (ዋቸሞ ዩኒቨርሲቲ)
echo    AI-Powered Accommodation & Property Management System
echo =========================================================================
echo.

:: Add portable nodejs to PATH if present
set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"

echo [1/2] Starting Backend API Server (Port 5000)...
start "Wachemo Backend API" cmd /k "cd /d %~dp0backend && node dist/server.js"

echo [2/2] Starting Frontend Web Interface (Port 3000)...
start "Wachemo Frontend Web" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo =========================================================================
echo System is launching!
echo Frontend Portal: http://localhost:3000
echo Backend API:     http://localhost:5000
echo =========================================================================
echo.
timeout /t 3 >nul
start http://localhost:3000
