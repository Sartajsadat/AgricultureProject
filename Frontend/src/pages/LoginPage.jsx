import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Lock } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import LanguageSwitcher from '../components/layout/LanguageSwitcher';
import ThemeToggle from '../components/layout/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const LOGO_SRC = '/logo-placeholder.svg';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      const redirectTo = location.state?.from || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(t('login.error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-page__toolbar">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <div className="login-card">
        <img src={LOGO_SRC} alt="" className="login-card__logo" />
        <h1 className="login-card__title">{t('login.title')}</h1>
        <p className="login-card__subtitle">{t('login.subtitle')}</p>

        <form className="login-card__form" onSubmit={handleSubmit}>
          <Input
            type="email"
            icon={Mail}
            label={t('login.email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
          <Input
            type="password"
            icon={Lock}
            label={t('login.password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            error={error}
            required
          />
          <Button type="submit" loading={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {t('login.submit')}
          </Button>
        </form>
      </div>
    </div>
  );
}
