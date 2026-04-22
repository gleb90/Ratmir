# Сайт преподавателя гитары (статический)

Это быстрый статический сайт без сборки: HTML + CSS + JS. Подходит для размещения на любом хостинге (GitHub Pages, Netlify, Vercel Static, shared hosting).

## Что уже сделано
- Стильный мягкий дизайн, адаптив под телефон/планшет/десктоп
- Страницы под SEO: главная, уроки, цены, о преподавателе, контакты, блог + отдельный лендинг под Google Ads
- Базовая SEO-оптимизация:
  - семантическая разметка, правильные заголовки
  - уникальные `title`/`description` на страницах
  - Open Graph / Twitter карточки
  - JSON‑LD (schema.org) для персоны/сайта/статей
  - `robots.txt` и `sitemap.xml`
- Подготовка под Google Ads/Analytics:
  - баннер согласия (analytics on/off)
  - заготовка `gtag.js` (GA4 + Google Ads) с событиями для CTA
  - конверсия на странице `thanks.html` (после формы)

## Что заменить под вашего друга (самое важное)
1. Контакты (телефон/мессенджеры/соцсети):
   - в HTML: ищите `+7 (000) 000‑00‑00`, `@username`, `https://...`
2. Город/район:
   - ищите `Ваш город` на страницах
3. Домен:
   - в `<link rel="canonical">` и в `sitemap.xml`/`robots.txt` сейчас стоит `https://example.com/`
4. Google Ads / GA4:
   - файл [js/analytics.js](/c:/Users/gsham/OneDrive/Desktop/SiteRatmir/js/analytics.js)
   - замените `G-XXXXXXXXXX` и `AW-XXXXXXXXXX`, а также `AW-.../LABEL` для конверсии
5. Форма:
   - на странице контактов можно подключить Formspree/любую форму:
     - в [kontakty.html](/c:/Users/gsham/OneDrive/Desktop/SiteRatmir/kontakty.html) задайте `data-endpoint="https://..."` (сейчас пусто)

## Рекомендуемая структура рекламы (Google Ads)
- Вести трафик на лендинг:
  - `/lp/uroki-gitary-dlya-detei.html`
- Конверсия:
  - отправка формы ведет на `/thanks.html` (там уже есть вызов `trackConversion(...)`)

