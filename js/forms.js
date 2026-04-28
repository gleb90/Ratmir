(() => {
  const form = document.querySelector('form[data-form="contact"]');
  if (!form) return;

  const endpoint = (form.getAttribute('data-endpoint') || '').trim();
  const status = document.querySelector('[data-form-status]');

  const setStatus = (msg) => {
    if (!status) return;
    status.textContent = msg;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());

    if (typeof window.trackEvent === 'function') {
      window.trackEvent('submit_lead', { form: 'contact' });
    }

    // If endpoint is not configured, fall back to WhatsApp message.
    if (!endpoint || endpoint.includes('ваш-домен.ru')) {
      const message =
        `Здравствуйте! Хочу записаться на урок гитары.\n\n` +
        `Имя: ${payload.name || ''}\n` +
        `Возраст: ${payload.age || ''}\n` +
        `Формат: ${payload.format || ''}\n` +
        `Мой контакт: ${payload.contact || ''}\n` +
        `Сообщение: ${payload.message || ''}\n`;

      // Ratmir's WhatsApp (replace if needed)
      const phoneDigits = '77478565141';
      const url = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;
      setStatus('Открываю WhatsApp для отправки заявки...');
      window.location.href = url;
      return;
    }

    setStatus('Отправляю заявку...');

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Request failed');
      window.location.href = '/thanks.html?from=contact';
    } catch {
      setStatus('Не удалось отправить. Напишите в мессенджер или попробуйте позже.');
    }
  });
})();
