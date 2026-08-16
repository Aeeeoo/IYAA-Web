// Shared UI wiring: header rendering, nav active state, mobile toggle.
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    renderHeader();
    renderFooter();
    highlightActiveNav();
    wireMobileMenu();
  });

  function renderHeader() {
    const slot = document.querySelector("[data-header]");
    if (!slot) return;
    const user = window.Auth ? window.Auth.currentUser() : null;

    const authNav = user
      ? `
        <span style="font-size:13px;color:var(--muted);">${escapeHtml(user.name)}${user.role === "admin" ? " · 관리자" : ""}</span>
        ${user.role === "admin" ? `<a class="btn btn-ghost btn-sm" href="admin.html">관리자</a>` : ""}
        <button class="btn btn-outline btn-sm" data-logout>로그아웃</button>
      `
      : `
        <a class="btn btn-ghost btn-sm" href="login.html">로그인</a>
        <a class="btn btn-primary btn-sm" href="signup.html">회원가입</a>
      `;

    slot.innerHTML = `
      <header class="site-header">
        <div class="container">
          <a class="brand" href="index.html" aria-label="IYAA 홈">
            <span class="brand-mark">IY</span>
            <span class="brand-name">
              <b>IYAA</b>
              <small>Young Authors Association</small>
            </span>
          </a>
          <nav class="nav" data-nav>
            <a href="about.html" data-nav-key="about">협회 소개</a>
            <a href="notice.html" data-nav-key="notice">공지사항</a>
            <a href="contest.html" data-nav-key="contest">대회 안내</a>
          </nav>
          <div class="auth-nav" data-auth-nav>${authNav}</div>
          <button class="btn btn-ghost btn-sm mobile-menu-btn" data-menu-toggle aria-label="메뉴">☰</button>
        </div>
      </header>
    `;

    const logoutBtn = slot.querySelector("[data-logout]");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        window.Auth.logout();
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
            © ${year} International Young Authors Association (IYAA)
          </div>
          <div class="foot-links">
            <a href="about.html">협회 소개</a>
            <a href="notice.html">공지사항</a>
            <a href="contest.html">대회 안내</a>
            <a href="mailto:hello@iyaa.org">문의</a>
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
