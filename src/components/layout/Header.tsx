'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Locale } from '@/types';
import { t } from '@/i18n/request';
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

interface HeaderProps {
  locale: Locale;
  messages: Record<string, unknown>;
}

export default function Header({ locale, messages }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { key: 'nav.ad', href: `/${locale}/ad` },
    { key: 'nav.venue', href: `/${locale}/venue` },
    { key: 'nav.goods', href: `/${locale}/goods` },
    { key: 'nav.popup', href: `/${locale}/popup` },
    { key: 'nav.trend', href: `/${locale}/trend` },
  ];

  return (
    <header className={styles.header}>
      <div className={styles['header-inner']}>
        {/* 로고 */}
        <Link href={`/${locale}`} className={styles['header-logo']}>
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

          {/* 문의하기 버튼 */}
          <Link href={`/${locale}/contact`} className="btn btn-primary btn-small">
            {t(messages, 'nav.contact')}
          </Link>

          {/* 모바일 토글 */}
          <button
            className={styles['mobile-toggle']}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
