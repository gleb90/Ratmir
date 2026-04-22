(() => {
  const KEY = 'guitar_consent_v1';
  const banner = document.getElementById('consent');
  if (!banner) return;

  const btnAccept = banner.querySelector('[data-consent-accept]');
  const btnDecline = banner.querySelector('[data-consent-decline]');
  const btnReset = document.querySelector('[data-consent-reset]');

  const read = () => {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
  };
  const write = (value) => {
    localStorage.setItem(KEY, JSON.stringify(value));
  };
  const open = () => banner.classList.add('is-open');
  const close = () => banner.classList.remove('is-open');

  const consent = read();
  if (!consent) {
    open();
  } else {
    if (consent.analytics === true && typeof window.initAnalytics === 'function') {
      window.initAnalytics();
    }
  }

  btnAccept?.addEventListener('click', () => {
    write({ analytics: true, ts: Date.now() });
    close();
    if (typeof window.initAnalytics === 'function') window.initAnalytics();
  });

  btnDecline?.addEventListener('click', () => {
    write({ analytics: false, ts: Date.now() });
    close();
  });

  btnReset?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem(KEY);
    open();
  });
})();

