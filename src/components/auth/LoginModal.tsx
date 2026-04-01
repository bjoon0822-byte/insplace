'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { t } from '@/i18n/request';
import styles from './LoginModal.module.css';

interface LoginModalProps {
  onClose: () => void;
  messages: Record<string, unknown>;
}

export default function LoginModal({ onClose, messages }: LoginModalProps) {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithKakao } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // ESC key + focus trapping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    // Focus first input on open
    const timer = setTimeout(() => {
      modalRef.current?.querySelector<HTMLElement>('input')?.focus();
    }, 100);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'login') {
      const { error: err } = await signInWithEmail(email, password);
      if (err) {
        setError(err);
        setLoading(false);
      } else {
        onClose();
      }
    } else {
      if (!nickname.trim()) {
        setError(t(messages, 'community.nicknameRequired'));
        setLoading(false);
        return;
      }
      const { error: err, needsConfirmation } = await signUpWithEmail(email, password, nickname.trim());
      if (err) {
        setError(err);
        setLoading(false);
      } else if (needsConfirmation) {
        setSuccess(t(messages, 'community.signupSuccess'));
        setLoading(false);
      } else {
        onClose();
      }
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label={mode === 'login' ? t(messages, 'community.login') : t(messages, 'community.signup')}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} ref={modalRef}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </button>

        <h2 className={styles.title}>
          {mode === 'login' ? t(messages, 'community.login') : t(messages, 'community.signup')}
        </h2>
        <p className={styles.subtitle}>{t(messages, 'community.authSubtitle')}</p>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${mode === 'login' ? styles.tabActive : ''}`}
            onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
          >
            {t(messages, 'community.login')}
          </button>
          <button
            className={`${styles.tab} ${mode === 'signup' ? styles.tabActive : ''}`}
            onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
          >
            {t(messages, 'community.signup')}
          </button>
        </div>

        {error && <div className={styles.error} role="alert">{error.startsWith('auth.') ? t(messages, error) : error}</div>}
        {success && <div className={styles.success} role="status">{success}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className={styles.inputGroup}>
              <label htmlFor="auth-nickname">{t(messages, 'community.nickname')}</label>
              <input
                id="auth-nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={t(messages, 'community.nicknamePlaceholder')}
                required
              />
            </div>
          )}
          <div className={styles.inputGroup}>
            <label htmlFor="auth-email">{t(messages, 'community.email')}</label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="auth-password">{t(messages, 'community.password')}</label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t(messages, 'community.passwordPlaceholder')}
              required
              minLength={6}
            />
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? '...' : (mode === 'login' ? t(messages, 'community.login') : t(messages, 'community.signup'))}
          </button>
        </form>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <div className={styles.socialBtns}>
          <button className={styles.googleBtn} onClick={signInWithGoogle} type="button">
            <svg className={styles.googleIcon} viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google {t(messages, 'community.login')}
          </button>

          <button className={styles.kakaoBtn} onClick={signInWithKakao} type="button">
            <svg className={styles.kakaoIcon} viewBox="0 0 24 24">
              <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.72 1.8 5.108 4.508 6.457-.147.53-.946 3.412-.978 3.627 0 0-.02.165.087.228.107.063.233.014.233.014.307-.043 3.558-2.326 4.118-2.72.664.093 1.347.143 2.032.143 5.523 0 10-3.463 10-7.749S17.523 3 12 3z" fill="#3C1E1E"/>
            </svg>
            {t(messages, 'community.kakaoLogin')}
          </button>
        </div>
      </div>
    </div>
  );
}
