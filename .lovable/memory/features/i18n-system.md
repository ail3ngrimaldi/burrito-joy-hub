---
name: i18n system
description: Lightweight i18n with browser-language autodetection, ES default, EN supported via dictionaries
type: feature
---
- I18nProvider in src/contexts/I18nContext.tsx wraps the app inside TooltipProvider in App.tsx
- useI18n() returns { lang, setLang, t(key, vars) }
- Dictionaries: src/i18n/translations.ts (UI strings) and src/i18n/products.ts (product names/descriptions/tags/variants by id)
- Auto-detect via navigator.languages on mount; persisted in localStorage key `lbd_lang`
- Manual override via LanguageToggle (src/components/LanguageToggle.tsx) shown in Navbar
- Admin dashboard intentionally NOT translated (internal Spanish only)
- index.html SEO/structured data stays in Spanish (primary market AR); document.documentElement.lang is updated dynamically
- When adding new product, add entry to productI18n in src/i18n/products.ts; otherwise UI falls back to the Spanish name/description from site.ts
