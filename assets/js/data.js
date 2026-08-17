// Seed data + storage helpers. Everything lives in localStorage so the
// prototype survives page reloads without a backend.
(function () {
  const KEYS = {
    users: "iyaa.users",
    session: "iyaa.session",
    notices: "iyaa.notices",
    contests: "iyaa.contests",
    seeded: "iyaa.seeded.v4",
  };

  const seedNotices = [
    {
      id: "n-welcome",
      category: "notice",
      title: "IYAA 홈페이지가 오픈되었습니다",
      date: "2026-08-17",
      author: "IYAA 사무국",
      body:
        "미취학 아동을 위한 국제 창작·스토리텔링 협회 IYAA의 홈페이지가 오픈되었습니다. 프로그램과 공지사항은 준비되는 대로 순차적으로 안내될 예정입니다.",
      views: 0,
    },
  ];

  const seedContests = [];

  const seedAdmin = {
    id: "u-admin",
    email: "admin@iyaa.org",
    // 프로토타입용. 정적 파일이라 클라이언트에서 조회 가능함을 인지하고
    // 실제 서비스로 전환 시 서버 사이드 인증으로 반드시 교체할 것.
    password: "IYAA@Admin2026!",
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
    // 시드 키가 바뀌었으므로 이전 시드를 덮어써서 오래된 가짜 데이터를 정리한다.
    write(KEYS.notices, seedNotices);
    write(KEYS.contests, seedContests);
    // 회원 가입한 사용자는 유지하고, admin 계정만 최신 시드로 갱신한다.
    const existing = read(KEYS.users, []);
    const nonAdmin = existing.filter((u) => u.role !== "admin");
    write(KEYS.users, [seedAdmin, ...nonAdmin]);
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
    incrementNoticeView: (id) => {
      const notices = read(KEYS.notices, []);
      const n = notices.find((x) => x.id === id);
      if (!n) return 0;
      n.views = (n.views || 0) + 1;
      write(KEYS.notices, notices);
      return n.views;
    },
  };

  ensureSeed();
})();
