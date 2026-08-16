// Seed data + storage helpers. Everything lives in localStorage so the
// prototype survives page reloads without a backend.
(function () {
  const KEYS = {
    users: "iyaa.users",
    session: "iyaa.session",
    notices: "iyaa.notices",
    contests: "iyaa.contests",
    seeded: "iyaa.seeded.v1",
  };

  const seedNotices = [
    {
      id: "n-2026-08-01",
      category: "important",
      title: "2026 IYAA Global Young Writers Award 개최 안내",
      date: "2026-08-10",
      author: "IYAA 사무국",
      body:
        "전 세계 만 13세~24세 청년 작가를 대상으로 2026 IYAA Global Young Writers Award가 개최됩니다. 소설, 에세이, 시 세 개 부문으로 진행되며 접수는 9월 1일부터 시작됩니다.",
    },
    {
      id: "n-2026-07-22",
      category: "notice",
      title: "IYAA 회원 등급제 개편 안내 (2026.09.01 시행)",
      date: "2026-07-22",
      author: "운영지원팀",
      body:
        "정회원 · 준회원 · 학생회원 3단계로 개편됩니다. 기존 회원의 등급은 자동 매핑되며, 개편 이후 신규 혜택이 순차 적용됩니다.",
    },
    {
      id: "n-2026-07-05",
      category: "notice",
      title: "여름 창작 워크숍(온라인) 참가자 모집",
      date: "2026-07-05",
      author: "교육팀",
      body:
        "8월 5일부터 3주간 진행되는 온라인 창작 워크숍 참가자를 모집합니다. 소설/에세이/스토리텔링 트랙으로 진행됩니다.",
    },
    {
      id: "n-2026-06-18",
      category: "event",
      title: "IYAA × 국립중앙도서관 낭독의 밤",
      date: "2026-06-18",
      author: "행사팀",
      body: "회원과 함께하는 낭독의 밤. 7월 12일 저녁 7시, 국립중앙도서관 강당.",
    },
    {
      id: "n-2026-05-30",
      category: "press",
      title: "IYAA, 유네스코 청년 문학 파트너십 체결",
      date: "2026-05-30",
      author: "대외협력팀",
      body: "IYAA는 유네스코와 청년 문학 확산을 위한 파트너십 협약을 체결했습니다.",
    },
    {
      id: "n-2026-05-02",
      category: "notice",
      title: "홈페이지 리뉴얼 오픈 안내",
      date: "2026-05-02",
      author: "IYAA 사무국",
      body: "새로운 홈페이지가 오픈되었습니다. 개선 사항과 회원 서비스 이용을 확인해 주세요.",
    },
  ];

  const seedContests = [
    {
      id: "c-2026-gywa",
      title: "2026 Global Young Writers Award",
      kicker: "Annual Flagship Contest",
      status: "open",
      period: "2026-09-01 ~ 2026-10-31",
      award: "대상 500만원 + 국제 출판 지원",
      category: "소설 · 에세이 · 시",
      summary:
        "전 세계 청년 작가를 위한 IYAA 대표 문학상. 부문별 수상자에게는 상금과 함께 국제 출판/번역 지원이 제공됩니다.",
      cover: "primary",
      detail:
        "만 13세 이상 24세 이하 누구나 참가 가능하며, 원어(모국어) 원고와 500단어 이내 영문 시놉시스를 함께 제출해야 합니다.",
    },
    {
      id: "c-2026-shorts",
      title: "IYAA Shorts: 500단어 스토리 챌린지",
      kicker: "Seasonal Challenge",
      status: "upcoming",
      period: "2026-11-10 ~ 2026-11-24",
      award: "우수작 10편 온라인 매거진 게재",
      category: "초단편",
      summary:
        "500단어로 완결되는 스토리. 주제 발표 후 2주간 진행되는 초단편 챌린지입니다.",
      cover: "alt",
      detail: "매 시즌 주제가 공개되며, 우수작은 IYAA 온라인 매거진에 수록됩니다.",
    },
    {
      id: "c-2026-nonfiction",
      title: "청년 논픽션 프로젝트 지원",
      kicker: "Grant Program",
      status: "open",
      period: "상시 접수 · 분기 심사",
      award: "프로젝트당 최대 200만원 지원",
      category: "논픽션",
      summary: "취재/조사가 필요한 청년 논픽션 프로젝트에 취재비와 멘토링을 지원합니다.",
      cover: "dark",
      detail:
        "분기별 심사를 통해 3~5개 프로젝트를 선정하며, 선정자는 편집자 멘토링과 취재 비용을 지원받습니다.",
    },
    {
      id: "c-2025-poetry",
      title: "2025 IYAA 청년 시 공모전",
      kicker: "Archive",
      status: "closed",
      period: "2025-08-01 ~ 2025-09-30",
      award: "부문별 대상 200만원",
      category: "시",
      summary: "지난해 진행된 청년 시 공모전. 수상작은 아카이브에서 확인 가능합니다.",
      cover: "primary",
      detail: "아카이브 열람만 가능합니다.",
    },
  ];

  const seedAdmin = {
    id: "u-admin",
    email: "admin@iyaa.org",
    password: "admin1234", // 데모용, 실제 서비스는 해시 필요
    name: "IYAA Admin",
    role: "admin",
    country: "KR",
    birthYear: 1990,
    createdAt: "2026-01-01T00:00:00Z",
  };

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }
  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function ensureSeed() {
    if (localStorage.getItem(KEYS.seeded) === "1") return;
    if (!localStorage.getItem(KEYS.notices)) write(KEYS.notices, seedNotices);
    if (!localStorage.getItem(KEYS.contests)) write(KEYS.contests, seedContests);
    if (!localStorage.getItem(KEYS.users)) write(KEYS.users, [seedAdmin]);
    localStorage.setItem(KEYS.seeded, "1");
  }

  window.IYAA = {
    KEYS,
    read,
    write,
    ensureSeed,
    getNotices: () => read(KEYS.notices, []),
    setNotices: (v) => write(KEYS.notices, v),
    getContests: () => read(KEYS.contests, []),
    setContests: (v) => write(KEYS.contests, v),
    getUsers: () => read(KEYS.users, []),
    setUsers: (v) => write(KEYS.users, v),
  };

  ensureSeed();
})();
