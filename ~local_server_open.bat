@echo off
setlocal

pushd "%~dp0" || goto :directory_error
set "BUNDLE_GEMFILE=%CD%\Resume\Gemfile"
echo Checking Ruby dependencies...
call bundle check >nul 2>&1
if errorlevel 1 (
  echo Installing Ruby dependencies...
  call bundle install || goto :command_error
)

echo Opening http://127.0.0.1:4000/ ...
start "" "http://127.0.0.1:4000/"

echo Starting local server with automatic rebuild...
call ruby "%CD%\~local_server.rb"
if errorlevel 1 goto :command_error

:done
popd
endlocal
exit /b 0

:directory_error
echo Root project directory was not found: %~dp0
pause
endlocal
exit /b 1

:command_error
echo Failed to start the local server.
popd
pause
endlocal
exit /b 1
