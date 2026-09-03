@echo off
rem windowsweep - launcher for users without Node. Same engine, same flags: windowsweep.cmd --help
setlocal
if not defined WINDOWSWEEP_LAUNCHER set "WINDOWSWEEP_LAUNCHER=cmd"
"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -NoLogo -ExecutionPolicy Bypass -File "%~dp0windowsweep.ps1" %*
exit /b %ERRORLEVEL%
