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
                <li><Link href={`/${locale}/community`}>{t(messages, 'nav.community')}</Link></li>
                <li><Link href={`/${locale}/contact`}>{t(messages, 'nav.contact')}</Link></li>
              </ul>
            </div>

            <div className={styles['footer-social']}>
              <a href="https://instagram.com/insplace_official" target="_blank" rel="noopener noreferrer" className={styles['social-link']}>Instagram</a>
              <a href="https://x.com/insplace_kr" target="_blank" rel="noopener noreferrer" className={styles['social-link']}>X (Twitter)</a>
              <a href="https://youtube.com/@insplace" target="_blank" rel="noopener noreferrer" className={styles['social-link']}>YouTube</a>
            </div>
          </div>
        </div>

        {/* BigC 스타일 슬로건 */}
        <p className={styles['footer-slogan']}>
          DIVE INTO YOUR FANDOM
        </p>

        {/* 거대한 타이포그래피 로고 */}
        <div className={styles['footer-huge-logo']}>
          INSPLACE
        </div>

        {/* 사업자 정보 */}
        <div className={styles['footer-business']}>
          <p>인스플레이스 | 대표: 김인스 | 사업자등록번호: 000-00-00000</p>
          <p>통신판매업신고: 제2025-서울강남-00000호 | 서울특별시 강남구</p>
          <p>고객센터: hello@insplace.com</p>
        </div>

        {/* 하단 카피라이트 */}
        <div className={styles['footer-bottom']}>
          <p className={styles['footer-copyright']}>
            {t(messages, 'footer.copyright')}
          </p>
          <div className={styles['footer-legal']}>
            <Link href={`/${locale}/terms`}>{t(messages, 'footer.terms')}</Link>
            <span>·</span>
            <Link href={`/${locale}/privacy`}>{t(messages, 'footer.privacy')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
