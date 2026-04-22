(() => {
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
