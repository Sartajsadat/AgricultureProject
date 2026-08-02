import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { authApi } from '../api/authApi';
import { decodeJwtPayload, isTokenExpired } from '../utils/jwt';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

function readStoredUser() {
  const token = localStorage.getItem('auth_token');
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('auth_token');
    return null;
  }
  const payload = decodeJwtPayload(token);
  const profile = JSON.parse(localStorage.getItem('auth_profile') || 'null');
  if (!payload) return null;
  return {
    email: payload.sub,
    roles: payload.roles || [],
    ...profile, // firstName, lastName, status — set at login time
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const toast = useToast();
  const { t } = useTranslation();

  const login = useCallback(
    async (email, password) => {
      const data = await authApi.login(email, password);
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem(
        'auth_profile',
        JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          status: data.status,
        })
      );
      setUser({
        email: data.email,
        roles: data.roles,
        firstName: data.firstName,
        lastName: data.lastName,
        status: data.status,
      });
      toast.success(t('auth.loginSuccess', { name: data.firstName }));
      return data;
    },
    [toast, t]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // Even if the network call fails, still clear local session.
    }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_profile');
    setUser(null);
    toast.success(t('auth.logoutSuccess'));
  }, [toast, t]);

  const hasRole = useCallback((role) => !!user?.roles?.includes(role), [user]);

  const hasAnyRole = useCallback((roles) => roles.some((r) => user?.roles?.includes(r)), [user]);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, logout, hasRole, hasAnyRole }),
    [user, login, logout, hasRole, hasAnyRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
