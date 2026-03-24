import { Locale } from '@/types';
import { getMessages, t } from '@/i18n/request';
import { FadeIn } from '@/components/ui/FadeIn';
import ExplorerWizard from './ExplorerWizard';
import styles from '../subpage.module.css';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

export async function generateStaticParams() {
  return ['ko', 'en', 'ja', 'zh'].map((locale) => ({ locale }));
}

export default async function ExplorePage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const search = await searchParams;
  const m = await getMessages(locale as Locale);

  return (
    <>
      <section className={styles.pageHero}>
        <span className={styles.pageWatermark}>EXPLORE.</span>
        <div className={styles.pageHeroInner}>
          <FadeIn direction="up">
            <span className={styles.pageEyebrow}>SMART EXPLORER</span>
            <h1 className={styles.pageTitle}>{t(m, 'explore.title')}</h1>
            <p className={styles.pageSubtitle}>{t(m, 'explore.subtitle')}</p>
          </FadeIn>
        </div>
      </section>

      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px' }}>
        <ExplorerWizard
          locale={locale as Locale}
          messages={m as Record<string, unknown>}
          initialStep={search.step ? parseInt(search.step, 10) : 1}
          initialRegion={search.region || null}
          initialBudget={search.budget || null}
          initialScale={search.scale || null}
          initialPurpose={search.purpose || null}
        />
      </section>
    </>
  );
}
