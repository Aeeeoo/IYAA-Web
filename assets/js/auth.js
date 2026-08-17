// Supabase Auth 래퍼. localStorage 시절과 API 이름을 유지하되 전부 async.
(function () {
  const sb = window.sb;
  if (!sb) throw new Error("supabase-config.js가 먼저 로드되어야 합니다.");

  // 프로필과 auth user를 합쳐서 반환. role은 profiles.role에서 옴 (기본 'member').
  async function currentUser() {
    const { data: { user }, error } = await sb.auth.getUser();
    if (error || !user) return null;
    const { data: profile } = await sb
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    return {
      id: user.id,
      email: user.email,
      name: profile?.name || user.email.split("@")[0],
      role: profile?.role || "member",
      country: profile?.country || "",
      childName: profile?.child_name || "",
      childBirthYear: profile?.child_birth_year || null,
      createdAt: profile?.created_at || user.created_at,
    };
  }

  async function login(email, password) {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) {
      return { ok: false, error: "이메일 또는 비밀번호가 올바르지 않습니다." };
    }
    const user = await currentUser();
    return { ok: true, user };
  }

  async function logout() {
    await sb.auth.signOut();
  }

  async function register(data) {
    // 1) Supabase Auth로 계정 생성
    const { data: authData, error: authError } = await sb.auth.signUp({
      email: data.email,
      password: data.password,
    });
    if (authError) return { ok: false, error: authError.message };
    if (!authData.user) return { ok: false, error: "가입에 실패했습니다." };

    // 2) profiles 테이블에 부가 정보 저장. session이 자동 생성되어 auth.uid()==user.id
    //    이므로 profiles의 insert RLS 정책을 통과함.
    const { error: profileError } = await sb.from("profiles").insert({
      id: authData.user.id,
      email: data.email,
      name: data.name,
      child_name: data.childName || null,
      child_birth_year: data.childBirthYear || null,
      country: data.country || null,
      role: "member",
    });
    if (profileError) {
      return { ok: false, error: "프로필 저장 실패: " + profileError.message };
    }

    const user = await currentUser();
    return { ok: true, user };
  }

  async function requireAdmin(redirect) {
    const user = await currentUser();
    if (!user || user.role !== "admin") {
      alert("관리자만 접근할 수 있는 페이지입니다.");
      location.href = redirect || "login.html";
      return null;
    }
    return user;
  }

  window.Auth = { currentUser, login, logout, register, requireAdmin };
})();
