@echo off
set fileName=server.js
cd /d %~dp0
if exist %fileName% (
    node %fileName%
) else (
    cd backend
    node %fileName%
)