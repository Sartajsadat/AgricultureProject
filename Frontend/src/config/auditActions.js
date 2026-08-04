// ✅ Mirrors AgricultureProject.audit.entity.AuditAction on the backend.
// Add a new action there → add its key here + one line per language in
// i18n/locales/*.json under "audit.actions" → the filter dropdown and
// every badge picks it up automatically.
export const AUDIT_ACTIONS = [
  'CREATE',
  'UPDATE',
  'DELETE',
  'STATUS_CHANGE',
  'ROLE_ASSIGNED',
  'ROLE_REMOVED',
  'PASSWORD_CHANGED',
  'PASSWORD_RESET',
  'LOGIN_SUCCESS',
  'LOGIN_FAILED',
  'LOGOUT',
];

// Visual grouping for badges — not every action needs its own color, just
// its own meaning: positive, neutral change, or something that failed/was destroyed.
export const AUDIT_ACTION_TONE = {
  CREATE: 'success',
  LOGIN_SUCCESS: 'success',
  UPDATE: 'accent',
  STATUS_CHANGE: 'accent',
  ROLE_ASSIGNED: 'accent',
  ROLE_REMOVED: 'accent',
  PASSWORD_CHANGED: 'accent',
  PASSWORD_RESET: 'accent',
  DELETE: 'danger',
  LOGIN_FAILED: 'danger',
  LOGOUT: 'neutral',
};
