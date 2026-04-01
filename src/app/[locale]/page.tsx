// 메인 홈페이지 — 인스플레이스 (Supanova Redesign)
// AI프롬프트Hero + 서비스벤토 + 인기상품 + 추천대관 + 트렌드(다크) + CTA(드라마틱)
import Link from 'next/link';
import Image from 'next/image';
import { Locale, AdProduct, Venue } from '@/types';
import { getMessages, t } from '@/i18n/request';
import { formatPrice } from '@/utils/format';
import { adProducts } from '@/data/ads';
import { venues } from '@/data/venues';
import { celebTrend, adTrend, eventTrend } from '@/data/trends';
import { FadeIn } from '@/components/ui/FadeIn';
import HeroScrollAnimation from '@/components/ui/HeroScrollAnimation';
import ChatHero from '@/components/chat/ChatHero';
import HomeTrend from '@/components/trend/HomeTrend';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const m = await getMessages(locale as Locale);

  const topAds = adProducts.slice(0, 4);
  const topVenues = venues.slice(0, 3);

  function getAvailText(status: string): string {
    if (status === 'available') return t(m, 'ad.available');
    if (status === 'busy') return t(m, 'ad.busy');
    return t(m, 'ad.soldout');
  }

  return (
    <>
      {/* ━━ Hero — AI Prompt + Scroll Animation Background ━━ */}
      <section id="hero" className={styles.hero}>
        <HeroScrollAnimation />
        <div className={styles.heroBgOverlay} />
        {/* Mesh gradient orbs */}
        <div className={styles.heroOrb1} />
        <div className={styles.heroOrb2} />
        <span className={styles.heroWatermark}>INSPLACE.</span>

        <div className={styles.heroLayout}>
          {/* Left — Brand Copy */}
          <FadeIn direction="up" className={styles.heroContent}>
            <span className={styles.heroEyebrow}>K-POP FANDOM PLATFORM</span>
            <h1 className={styles.heroTitle}>{t(m, 'hero.title')}</h1>
            <p className={styles.heroSubtitle}>{t(m, 'hero.subtitle')}</p>
            <div className={styles.heroActions}>
              <Link href={`/${locale}/ad`} className={styles.heroCta}>
                {t(m, 'hero.cta')}
                <span className={styles.heroCtaArrow}>→</span>
              </Link>
              <Link href={`/${locale}/contact`} className={styles.heroCtaGhost}>
                {t(m, 'hero.ctaSecondary')}
              </Link>
            </div>
          </FadeIn>

          {/* Right — AI Chat */}
          <FadeIn direction="up" delay={0.15} className={styles.heroChat}>
            <ChatHero locale={locale as Locale} messages={m as Record<string, unknown>} />
          </FadeIn>
        </div>

        <div className={styles.heroScrollDown}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* ━━ Service Bento (통합 — Quick Nav + Service Showcase 병합) ━━ */}
      <section className={styles.serviceSection}>
        <FadeIn>
          <div className={styles.serviceBento}>
            <Link href={`/${locale}/ad`} className={`${styles.bentoCard} ${styles.bentoLarge}`}>
              <Image src="/images/nanobanana/ad.webp" alt={t(m, 'quickNav.ad')} fill sizes="(max-width: 768px) 100vw, 50vw" className={styles.bentoBg} />
              <div className={styles.bentoOverlay} />
              <div className={styles.bentoContent}>
                <span className={styles.bentoLabel}>AD</span>
                <h3 className={styles.bentoTitle}>{t(m, 'quickNav.ad')}</h3>
                <p className={styles.bentoDesc}>{t(m, 'quickNav.adDesc')}</p>
                <span className={styles.bentoLink}>{t(m, 'sections.viewAll')} →</span>
              </div>
            </Link>
            <Link href={`/${locale}/venue`} className={styles.bentoCard}>
              <Image src="/images/nanobanana/venue.webp" alt={t(m, 'quickNav.venue')} fill sizes="(max-width: 768px) 100vw, 25vw" className={styles.bentoBg} />
              <div className={styles.bentoOverlay} />
              <div className={styles.bentoContent}>
                <span className={styles.bentoLabel}>VENUE</span>
                <h3 className={styles.bentoTitle}>{t(m, 'quickNav.venue')}</h3>
                <p className={styles.bentoDesc}>{t(m, 'quickNav.venueDesc')}</p>
              </div>
            </Link>
            <Link href={`/${locale}/goods`} className={styles.bentoCard}>
              <Image src="/images/nanobanana/goods.webp" alt={t(m, 'quickNav.goods')} fill sizes="(max-width: 768px) 100vw, 25vw" className={styles.bentoBg} />
              <div className={styles.bentoOverlay} />
              <div className={styles.bentoContent}>
                <span className={styles.bentoLabel}>GOODS</span>
                <h3 className={styles.bentoTitle}>{t(m, 'quickNav.goods')}</h3>
                <p className={styles.bentoDesc}>{t(m, 'quickNav.goodsDesc')}</p>
              </div>
            </Link>
            <Link href={`/${locale}/popup`} className={`${styles.bentoCard} ${styles.bentoWide}`}>
              <Image src="/images/nanobanana/popup.webp" alt={t(m, 'quickNav.popup')} fill sizes="(max-width: 768px) 100vw, 66vw" className={styles.bentoBg} />
              <div className={styles.bentoOverlay} />
              <div className={styles.bentoContent}>
                <span className={styles.bentoLabel}>POPUP</span>
                <h3 className={styles.bentoTitle}>{t(m, 'quickNav.popup')}</h3>
                <p className={styles.bentoDesc}>{t(m, 'quickNav.popupDesc')}</p>
                <span className={styles.bentoLink}>{t(m, 'sections.viewAll')} →</span>
              </div>
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ━━ Popular Ads — Double-Bezel Cards ━━ */}
      <section className={styles.productSection}>
        <FadeIn>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionInfo}>
              <span className={styles.sectionEyebrow}>POPULAR</span>
              <h2>{t(m, 'sections.popularAds')}</h2>
              <p>{t(m, 'sections.popularAdsDesc')}</p>
            </div>
            <Link href={`/${locale}/ad`} className={styles.viewAll}>
              {t(m, 'sections.viewAll')} →
            </Link>
          </div>
        </FadeIn>
        <div className={styles.cardsGrid}>
          {topAds.map((ad: AdProduct, idx: number) => (
            <FadeIn key={ad.id} delay={idx * 0.08} direction="up">
              <Link href={`/${locale}/ad/${ad.id}`} className={styles.doubleBezel}>
                <div className={styles.doubleBezelInner}>
                  <div className="card-image-wrap">
                    {ad.imageUrl && (
                      <Image src={ad.imageUrl} alt={(m as any).adData?.[ad.id]?.name || ad.nameKey} fill sizes="(max-width: 768px) 50vw, 25vw" className="card-image" />
                    )}
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardHeaderRow}>
                      <span className={`badge badge-${ad.availability}`}>
                        {getAvailText(ad.availability)}
                      </span>
                      <span className={styles.cardTypeLabel}>
                        {ad.type.toUpperCase()}
                      </span>
                    </div>
                    <h3 className={styles.cardTitle}>{(m as any).adData?.[ad.id]?.name || ad.nameKey}</h3>
                    <p className={styles.cardMeta}>{(m as any).adData?.[ad.id]?.location || ad.location}</p>
                    <div className={styles.cardPrice}>
                      ₩{formatPrice(ad.price)} <span>{ad.pricePeriod}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ━━ Recommended Venues ━━ */}
      <section className={styles.productSection}>
        <FadeIn>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionInfo}>
              <span className={styles.sectionEyebrow}>VENUES</span>
              <h2>{t(m, 'sections.recommendedVenues')}</h2>
              <p>{t(m, 'sections.recommendedVenuesDesc')}</p>
            </div>
            <Link href={`/${locale}/venue`} className={styles.viewAll}>
              {t(m, 'sections.viewAll')} →
            </Link>
          </div>
        </FadeIn>
        <div className={styles.venueGrid}>
          {topVenues.map((venue: Venue, idx: number) => (
            <FadeIn key={venue.id} delay={idx * 0.08} direction="up">
              <Link href={`/${locale}/venue/${venue.id}`} className={styles.doubleBezel}>
                <div className={styles.doubleBezelInner}>
                  <div className="card-image-wrap">
                    {venue.imageUrl && (
                      <Image src={venue.imageUrl} alt={(m as any).venueData?.[venue.id]?.name || venue.nameKey} fill sizes="(max-width: 768px) 50vw, 33vw" className="card-image" />
                    )}
                  </div>
                  <div className={styles.cardBody}>
                    <span className={`badge badge-${venue.availability}`} style={{ marginBottom: '12px', display: 'inline-block' }}>
                      {getAvailText(venue.availability)}
                    </span>
                    <h3 className={styles.cardTitle}>{(m as any).venueData?.[venue.id]?.name || venue.nameKey}</h3>
                    <p className={styles.cardMeta}>{(m as any).venueData?.[venue.id]?.location || venue.location}</p>
                    <div className={styles.cardPriceRow}>
                      <div className={styles.cardPrice}>
                        ₩{formatPrice(venue.pricePerDay)} <span>/ {t(m, 'venue.pricePerDay')}</span>
                      </div>
                      <span className={styles.cardCapacity}>
                        {venue.capacity}{t(m, 'venue.people')}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ━━ Trend — Premium Dark Dashboard ━━ */}
      <HomeTrend
        celebTrend={celebTrend}
        adTrend={adTrend}
        eventTrend={eventTrend}
        locale={locale}
        labels={{
          sectionTitle: t(m, 'sections.trendTitle'),
          sectionDesc: t(m, 'sections.trendDesc'),
          celebRank: t(m, 'trend.celebRank'),
          adRank: t(m, 'trend.adRank'),
          eventRank: t(m, 'trend.eventRank'),
          viewMore: t(m, 'sections.viewMore'),
        }}
        messages={m as Record<string, unknown>}
      />

      {/* ━━ CTA — Dramatic Full-Bleed ━━ */}
      <FadeIn direction="up">
        <section className={styles.ctaSection}>
          <div className={styles.ctaOrb1} />
          <div className={styles.ctaOrb2} />
          <div className={styles.ctaInner}>
            <span className={styles.ctaEyebrow}>GET STARTED</span>
            <h2 className={styles.ctaTitle}>{t(m, 'cta.title')}</h2>
            <p className={styles.ctaSubtitle}>{t(m, 'cta.subtitle')}</p>
            <Link href={`/${locale}/contact`} className={styles.ctaButton}>
              {t(m, 'cta.button')}
              <span className={styles.ctaButtonArrow}>→</span>
            </Link>
          </div>
        </section>
      </FadeIn>
    </>
  );
}
