#!/usr/bin/env bash
# 유튜브 영상을 리포지토리 폴백용으로 저장한다.
#
# 사용법:
#   ./scripts/save-video.sh <youtube-url-또는-id> <저장이름(확장자 제외)> [최대높이]
# 예:
#   ./scripts/save-video.sh zexUfAF9K2g overdox
#   ./scripts/save-video.sh https://youtu.be/abcd1234 mygame 1080
#
# 저장 위치: assets/video/<이름>.mp4
# 저장 후 해당 프로젝트 글 front matter 에  video: <이름>.mp4  를 추가하면
# 유튜브 링크가 사라졌을 때 이 파일이 대체 재생된다.

set -e

URL="$1"
NAME="$2"
MAXH="${3:-720}"   # 기본 720p (리포 용량 절약)

if [ -z "$URL" ] || [ -z "$NAME" ]; then
    echo "사용법: $0 <youtube-url-또는-id> <저장이름> [최대높이=720]"
    exit 1
fi

if ! command -v yt-dlp >/dev/null 2>&1; then
    echo "yt-dlp 가 필요합니다:  pip install -U yt-dlp"
    exit 1
fi

mkdir -p assets/video
yt-dlp -f "bv*[height<=${MAXH}]+ba/b[height<=${MAXH}]" \
    --merge-output-format mp4 \
    -o "assets/video/${NAME}.mp4" \
    "$URL"

echo "저장 완료: assets/video/${NAME}.mp4"
