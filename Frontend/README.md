# Agriculture Directorate — Admin Frontend

React + Vite frontend for the RBAC backend we built.

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env` if your backend isn't on `http://localhost:1996`:
```
VITE_API_BASE_URL=http://localhost:1996/api
```

Then:
```bash
npm run dev
```

Opens at `http://localhost:5173`. Log in with your admin credentials
(e.g. `admin@ss.com` / `123456`).

## Replacing the logo

Swap `public/logo-placeholder.svg` for your real logo file. If it's a
different filename/extension, update the `LOGO_SRC` constant in:
- `src/components/layout/Navbar.jsx`
- `src/pages/LoginPage.jsx`

## Adding a new role/sidebar tab later

1. Add the page component under `src/pages/`.
2. Add one entry to `src/config/navConfig.js` with the roles allowed to see it.
3. Add the matching `<Route>` in `src/routes/AppRoutes.jsx`.

Nothing in `AppLayout`, `Navbar`, or `Sidebar` needs to change — they're
driven entirely by that config file.

## Adding a new UI component later

Use the existing tokens in `src/styles/tokens.css`
(`var(--color-primary)`, `var(--space-4)`, `var(--radius-md)`, etc.)
instead of hardcoded values, and it'll automatically match the rest of
the app — including dark mode, since every token has a light and dark
value already defined.

## RTL (Pashto / Dari)

Layout mirroring is handled by CSS logical properties
(`inset-inline-start`, `margin-inline`, `text-align: start`) and native
flexbox direction-awareness — not manual `if (rtl)` branches. If you add
new layout CSS, prefer logical properties over `left`/`right` so it
keeps mirroring for free.

The Pashto/Dari translation strings in `src/i18n/locales/ps.json` and
`da.json` are a solid first pass but should be reviewed by a native
speaker before shipping to real users.

## Known gaps / next steps

- No refresh-token flow — token expiry just forces re-login (matches
  the backend, which doesn't issue refresh tokens either).
- `UserManagementPage` has no edit/delete UI yet, only status toggle —
  the backend endpoints (`PUT /api/users/{id}`, `DELETE /api/users/{id}`)
  are ready whenever you want to wire them in.
- No pagination on the user list yet — fine for small teams, worth
  adding if the user count grows.
- Sidebar collapses to icon-only under 900px width; no mobile drawer/
  overlay yet if you want a true mobile nav.
