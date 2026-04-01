'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale } from '@/types';
import { t } from '@/i18n/request';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/auth/LoginModal';
import SearchModal from '@/components/ui/SearchModal';
import styles from './Header.module.css';

/** 언어 레이블 매핑 */
const langLabels: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  zh: '中文',
};

/** 언어 약어 매핑 */
const langShort: Record<Locale, string> = {
  ko: 'KO',
  en: 'EN',
  ja: 'JA',
  zh: 'ZH',
};

/** 레벨 색상 */
const levelColors: Record<string, string> = {
  newbie: '#A3A3A3',
  fan: '#10B981',
  superfan: '#3B82F6',
  master: '#8B5CF6',
  legend: '#D97706',
};

interface HeaderProps {
  locale: Locale;
  messages: Record<string, unknown>;
}

export default function Header({ locale, messages }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { profile, loading, signOut } = useAuth();
  const pathname = usePathname();

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    // 홈페이지에서 스크롤된 상태면 히어로로 스크롤
    const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, locale]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const navLinks = [
    { key: 'nav.explore', href: `/${locale}/explore` },
    { key: 'nav.ad', href: `/${locale}/ad` },
    { key: 'nav.venue', href: `/${locale}/venue` },
    { key: 'nav.goods', href: `/${locale}/goods` },
    { key: 'nav.popup', href: `/${locale}/popup` },
    { key: 'nav.artists', href: `/${locale}/artists` },
    { key: 'nav.campaigns', href: `/${locale}/campaigns` },
    { key: 'nav.gallery', href: `/${locale}/gallery` },
    { key: 'nav.community', href: `/${locale}/community` },
  ];

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles['header-inner']}>
          {/* 로고 */}
          <Link href={`/${locale}`} className={styles['header-logo']} onClick={handleLogoClick}>
            <span className={styles['logo-accent']}>INS</span>PLACE
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className={`${styles['header-nav']} ${mobileOpen ? styles.open : ''}`}>
            {navLinks.map((link) => (
              <Link key={link.key} href={link.href}>
                {t(messages, link.key)}
              </Link>
            ))}
          </nav>

          {/* 액션 영역 */}
          <div className={styles['header-actions']}>
            {/* 검색 버튼 */}
            <button
              className={styles['search-btn']}
              onClick={() => setShowSearch(true)}
              aria-label="Search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className={styles['search-shortcut']}>⌘K</span>
            </button>

            {/* 언어 선택 */}
            <div className={styles['lang-switcher']}>
              <button className={styles['lang-btn']}>
                {langShort[locale]} ▾
              </button>
              <div className={styles['lang-dropdown']}>
                {(Object.keys(langLabels) as Locale[]).map((lang) => (
                  <Link
                    key={lang}
                    href={`/${lang}`}
                    className={`${styles['lang-option']} ${lang === locale ? styles.active : ''}`}
                  >
                    {langLabels[lang]}
                  </Link>
                ))}
              </div>
            </div>

            {/* 유저 상태 */}
            {!loading && (
              profile ? (
                <div className={styles['user-menu']}>
                  <button className={styles['user-btn']}>
                    <span
                      className={styles['user-avatar']}
                      style={{ borderColor: levelColors[profile.level] || '#A3A3A3' }}
                    >
                      {profile.nickname.charAt(0).toUpperCase()}
                    </span>
                    <span className={styles['user-name']}>{profile.nickname}</span>
                  </button>
                  <div className={styles['user-dropdown']}>
                    <div className={styles['user-dropdown-header']}>
                      <strong>{profile.nickname}</strong>
                      <span
                        className={styles['level-badge']}
                        style={{ color: levelColors[profile.level] }}
                      >
                        {t(messages, `community.level${profile.level.charAt(0).toUpperCase() + profile.level.slice(1)}`)}
                      </span>
                    </div>
                    <div className={styles['user-dropdown-stats']}>
                      <span>{t(messages, 'community.points')}: {profile.points}</span>
                    </div>
                    <div className={styles['user-dropdown-divider']} />
                    <Link href={`/${locale}/mypage`} className={styles['user-dropdown-item']}>
                      {t(messages, 'community.myPage')}
                    </Link>
                    <Link href={`/${locale}/community`} className={styles['user-dropdown-item']}>
                      {t(messages, 'nav.community')}
                    </Link>
                    <button
                      className={styles['user-dropdown-item']}
                      onClick={() => signOut()}
                    >
                      {t(messages, 'community.logout')}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="btn btn-primary btn-small"
                  onClick={() => setShowLogin(true)}
                >
                  {t(messages, 'community.login')}
                </button>
              )
            )}

            {/* 모바일 토글 */}
            <button
              className={`${styles['mobile-toggle']} ${mobileOpen ? styles['mobile-toggle-open'] : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} messages={messages} />
      )}

      {showSearch && (
        <SearchModal locale={locale} messages={messages} onClose={() => setShowSearch(false)} />
      )}
    </>
  );
}
