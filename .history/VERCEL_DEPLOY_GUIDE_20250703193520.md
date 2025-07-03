# 🚀 Vercel 서버리스 프록시 배포 가이드

## 1. 필수 파일 생성 완료 ✅
- `api/proxy.js` - Vercel 서버리스 함수
- `vercel.json` - Vercel 배포 설정
- `src/services/campaign.ts` - 프록시 연동 코드

## 2. Vercel 배포 단계

### 2.1 Vercel 계정 생성 및 설치
```bash
# Vercel CLI 설치
npm install -g vercel

# 또는 yarn을 사용하는 경우
yarn global add vercel
```

### 2.2 Vercel 로그인
```bash
vercel login
```

### 2.3 프로젝트 배포
```bash
# 프로젝트 루트 디렉터리에서 실행
vercel

# 배포 중 옵션 선택:
# - Set up and deploy? Y
# - Which scope? (계정 선택)
# - Link to existing project? N
# - What's your project's name? revuclick-proxy
# - In which directory is your code located? ./
```

### 2.4 배포 완료 후 URL 확인
배포가 완료되면 다음과 같은 URL이 제공됩니다:
```
https://your-project-name.vercel.app
```

## 3. 클라이언트 코드 URL 수정

### 3.1 campaign.ts 파일 수정
`src/services/campaign.ts`에서 `your-vercel-app.vercel.app`를 실제 Vercel URL로 변경:

```typescript
// 예시: 실제 배포된 URL로 변경
const VERCEL_PROXY_URL = 'https://revuclick-proxy.vercel.app'

export const getCampaignListViaVercelProxy = async (
  data: CampaignListRequest,
  proxyBaseUrl: string = VERCEL_PROXY_URL // 여기 수정
): Promise<CampaignListResponse> => {
```

### 3.2 환경 변수 사용 (선택사항)
`.env` 파일에 추가:
```
VITE_VERCEL_PROXY_URL=https://your-project-name.vercel.app
```

## 4. 테스트 방법

### 4.1 프록시 API 직접 테스트
```bash
# 캠페인 리스트 테스트
curl "https://your-project-name.vercel.app/api/proxy?path=b2/ads/Ska1a8fo"

# 캠페인 상세 테스트
curl "https://your-project-name.vercel.app/api/proxy?path=b2/ads/Ska1a8fo/g77X4iJi/check&uid=test_user&advId=744"
```

### 4.2 브라우저 콘솔에서 테스트
```javascript
// 개발자 도구 콘솔에서 실행
fetch('https://your-project-name.vercel.app/api/proxy?path=b2/ads/Ska1a8fo')
  .then(res => res.json())
  .then(data => console.log('프록시 테스트 성공:', data))
  .catch(err => console.error('프록시 테스트 실패:', err))
```

## 5. 장점

### 5.1 CORS 문제 해결
- ✅ 서버리스 함수가 CORS 헤더를 자동으로 추가
- ✅ 모든 도메인에서 접근 가능

### 5.2 안정성
- ✅ Vercel의 안정적인 인프라 사용
- ✅ 자동 스케일링 및 글로벌 CDN
- ✅ 외부 프록시 서비스 의존성 제거

### 5.3 성능
- ✅ 빠른 응답 속도
- ✅ 직접 API 호출 방식
- ✅ 추가 파싱 과정 불필요

## 6. 주의사항

### 6.1 API 키 보안
- ⚠️ 현재 API 키가 클라이언트에 노출됨
- 💡 추후 환경 변수로 이동 권장

### 6.2 Rate Limiting
- ⚠️ B2 API의 호출 한도 확인 필요
- 💡 캐싱 메커니즘 추가 고려

### 6.3 에러 처리
- ✅ 다단계 폴백 메커니즘 구현
- ✅ Mock 데이터 최후 보장

## 7. 다음 단계

1. 🚀 Vercel 배포 실행
2. 🔧 실제 URL로 코드 수정
3. 🧪 테스트 실행
4. 📊 성능 모니터링
5. 🔒 보안 강화 (API 키 환경 변수화) 