# IYAA — International Young Authors Association

전 세계 청년 작가(만 13~24세)를 위한 국제 창작 · 스토리텔링 협회 IYAA의 공식 홈페이지 프로토타입입니다.

정적 HTML/CSS/JS로만 구성되어 있으며, 회원가입 · 로그인 · 관리자 기능은 브라우저 `localStorage`를 이용한 프론트엔드 프로토타입입니다. 실제 서비스 전환 시 백엔드(예: Supabase / Firebase / 자체 API)로 교체할 수 있게 인증 로직은 `assets/js/auth.js` 한 곳으로 모아 두었습니다.

## 페이지 구성

| 파일 | 설명 |
| --- | --- |
| `index.html` | 랜딩 — 히어로 / 협회 지표 / 3-pillar / 최근 공지 |
| `about.html` | 협회 소개 — 미션 · 3-pillar · 연혁 · 조직 |
| `notice.html` | 공지사항 — 카테고리 탭 · 검색 · 상세 모달 |
| `contest.html` | 대회 안내 — 상태(진행중/예정/종료) 탭 · 상세 모달 |
| `signup.html` | 회원가입 — 이메일 · 비밀번호 · 이름 · 출생연도(13~24세) · 국가 |
| `login.html` | 로그인 — 회원/관리자 공용, 로그인 후 역할별 리다이렉트 |
| `admin.html` | 관리자 대시보드 — 공지·대회 CRUD, 회원 목록 |

## 로컬에서 실행

별도 빌드/서버가 필요 없습니다. `index.html`을 브라우저로 열면 됩니다.

```powershell
start .\index.html
```

로컬 개발 서버가 필요하다면(권장):

```powershell
# Python 3
python -m http.server 5173
# Node
npx serve .
```

## 데모 관리자 계정

```
Email    : admin@iyaa.org
Password : admin1234
```

로그인 페이지에도 안내가 노출됩니다. 관리자 계정으로 로그인하면 헤더에 **관리자** 버튼이 나타나고, `admin.html`에서 공지·대회 CRUD와 회원 목록을 관리할 수 있습니다.

> ⚠️ 데모 계정 정보는 `assets/js/data.js`에 하드코딩되어 있습니다. 실제 배포 시 반드시 백엔드 인증으로 교체하세요.

## 데이터 저장 방식

첫 방문 시 `assets/js/data.js`가 다음 항목을 `localStorage`에 시드합니다.

- `iyaa.users` — 회원 목록 (관리자 계정 포함)
- `iyaa.notices` — 공지사항
- `iyaa.contests` — 대회
- `iyaa.session` — 현재 로그인 세션

시드를 초기화하고 싶다면 브라우저 콘솔에서:

```js
localStorage.clear();
location.reload();
```

## 디렉터리 구조

```
IYAA-Web/
├── index.html
├── about.html
├── notice.html
├── contest.html
├── signup.html
├── login.html
├── admin.html
└── assets/
    ├── css/
    │   └── style.css
    └── js/
        ├── data.js   # localStorage 시드 · storage helper
        ├── auth.js   # 로그인 / 회원가입 / 세션
        └── main.js   # 공통 헤더 · 푸터 · 네비 렌더링
```

## 디자인 시스템

- **Palette** — 배경 `#f5f2ec` (warm cream), 잉크 `#1a1a1a`, primary `#2b3a55` (navy), accent `#b58a3f` (gold)
- **Typography** — Fraunces (serif, 헤드라인) + Inter / Noto Sans KR (본문)
- **Radius** — 카드 16px, 버튼 999px (pill)
- CSS 변수는 `assets/css/style.css` 상단 `:root`에서 관리합니다.

## GitHub Pages 배포

1. GitHub → 이 저장소 → **Settings → Pages**
2. **Source** — `Deploy from a branch`
3. **Branch** — `main` / `/(root)` → Save
4. 1~2분 후 `https://<username>.github.io/IYAA-Web/` 에서 접속

## 다음 할 일 (Roadmap)

- [ ] 백엔드 연동 (Supabase 또는 자체 API)
- [ ] 회원 프로필 페이지 · 작품 제출 페이지
- [ ] 대회 접수 파이프라인 (파일 업로드 · 심사)
- [ ] 다국어(i18n) — 한국어 / English / Français
- [ ] 접근성(A11y) 검수 및 다크 모드

## License

© International Young Authors Association (IYAA). All rights reserved.
