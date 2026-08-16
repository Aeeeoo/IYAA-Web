// Session + role helpers. Auth is intentionally simple (localStorage) —
// swap out these functions when a real backend lands.
(function () {
  const K = window.IYAA.KEYS;

  function currentUser() {
    const session = window.IYAA.read(K.session, null);
    if (!session) return null;
    return window.IYAA.getUsers().find((u) => u.id === session.userId) || null;
  }

  function login(email, password) {
    const user = window.IYAA.getUsers().find(
      (u) => u.email.toLowerCase() === String(email).toLowerCase() && u.password === password
    );
    if (!user) return { ok: false, error: "이메일 또는 비밀번호가 올바르지 않습니다." };
    window.IYAA.write(K.session, { userId: user.id, at: new Date().toISOString() });
    return { ok: true, user };
  }

  function logout() {
    localStorage.removeItem(K.session);
  }

  function register(data) {
    const users = window.IYAA.getUsers();
    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { ok: false, error: "이미 등록된 이메일입니다." };
    }
    const user = {
      id: "u-" + Date.now().toString(36),
      email: data.email,
      password: data.password,
      name: data.name,
      role: "member",
      country: data.country,
      childName: data.childName || "",
      childBirthYear: data.childBirthYear ? Number(data.childBirthYear) : null,
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    window.IYAA.setUsers(users);
    window.IYAA.write(K.session, { userId: user.id, at: new Date().toISOString() });
    return { ok: true, user };
  }

  function requireAdmin(redirect) {
    const user = currentUser();
    if (!user || user.role !== "admin") {
      alert("관리자만 접근할 수 있는 페이지입니다.");
      location.href = redirect || "login.html";
      return null;
    }
    return user;
  }

  window.Auth = { currentUser, login, logout, register, requireAdmin };
})();
