// ✅ Single source of truth for which languages are RTL.
// Everything else (Navbar mirroring, Sidebar side, icon order) derives
// from the `dir` attribute this sets on <html> — nothing else needs to
// know which languages are RTL.
export const RTL_LANGUAGES = ['ps', 'da'];

export function getDirection(lang) {
  return RTL_LANGUAGES.includes(lang) ? 'rtl' : 'ltr';
}

export function applyDocumentDirection(lang) {
  const dir = getDirection(lang);
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', lang);
}
