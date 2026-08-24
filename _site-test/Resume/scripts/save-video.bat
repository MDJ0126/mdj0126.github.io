@echo off
chcp 65001 >nul
cd /d "%~dp0.."

echo ==============================
echo    영상 백업 다운로드
echo ==============================
echo.

set "URL="
set /p "URL=유튜브 URL 또는 영상 ID: "
if "%URL%"=="" (
    echo [오류] URL 또는 ID를 입력하세요.
    pause
    exit /b 1
)

set "NAME="
set /p "NAME=저장 이름 (확장자 제외, 예: overdox): "
if "%NAME%"=="" (
    echo [오류] 저장 이름을 입력하세요.
    pause
    exit /b 1
)

set "MAXH="
set /p "MAXH=최대 높이 [기본 720]: "
if "%MAXH%"=="" set "MAXH=720"

where yt-dlp >/dev/null 2>/dev/null
if errorlevel 1 (
    echo [오류] yt-dlp 가 필요합니다.  설치:  pip install -U yt-dlp
    pause
    exit /b 1
)

set "FF="
for /f "delims=" %%i in ('python -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())" 2^>nul') do set "FF=%%i"

if not exist "assets\video" mkdir "assets\video"

echo.
echo 다운로드 중... (%URL%)
echo.
if defined FF (
    yt-dlp --ffmpeg-location "%FF%" -f "bv*[height<=%MAXH%]+ba/b[height<=%MAXH%]" --merge-output-format mp4 -o "assets/video/%NAME%.mp4" "%URL%"
) else (
    yt-dlp -f "b[height<=%MAXH%]/bv*[height<=%MAXH%]+ba" --merge-output-format mp4 -o "assets/video/%NAME%.mp4" "%URL%"
)

echo.
echo 저장 완료: assets\video\%NAME%.mp4
echo 프로젝트 글 front matter 에   video: %NAME%.mp4   를 추가하세요.
echo.
pause
