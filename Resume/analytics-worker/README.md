# Resume Analytics Dashboard

본인 Google 계정만 접근 가능한 GA4 대시보드용 Cloudflare Worker입니다.

## Google 설정

1. Google Cloud Console에서 프로젝트를 만들고 `Google Analytics Data API`를 활성화합니다.
2. OAuth 클라이언트 ID를 `웹 애플리케이션` 유형으로 생성합니다.
3. 배포 후 표시되는 Worker 주소를 `승인된 JavaScript 원본`에 등록합니다.
4. 서비스 계정을 만들고 JSON 키를 발급합니다.
5. Google Analytics의 `관리 > 속성 액세스 관리`에서 서비스 계정 이메일을 `뷰어`로 추가합니다.

## Cloudflare 배포

`analytics-worker` 폴더에서 아래 명령을 실행합니다.

```powershell
npx wrangler login
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put ALLOWED_EMAIL
npx wrangler secret put SERVICE_ACCOUNT_EMAIL
npx wrangler secret put SERVICE_ACCOUNT_PRIVATE_KEY
npx wrangler deploy
```

각 값에는 OAuth 클라이언트 ID, 허용 이메일, 서비스 계정 이메일, JSON 키의 `private_key`를 입력합니다. 비밀 값은 파일이나 Git 저장소에 저장하지 않습니다.

