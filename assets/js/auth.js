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
    // Supabase Auth로 계정 생성. 부가 정보는 raw_user_meta_data로 넘겨서
    // DB 트리거(handle_new_user)가 profiles 행을 자동 생성하게 한다.
    // 이메일 인증 전에는 세션이 없어서 클라이언트에서 profiles insert가
    // RLS에 걸리기 때문에 트리거 방식이 필요함.
    const { data: authData, error: authError } = await sb.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${location.origin}/verified.html`,
        data: {
          name: data.name,
          child_name: data.childName || null,
          child_birth_year: data.childBirthYear || null,
          country: data.country || null,
        },
      },
    });
    if (authError) return { ok: false, error: authError.message };
    if (!authData.user) return { ok: false, error: "가입에 실패했습니다." };

    // Supabase는 이메일 열거 공격 방지를 위해 이미 존재하는 이메일에도
    // 200 응답을 준다. 하지만 응답의 user.identities가 빈 배열이면 이미
    // 등록된 이메일이라는 신호 — 사용자에게 명확히 알려준다.
    if (authData.user.identities && authData.user.identities.length === 0) {
      return {
        ok: false,
        alreadyRegistered: true,
        error:
          "이미 가입된 이메일입니다. 인증 메일을 확인하지 않으셨다면 메일함과 스팸함을 확인하시거나, 로그인 페이지에서 인증 메일 재발송을 요청해주세요.",
      };
    }

    // 이메일 인증이 켜져있으면 session이 null. 인증 후 자동 로그인.
    const needsEmailConfirm = !authData.session;
    return { ok: true, needsEmailConfirm, email: data.email };
  }

  // 인증 메일을 놓친 사용자용 재발송.
  async function resendConfirmation(email) {
    const { error } = await sb.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${location.origin}/verified.html` },
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
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

  window.Auth = { currentUser, login, logout, register, resendConfirmation, requireAdmin };
})();
