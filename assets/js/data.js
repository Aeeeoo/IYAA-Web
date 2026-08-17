// Supabase 백엔드로 옮긴 데이터 레이어. localStorage 시절과 API 이름은
// 비슷하게 유지하지만 모든 함수가 Promise를 반환합니다. 호출부에서 await 필요.
(function () {
  const sb = window.sb;
  if (!sb) throw new Error("supabase-config.js가 먼저 로드되어야 합니다.");

  // DB 컬럼(snake_case) → 프론트 형식(camelCase)으로 매핑.
  function noticeFromRow(n) {
    return {
      id: n.id,
      category: n.category,
      title: n.title,
      date: n.date,
      author: n.author,
      body: n.body,
      views: n.views || 0,
    };
  }
  function noticeToRow(n) {
    return {
      id: n.id,
      category: n.category,
      title: n.title,
      date: n.date,
      author: n.author,
      body: n.body,
    };
  }
  function contestFromRow(c) {
    return {
      id: c.id,
      title: c.title,
      kicker: c.kicker,
      status: c.status,
      period: c.period,
      award: c.award,
      category: c.category,
      summary: c.summary,
      detail: c.detail,
      cover: c.cover,
    };
  }
  function userFromRow(p) {
    return {
      id: p.id,
      email: p.email,
      name: p.name,
      role: p.role,
      country: p.country,
      childName: p.child_name,
      childBirthYear: p.child_birth_year,
      createdAt: p.created_at,
    };
  }

  // ── Notices ──────────────────────────────────────────────────────────
  async function getNotices() {
    const { data, error } = await sb
      .from("notices")
      .select("*")
      .order("date", { ascending: false });
    if (error) { console.error("[notices]", error); return []; }
    return data.map(noticeFromRow);
  }

  async function getNotice(id) {
    const { data, error } = await sb.from("notices").select("*").eq("id", id).maybeSingle();
    if (error) { console.error("[notice]", error); return null; }
    return data ? noticeFromRow(data) : null;
  }

  async function saveNotice(n) {
    const { error } = await sb.from("notices").upsert(noticeToRow(n));
    if (error) throw error;
  }

  async function deleteNotice(id) {
    const { error } = await sb.from("notices").delete().eq("id", id);
    if (error) throw error;
  }

  // Supabase 함수(RPC)로 조회수 증가. SECURITY DEFINER라 RLS 없이 update.
  async function incrementNoticeView(id) {
    const { data, error } = await sb.rpc("increment_notice_view", { notice_id: id });
    if (error) { console.error("[views]", error); return 0; }
    return data || 0;
  }

  // ── Contests ─────────────────────────────────────────────────────────
  async function getContests() {
    const { data, error } = await sb
      .from("contests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) { console.error("[contests]", error); return []; }
    return data.map(contestFromRow);
  }

  async function saveContest(c) {
    const { error } = await sb.from("contests").upsert(c);
    if (error) throw error;
  }

  async function deleteContest(id) {
    const { error } = await sb.from("contests").delete().eq("id", id);
    if (error) throw error;
  }

  // ── Users (profiles) ─────────────────────────────────────────────────
  async function getUsers() {
    const { data, error } = await sb
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) { console.error("[users]", error); return []; }
    return data.map(userFromRow);
  }

  async function deleteUser(id) {
    // 프론트에서는 profiles 행만 제거. auth.users의 실제 계정은 관리자가
    // Supabase 대시보드에서 수동으로 삭제해야 함.
    const { error } = await sb.from("profiles").delete().eq("id", id);
    if (error) throw error;
  }

  window.IAYA = {
    getNotices,
    getNotice,
    saveNotice,
    deleteNotice,
    incrementNoticeView,
    getContests,
    saveContest,
    deleteContest,
    getUsers,
    deleteUser,
  };
})();
