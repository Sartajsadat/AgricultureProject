import { LayoutDashboard, Users, ShieldCheck } from 'lucide-react';

// ✅ Each item declares which role(s) can see it. Sidebar.jsx just filters
// this list against the current user's roles — it has no per-role branching
// logic of its own. To add a new tab for a new role later:
//   1. Add an entry here with the right `roles` array.
//   2. Add the matching <Route> in routes/AppRoutes.jsx.
// Nothing about the Navbar/Sidebar shell needs to change.
export const navItems = [
  {
    key: 'dashboard',
    labelKey: 'nav.dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'USER'], // visible to every known role
  },
  {
    key: 'userManagement',
    labelKey: 'nav.userManagement',
    path: '/admin/users',
    icon: Users,
    roles: ['ADMIN'],
  },
  {
    key: 'roles',
    labelKey: 'nav.roles',
    path: '/admin/roles',
    icon: ShieldCheck,
    roles: ['ADMIN'],
  },
];

export function getNavItemsForRoles(userRoles = []) {
  return navItems.filter((item) => item.roles.some((r) => userRoles.includes(r)));
}
