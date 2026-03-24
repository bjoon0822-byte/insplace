// 포트폴리오 갤러리 페이지
import Link from 'next/link';
import { Locale } from '@/types';
import { getMessages, t } from '@/i18n/request';
import { galleryItems } from '@/data/gallery';
import { FadeIn } from '@/components/ui/FadeIn';
import GalleryGrid from './GalleryGrid';
import styles from '../subpage.module.css';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return [{ locale: 'ko' }, { locale: 'en' }, { locale: 'ja' }, { locale: 'zh' }];
}

export default async function GalleryPage({ params }: PageProps) {
  const { locale } = await params;
  const m = await getMessages(locale as Locale);

  return (
    <>
      <section className={styles.pageHero}>
        <span className={styles.pageWatermark}>GALLERY.</span>
        <div className={styles.pageHeroInner}>
          <FadeIn direction="up">
            <span className={styles.pageEyebrow}>PORTFOLIO</span>
            <h1 className={styles.pageTitle}>{t(m, 'gallery.title')}</h1>
            <p className={styles.pageSubtitle}>{t(m, 'gallery.subtitle')}</p>
          </FadeIn>
        </div>
      </section>

      <div className={styles.sectionContainer}>
        <GalleryGrid items={galleryItems} locale={locale} messages={m} />
      </div>
    </>
  );
}
