@echo off
cd /d %~dp0
for %%A in ("%CD%") do set currentFolder=%%~nA
if %currentFolder%=="fontend" then (
) else (
    cd fontend   
)
npm run serve