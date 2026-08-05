// ✅ Pure dev/testing convenience: remembers the last few things you typed
// into a given form so you can one-click refill instead of retyping every
// field each time you're creating test data. Lives in localStorage, so it's
// per-browser only — nothing is ever sent to the backend.
//
// Deliberately NEVER stores passwords — see AddUserModal for how the
// password field is handled when a recent entry is picked.

const PREFIX = 'form_history:';
const MAX_ENTRIES = 6;

export function getFormHistory(key) {
  try {
    return JSON.parse(localStorage.getItem(PREFIX + key) || '[]');
  } catch {
    return [];
  }
}

export function saveFormHistory(key, entry, dedupeBy = 'email') {
  const existing = getFormHistory(key);
  const filtered = existing.filter((e) => e[dedupeBy] !== entry[dedupeBy]);
  const updated = [entry, ...filtered].slice(0, MAX_ENTRIES);
  localStorage.setItem(PREFIX + key, JSON.stringify(updated));
}

export function clearFormHistory(key) {
  localStorage.removeItem(PREFIX + key);
}
