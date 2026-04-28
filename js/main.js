(() => {
  // Theme (light/dark): respects system by default, but lets user override with a toggle.
  const THEME_KEY = 'guitar_theme_v1';
  const root = document.documentElement;
  const mql = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  const getStoredTheme = () => {
    try {
      const v = (localStorage.getItem(THEME_KEY) || '').trim();
      return v === 'dark' || v === 'light' ? v : '';
    } catch {
      return '';
    }
  };

  const applyTheme = (theme) => {
    if (theme === 'dark' || theme === 'light') {
      root.setAttribute('data-theme', theme);
    } else {
      root.removeAttribute('data-theme');
    }
  };

  const getEffectiveTheme = () => {
    const explicit = root.getAttribute('data-theme');
    if (explicit === 'dark' || explicit === 'light') return explicit;
    return mql && mql.matches ? 'dark' : 'light';
  };

  const ensureThemeToggle = () => {
    // Prefer placing in the header CTA area; fall back to the header row.
    const hosts = [
      document.querySelector('.nav__cta'),
      document.querySelector('.header__row')
    ].filter(Boolean);

    for (const host of hosts) {
      if (!(host instanceof HTMLElement)) continue;
      if (host.querySelector('[data-theme-toggle]')) return;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn--ghost btn--small theme-toggle';
      btn.setAttribute('data-theme-toggle', '');
      btn.setAttribute('aria-label', 'Переключить тему');
      btn.setAttribute('aria-pressed', 'false');
      btn.innerHTML = '<span data-theme-label>Тема</span>';
      host.appendChild(btn);
      return;
    }
  };

  const updateThemeToggle = () => {
    const t = getEffectiveTheme();
    const buttons = Array.from(document.querySelectorAll('[data-theme-toggle]'))
      .filter((el) => el instanceof HTMLButtonElement);

    for (const btn of buttons) {
      btn.setAttribute('aria-pressed', String(t === 'dark'));
      const label = btn.querySelector('[data-theme-label]');
      const text = t === 'dark' ? 'Тема: темная' : 'Тема: светлая';
      if (label) label.textContent = text;
      else btn.textContent = text;
    }
  };

  // Apply stored preference (if any) before UI work.
  applyTheme(getStoredTheme());
  ensureThemeToggle();
  updateThemeToggle();

  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const btn = target.closest('[data-theme-toggle]');
    if (!(btn instanceof HTMLButtonElement)) return;

    const next = getEffectiveTheme() === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(THEME_KEY, next); } catch {}
    applyTheme(next);
    updateThemeToggle();
  });

  if (mql && typeof mql.addEventListener === 'function') {
    mql.addEventListener('change', () => {
      // Only matters when user hasn't overridden the theme.
      if (!root.hasAttribute('data-theme')) updateThemeToggle();
    });
  }

  const nav = document.querySelector('[data-nav]');
  const navToggle = document.querySelector('[data-nav-toggle]');

  if (nav && navToggle) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('click', (e) => {
      if (!nav.classList.contains('is-open')) return;
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (nav.contains(target)) return;
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  }

  // Reveal on scroll
  const revealItems = Array.from(document.querySelectorAll('.reveal'));
  if (revealItems.length) {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    }, { threshold: 0.12 });
    revealItems.forEach(el => io.observe(el));
  }

  // Current year
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  // Blog search (filters cards on /blog/)
  const blogSearch = document.querySelector('[data-blog-search]');
  if (blogSearch instanceof HTMLInputElement) {
    const items = Array.from(document.querySelectorAll('[data-blog-item]'))
      .filter((el) => el instanceof HTMLElement);
    const empty = document.querySelector('[data-blog-empty]');

    const apply = (qRaw) => {
      const q = String(qRaw || '').trim().toLowerCase();
      let visible = 0;
      for (const el of items) {
        const hay = (el.textContent || '').toLowerCase();
        const show = !q || hay.includes(q);
        el.style.display = show ? '' : 'none';
        if (show) visible += 1;
      }
      if (empty instanceof HTMLElement) {
        empty.style.display = visible === 0 ? '' : 'none';
      }
    };

    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') || '';
    blogSearch.value = q;
    apply(q);
    blogSearch.addEventListener('input', () => apply(blogSearch.value));
  }

  // CTA tracking helpers (works even if analytics is disabled)
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const el = target.closest('[data-cta]') || target.closest('[data-conversion]');
    if (!(el instanceof HTMLElement)) return;

    const eventName = el.getAttribute('data-cta');
    if (eventName && typeof window.trackEvent === 'function') {
      window.trackEvent(eventName, { href: el.getAttribute('href') || undefined });
    }

    const conversion = el.getAttribute('data-conversion');
    if (conversion && typeof window.trackConversion === 'function') {
      window.trackConversion(conversion);
    }
  });
})();
