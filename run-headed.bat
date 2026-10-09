@echo off
cd /d "%~dp0"
if "%BASE_URL%"=="" set BASE_URL=https://careers.unops.org
echo ============================================
echo  UNOPS Playwright - headed Chrome test
echo  Environment: %BASE_URL%
echo  Keep this window open. Chrome will appear.
echo ============================================
echo.
set PLAYWRIGHT_BROWSERS_PATH=
npx playwright test home login profile marketplace --headed --project=chromium --workers=1
echo.
echo Exit code: %ERRORLEVEL%
echo.
pause
