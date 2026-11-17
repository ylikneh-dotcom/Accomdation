# Wachemo University System Launch Script (PowerShell)
$env:Path = "$env:LOCALAPPDATA\Programs\nodejs;$env:Path"

Write-Host "=========================================================================" -ForegroundColor Cyan
Write-Host "   WACHEMO UNIVERSITY (ዋቸሞ ዩኒቨርሲቲ)" -ForegroundColor White
Write-Host "   AI Accommodation & Property Management System" -ForegroundColor Yellow
Write-Host "=========================================================================" -ForegroundColor Cyan

# Check if servers already running
$bRunning = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
$fRunning = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue

if (-not $bRunning) {
    Write-Host "[1/2] Starting Backend API Server on Port 5000..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:Path = '$env:LOCALAPPDATA\Programs\nodejs;' + `$env:Path; Set-Location '$PSScriptRoot\backend'; node dist/server.js"
} else {
    Write-Host "[1/2] Backend API is already running on port 5000." -ForegroundColor Gray
}

if (-not $fRunning) {
    Write-Host "[2/2] Starting Frontend Web Interface on Port 3000..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:Path = '$env:LOCALAPPDATA\Programs\nodejs;' + `$env:Path; Set-Location '$PSScriptRoot\frontend'; npm run dev"
} else {
    Write-Host "[2/2] Frontend is already running on port 3000." -ForegroundColor Gray
}

Start-Sleep -Seconds 2
Start-Process "http://localhost:3000"
Write-Host "System launched at http://localhost:3000" -ForegroundColor Cyan
