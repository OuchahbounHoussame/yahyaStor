@echo off
cd /d "%~dp0"
echo Starting BOYX store...
start "BOYX Store Server" cmd /k "npm.cmd run dev -- --host 127.0.0.1"
timeout /t 3 >nul
start "" "http://127.0.0.1:5173/"
