/* Google Ads + GA4 (gtag.js) bootstrap.
   IMPORTANT: Set real ids below, then publish.
   GA4 example:   G-ABCDE12345
   Google Ads:    AW-123456789
   Conversion:    AW-123456789/AbCdEfGhIjkLmNoPqR
*/

(() => {
  const CONFIG = {
    ga4Id: 'G-XXXXXXXXXX',
    adsId: 'AW-XXXXXXXXXX',
    conversionSendTo: 'AW-XXXXXXXXXX/XXXXXXXXXXXXXXX'
  };

  // Prepare consent mode defaults (no external requests are made here)
  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });

  // Public helpers used by main.js + thanks.html
  window.trackEvent = (name, params = {}) => {
    if (!name) return;
    window.gtag('event', name, params);
  };

  window.trackConversion = (label = 'lead') => {
    // For Ads: use the explicit send_to string configured above.
    if (CONFIG.conversionSendTo.includes('XXXXXXXX')) return;
    window.gtag('event', 'conversion', {
      send_to: CONFIG.conversionSendTo,
      event_label: label
    });
  };

  let loaded = false;
  const loadScript = (id) => new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load gtag.js'));
    document.head.appendChild(s);
  });

  window.initAnalytics = async () => {
    if (loaded) return;
    if (CONFIG.ga4Id.includes('XXXXXXXX') && CONFIG.adsId.includes('XXXXXXXX')) return;

    loaded = true;
    window.gtag('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted'
    });

    // Prefer GA4 id for loader; it still supports Ads config below.
    const loaderId = !CONFIG.ga4Id.includes('XXXXXXXX') ? CONFIG.ga4Id : CONFIG.adsId;
    try {
      await loadScript(loaderId);
    } catch {
      return;
    }

    window.gtag('js', new Date());

    if (!CONFIG.ga4Id.includes('XXXXXXXX')) {
      window.gtag('config', CONFIG.ga4Id, {
        anonymize_ip: true,
        allow_google_signals: true
      });
    }
    if (!CONFIG.adsId.includes('XXXXXXXX')) {
      window.gtag('config', CONFIG.adsId);
    }
  };
})();
