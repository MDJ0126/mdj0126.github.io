# Site Analytics Dashboard

루트 사이트에서 사용하는 본인 Google 계정 전용 GA4 관리 대시보드 Cloudflare Worker입니다.

## Google 설정

1. Google Cloud Console에서 프로젝트를 만들고 `Google Analytics Data API`를 활성화합니다.
2. OAuth 클라이언트 ID를 `웹 애플리케이션` 유형으로 생성합니다.
3. 배포 후 표시되는 Worker 주소를 `승인된 JavaScript 원본`에 등록합니다.
4. 서비스 계정을 만들고 JSON 키를 발급합니다.
5. Google Analytics의 `관리 > 속성 액세스 관리`에서 서비스 계정 이메일을 `뷰어`로 추가합니다.
6. 같은 Google Cloud 프로젝트에서 `Maps Embed API`를 활성화하고 API 키를 생성합니다.
7. API 키의 애플리케이션 제한을 `웹사이트`로 설정해 Worker 주소만 허용하고, API 제한은 `Maps Embed API`만 허용합니다.

## Cloudflare 배포

저장소 루트의 `analytics-worker` 폴더에서 아래 명령을 실행합니다.

```powershell
npx wrangler login
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put ALLOWED_EMAIL
npx wrangler secret put SERVICE_ACCOUNT_EMAIL
npx wrangler secret put SERVICE_ACCOUNT_PRIVATE_KEY
npx wrangler secret put GOOGLE_MAPS_EMBED_API_KEY
npx wrangler deploy
```

각 값에는 OAuth 클라이언트 ID, 허용 이메일, 서비스 계정 이메일, JSON 키의 `private_key`, Maps Embed API 키를 입력합니다. 값은 파일이나 Git 저장소에 저장하지 않습니다.

## 크롤링 제출 기록

- `/crawler-report`: 자동 수집 도구가 기관명, 방문 목적, 사용 도구를 제출하는 공개 페이지
- `POST /api/crawler-report`: 같은 내용을 JSON으로 제출하는 공개 API
- `/api/crawler-reports`: 관리자 Google 계정으로 인증한 뒤 제출 기록을 조회하는 API

제출 기록은 `CrawlerReportStore` Durable Object에 저장되며 관리자 화면의 `크롤링 제출 기록` 탭에서 확인합니다. 요청 시각, User-Agent, Referer, 국가와 도시 정보는 Worker가 요청에서 직접 기록합니다.

