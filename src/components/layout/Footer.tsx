import Link from 'next/link';
import { Locale } from '@/types';
import { t } from '@/i18n/request';
import styles from './Footer.module.css';

interface FooterProps {
  locale: Locale;
  messages: Record<string, unknown>;
}

export default function Footer({ locale, messages }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles['footer-inner']}>
        <div className={styles['footer-top']}>
          {/* 브랜드 및 연락처 */}
          <div className={styles['footer-brand']}>
            <p className={styles['footer-desc']}>
              {t(messages, 'brand.description')}
            </p>
            <a href="mailto:hello@insplace.com" className={styles['footer-email']}>
              hello@insplace.com
            </a>
          </div>

          {/* 링크 칼럼 컨테이너 */}
          <div className={styles['footer-links']}>
            <div className={styles['footer-column']}>
              <h4>{t(messages, 'footer.columns.service')}</h4>
              <ul>
                <li><Link href={`/${locale}/ad`}>{t(messages, 'nav.ad')}</Link></li>
                <li><Link href={`/${locale}/venue`}>{t(messages, 'nav.venue')}</Link></li>
                <li><Link href={`/${locale}/goods`}>{t(messages, 'nav.goods')}</Link></li>
                <li><Link href={`/${locale}/popup`}>{t(messages, 'nav.popup')}</Link></li>
              </ul>
            </div>

            <div className={styles['footer-column']}>
              <h4>{t(messages, 'footer.columns.company')}</h4>
              <ul>
                <li><Link href={`/${locale}/trend`}>{t(messages, 'nav.trend')}</Link></li>
                <li><a href="#">{t(messages, 'footer.terms')}</a></li>
                <li><a href="#">{t(messages, 'footer.privacy')}</a></li>
              </ul>
            </div>
            
            <div className={styles['footer-social']}>
              <a href="#" className={styles['social-link']} aria-label="Instagram">Instagram</a>
              <a href="#" className={styles['social-link']} aria-label="Twitter">Twitter</a>
              <a href="#" className={styles['social-link']} aria-label="YouTube">YouTube</a>
            </div>
          </div>
        </div>

        {/* BigC 스타일 슬로건 */}
        <p style={{ textAlign: 'center', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '1rem' }}>
          DIVE INTO YOUR FANDOM
        </p>

        {/* 거대한 타이포그래피 로고 */}
        <div className={styles['footer-huge-logo']}>
          INSPLACE
        </div>

        {/* 하단 카피라이트 */}
        <div className={styles['footer-bottom']}>
          <p className={styles['footer-copyright']}>
            {t(messages, 'footer.copyright')}
          </p>
          <div className={styles['footer-legal']}>
            <span>Seoul, Korea</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
