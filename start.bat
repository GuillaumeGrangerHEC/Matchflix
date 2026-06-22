@echo off
start "Matchflix - Serveur" cmd /k "cd /d %~dp0server && npm run dev"
start "Matchflix - Client" cmd /k "cd /d %~dp0client && npm run dev"
timeout /t 4 /nobreak >nul
start http://10.28.19.21:5173
