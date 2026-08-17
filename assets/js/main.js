// Shared UI wiring: header rendering, nav active state, mobile toggle.
(function () {
  document.addEventListener("DOMContentLoaded", async function () {
    await renderHeader();
    renderFooter();
    highlightActiveNav();
    wireMobileMenu();
  });

  async function renderHeader() {
    const slot = document.querySelector("[data-header]");
    if (!slot) return;

    // 헤더는 로그인 상태와 무관한 뼈대를 먼저 그리고, auth 정보는 뒤에서
    // 채워넣는다. currentUser()가 Supabase 왕복이라 첫 페인트를 안 막게.
    slot.innerHTML = `
      <header class="site-header">
        <div class="container">
          <a class="brand" href="index.html" aria-label="IAYA 홈">
            <img class="brand-logo" src="logo.png" alt="IAYA" />
          </a>
          <nav class="nav" data-nav>
            <a href="about.html" data-nav-key="about">협회 소개</a>
            <a href="notice.html" data-nav-key="notice">공지사항</a>
            <a href="contest.html" data-nav-key="contest">대회 안내</a>
          </nav>
          <div class="auth-nav" data-auth-nav></div>
          <button class="btn btn-ghost btn-sm mobile-menu-btn" data-menu-toggle aria-label="메뉴">☰</button>
        </div>
      </header>
    `;

    highlightActiveNav();

    const authSlot = slot.querySelector("[data-auth-nav]");
    const user = window.Auth ? await window.Auth.currentUser() : null;
    authSlot.innerHTML = user
      ? `
        <span style="font-size:13px;color:var(--muted);">${escapeHtml(user.name)}${user.role === "admin" ? " · 관리자" : ""}</span>
        ${user.role === "admin" ? `<a class="btn btn-ghost" href="admin.html">관리자</a>` : ""}
        <button class="btn btn-outline" data-logout>로그아웃</button>
      `
      : `
        <a class="btn btn-ghost" href="login.html">로그인</a>
        <a class="btn btn-primary" href="signup.html">회원가입</a>
      `;

    const logoutBtn = authSlot.querySelector("[data-logout]");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async function () {
        await window.Auth.logout();
        location.href = "index.html";
      });
    }
  }

  function renderFooter() {
    const slot = document.querySelector("[data-footer]");
    if (!slot) return;
    const year = new Date().getFullYear();
    slot.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div>
            © ${year} International Association for Young Authors (IAYA)
          </div>
          <div class="foot-links">
            <a href="about.html">협회 소개</a>
            <a href="notice.html">공지사항</a>
            <a href="contest.html">대회 안내</a>
            <a href="mailto:hello@iaya.org">문의</a>
          </div>
        </div>
      </footer>
    `;
  }

  function highlightActiveNav() {
    const key = document.body.dataset.nav;
    if (!key) return;
    document
      .querySelectorAll(`[data-nav] a[data-nav-key="${key}"]`)
      .forEach((a) => a.classList.add("active"));
  }

  function wireMobileMenu() {
    document.addEventListener("click", function (e) {
      const btn = e.target.closest("[data-menu-toggle]");
      if (!btn) return;
      document.querySelector("[data-nav]")?.classList.toggle("open");
      document.querySelector("[data-auth-nav]")?.classList.toggle("open");
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }

  window.escapeHtml = escapeHtml;
})();
