@echo off
cd /d "%~dp0"

where npm >nul 2>nul
if %errorlevel%==0 (
  echo Starting Plenty Barber with npm...
  npm run dev
  goto :eof
)

set "CODEX_NODE=C:\Users\DavidGoM\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if exist "%CODEX_NODE%" (
  echo Starting Plenty Barber with bundled Codex Node...
  "%CODEX_NODE%" ".\node_modules\next\dist\bin\next" dev -H 127.0.0.1 -p 3000
  goto :eof
)

echo Node.js or npm was not found.
echo Install Node.js LTS from https://nodejs.org/ and run npm install.
pause
