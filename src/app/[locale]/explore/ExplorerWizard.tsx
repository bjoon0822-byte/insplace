'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { Locale, AdPurpose, ScaleTier, AdProduct, Venue, GoodsItem } from '@/types';
import { filterByExplorerState, budgetTierToRange, countByRegion } from '@/lib/recommendation';
import { formatPrice } from '@/utils/format';
import styles from './explore.module.css';

interface Props {
  locale: Locale;
  messages: Record<string, unknown>;
  initialStep: number;
  initialRegion: string | null;
  initialBudget: string | null;
  initialScale: string | null;
  initialPurpose: string | null;
}

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === 'string' ? current : path;
}

const REGIONS = [
  { id: '서울-마포', label: '홍대/마포', icon: '🚇' },
  { id: '서울-강남', label: '강남', icon: '🏙️' },
  { id: '서울-성동', label: '성수', icon: '🎨' },
  { id: '서울-중구', label: '명동/중구', icon: '🛍️' },
  { id: '서울-강남2', label: '삼성/COEX', icon: '🎧' },
  { id: '서울-영등포', label: '여의도/영등포', icon: '🌃' },
  { id: '서울-송파', label: '잠실', icon: '🎪' },
  { id: '서울-광진', label: '건대/광진', icon: '🎓' },
  { id: '서울-용산', label: '이태원/용산', icon: '🌏' },
  { id: '서울-종로', label: '혜화/대학로', icon: '🎭' },
  { id: '부산-해운대', label: '해운대/부산', icon: '🏖️' },
  { id: '대구-동성로', label: '동성로/대구', icon: '🌆' },
];

const BUDGETS = [
  { id: 'budget', labelKey: 'explore.budgetBudget' },
  { id: 'standard', labelKey: 'explore.budgetStandard' },
  { id: 'premium', labelKey: 'explore.budgetPremium' },
  { id: 'luxury', labelKey: 'explore.budgetLuxury' },
];

const SCALES: Array<{ id: ScaleTier; labelKey: string; desc: string }> = [
  { id: 'small', labelKey: 'explore.scaleSmall', desc: 'CM보드, 소형 디스플레이' },
  { id: 'medium', labelKey: 'explore.scaleMedium', desc: '디지털 사이니지, 조명광고' },
  { id: 'large', labelKey: 'explore.scaleLarge', desc: '빌보드, 대형 LED' },
  { id: 'mega', labelKey: 'explore.scaleMega', desc: '15대 스크린, 환승통로 전체' },
];

const PURPOSES: Array<{ id: AdPurpose; labelKey: string; icon: string }> = [
  { id: 'birthday', labelKey: 'explore.purposeBirthday', icon: '🎂' },
  { id: 'debut', labelKey: 'explore.purposeDebut', icon: '⭐' },
  { id: 'comeback', labelKey: 'explore.purposeComeback', icon: '🎵' },
  { id: 'concert', labelKey: 'explore.purposeConcert', icon: '🎤' },
  { id: 'anniversary', labelKey: 'explore.purposeAnniversary', icon: '💝' },
  { id: 'drama', labelKey: 'explore.purposeDrama', icon: '🎬' },
  { id: 'general', labelKey: 'explore.purposeGeneral', icon: '📢' },
];

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 80 : -80, opacity: 0, scale: 0.97 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -80 : 80, opacity: 0, scale: 0.97 }),
};

export default function ExplorerWizard({
  locale, messages, initialStep, initialRegion, initialBudget, initialScale, initialPurpose,
}: Props) {
  const router = useRouter();
  const [step, setStep] = useState(Math.min(Math.max(initialStep, 1), 5));
  const [direction, setDirection] = useState(1);
  const [region, setRegion] = useState<string | null>(initialRegion);
  const [budget, setBudget] = useState<string | null>(initialBudget);
  const [scale, setScale] = useState<string | null>(initialScale);
  const [purpose, setPurpose] = useState<string | null>(initialPurpose);

  // 지역 카드 클릭 시 props가 바뀌면 위저드 상태 동기화
  useEffect(() => {
    if (initialRegion && initialRegion !== region) {
      setRegion(initialRegion);
    }
    if (initialStep && initialStep !== step) {
      setDirection(1);
      setStep(Math.min(Math.max(initialStep, 1), 5));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRegion, initialStep]);

  const t = useCallback(
    (key: string) => getNestedValue(messages, key),
    [messages],
  );

  const regionCounts = useMemo(() => countByRegion(), []);

  const filteredResults = useMemo(() => {
    return filterByExplorerState({
      region,
      budgetRange: budget ? budgetTierToRange(budget) : null,
      scaleTier: scale as ScaleTier | null,
      purpose: purpose as AdPurpose | null,
    });
  }, [region, budget, scale, purpose]);

  const totalResults = filteredResults.ads.length + filteredResults.venues.length + filteredResults.goods.length;

  const updateUrl = useCallback((s: number, r: string | null, b: string | null, sc: string | null, p: string | null) => {
    const params = new URLSearchParams();
    params.set('step', String(s));
    if (r) params.set('region', r);
    if (b) params.set('budget', b);
    if (sc) params.set('scale', sc);
    if (p) params.set('purpose', p);
    router.replace(`/${locale}/explore?${params.toString()}`, { scroll: false });
  }, [locale, router]);

  const goNext = () => {
    const next = Math.min(step + 1, 5);
    setDirection(1);
    setStep(next);
    updateUrl(next, region, budget, scale, purpose);
  };

  const goPrev = () => {
    const prev = Math.max(step - 1, 1);
    setDirection(-1);
    setStep(prev);
    updateUrl(prev, region, budget, scale, purpose);
  };

  const selectAndNext = (setter: (v: string | null) => void, value: string) => {
    setter(value);
    setTimeout(() => goNext(), 200);
  };

  // Selection summary for display
  const selectionSummary = useMemo(() => {
    const items: Array<{ step: number; label: string }> = [];
    if (region) {
      const found = REGIONS.find((r) => r.id === region);
      items.push({ step: 1, label: found?.label || region });
    }
    if (budget) items.push({ step: 2, label: t(`explore.budget${budget.charAt(0).toUpperCase() + budget.slice(1)}`) });
    if (scale) items.push({ step: 3, label: t(`explore.scale${scale.charAt(0).toUpperCase() + scale.slice(1)}`) });
    if (purpose) items.push({ step: 4, label: t(`explore.purpose${purpose.charAt(0).toUpperCase() + purpose.slice(1)}`) });
    return items;
  }, [region, budget, scale, purpose, t]);

  // Progress line fill percentage (0 → 100)
  const progressPercent = ((Math.min(step, 4) - 1) / 3) * 100;

  return (
    <div id="explorer-wizard" className={styles.wizard}>
      {/* Progress bar */}
      <div className={styles.progressBar}>
        {/* Animated fill line */}
        <motion.div
          className={styles.progressFill}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`${styles.progressStep} ${s <= step ? styles.progressActive : ''} ${s === step ? styles.progressCurrent : ''}`}
          >
            <motion.span
              className={styles.progressDot}
              animate={s <= step ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {s < step ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : s}
            </motion.span>
            <span className={styles.progressLabel}>
              {t(`explore.step${s}`)}
            </span>
          </div>
        ))}
      </div>

      {/* Selection summary strip */}
      {selectionSummary.length > 0 && step <= 4 && (
        <motion.div
          className={styles.selectionStrip}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {selectionSummary.map((item) => (
            <motion.button
              key={item.step}
              className={styles.selectionChip}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => {
                setDirection(-1);
                setStep(item.step);
                updateUrl(item.step, region, budget, scale, purpose);
              }}
            >
              {item.label}
              <span className={styles.selectionChipEdit}>✎</span>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Step content */}
      <AnimatePresence mode="wait" custom={direction}>
        {step === 1 && (
          <motion.div
            key="step1"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={styles.stepContent}
          >
            <h2 className={styles.stepTitle}>{t('explore.step1Desc')}</h2>
            <div className={styles.optionGrid}>
              {REGIONS.map((r) => (
                <button
                  key={r.id}
                  className={`${styles.optionCard} ${region === r.id ? styles.optionSelected : ''}`}
                  onClick={() => selectAndNext(setRegion, r.id)}
                >
                  <span className={styles.optionIcon}>{r.icon}</span>
                  <span className={styles.optionLabel}>{r.label}</span>
                  <span className={styles.optionCount}>{regionCounts[r.id] || 0}개 상품</span>
                </button>
              ))}
              <button
                className={`${styles.optionCard} ${region === null ? styles.optionSelected : ''}`}
                onClick={() => { setRegion(null); goNext(); }}
              >
                <span className={styles.optionIcon}>🌐</span>
                <span className={styles.optionLabel}>{t('explore.regionAll')}</span>
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={styles.stepContent}
          >
            <h2 className={styles.stepTitle}>{t('explore.step2Desc')}</h2>
            <div className={styles.optionGrid}>
              {BUDGETS.map((b) => (
                <button
                  key={b.id}
                  className={`${styles.optionCard} ${budget === b.id ? styles.optionSelected : ''}`}
                  onClick={() => selectAndNext(setBudget, b.id)}
                >
                  <span className={styles.optionLabel}>{t(b.labelKey)}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={styles.stepContent}
          >
            <h2 className={styles.stepTitle}>{t('explore.step3Desc')}</h2>
            <div className={styles.optionGrid}>
              {SCALES.map((s) => (
                <button
                  key={s.id}
                  className={`${styles.optionCard} ${scale === s.id ? styles.optionSelected : ''}`}
                  onClick={() => selectAndNext(setScale, s.id)}
                >
                  <span className={styles.optionLabel}>{t(s.labelKey)}</span>
                  <span className={styles.optionDesc}>{s.desc}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={styles.stepContent}
          >
            <h2 className={styles.stepTitle}>{t('explore.step4Desc')}</h2>
            <div className={styles.optionGrid}>
              {PURPOSES.map((p) => (
                <button
                  key={p.id}
                  className={`${styles.optionCard} ${purpose === p.id ? styles.optionSelected : ''}`}
                  onClick={() => { setPurpose(p.id); setDirection(1); setStep(5); updateUrl(5, region, budget, scale, p.id); }}
                >
                  <span className={styles.optionIcon}>{p.icon}</span>
                  <span className={styles.optionLabel}>{t(p.labelKey)}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="step5"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={styles.stepContent}
          >
            <h2 className={styles.stepTitle}>{t('explore.resultTitle')}</h2>

            {/* Filter badges */}
            <div className={styles.filterBadges}>
              {region && <span className={styles.filterBadge}>{REGIONS.find((r) => r.id === region)?.label || region}</span>}
              {budget && <span className={styles.filterBadge}>{t(`explore.budget${budget.charAt(0).toUpperCase() + budget.slice(1)}`)}</span>}
              {scale && <span className={styles.filterBadge}>{t(`explore.scale${scale.charAt(0).toUpperCase() + scale.slice(1)}`)}</span>}
              {purpose && <span className={styles.filterBadge}>{t(`explore.purpose${purpose.charAt(0).toUpperCase() + purpose.slice(1)}`)}</span>}
            </div>

            {totalResults === 0 ? (
              <div className={styles.emptyState}>
                <p>{t('explore.noResults')}</p>
                <p className={styles.emptyHint}>{t('explore.changeFilters')}</p>
              </div>
            ) : (
              <>
                {/* Ads */}
                {filteredResults.ads.length > 0 && (
                  <div className={styles.resultSection}>
                    <h3 className={styles.resultSectionTitle}>{t('explore.ads')} ({filteredResults.ads.length})</h3>
                    <div className={styles.resultGrid}>
                      {filteredResults.ads.map((ad: AdProduct) => (
                        <Link key={ad.id} href={`/${locale}/ad/${ad.id}`} className={styles.resultCard}>
                          <div className={styles.resultImageWrap}>
                            <Image src={ad.imageUrl} alt={ad.nameKey} fill sizes="(max-width: 768px) 50vw, 33vw" className={styles.resultImage} />
                            <span className={`${styles.availBadge} ${styles[`avail_${ad.availability}`]}`}>
                              {ad.availability === 'available' ? '예약가능' : ad.availability === 'busy' ? '문의' : '마감'}
                            </span>
                          </div>
                          <div className={styles.resultBody}>
                            <span className={styles.resultType}>{ad.type.toUpperCase()}</span>
                            <h4 className={styles.resultName}>{ad.nameKey}</h4>
                            <p className={styles.resultMeta}>{ad.location}</p>
                            <p className={styles.resultPrice}>₩{formatPrice(ad.price)} / {ad.pricePeriod}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Venues */}
                {filteredResults.venues.length > 0 && (
                  <div className={styles.resultSection}>
                    <h3 className={styles.resultSectionTitle}>{t('explore.venues')} ({filteredResults.venues.length})</h3>
                    <div className={styles.resultGrid}>
                      {filteredResults.venues.map((venue: Venue) => (
                        <Link key={venue.id} href={`/${locale}/venue/${venue.id}`} className={styles.resultCard}>
                          <div className={styles.resultImageWrap}>
                            <Image src={venue.imageUrl} alt={venue.nameKey} fill sizes="(max-width: 768px) 50vw, 33vw" className={styles.resultImage} />
                          </div>
                          <div className={styles.resultBody}>
                            <h4 className={styles.resultName}>{venue.nameKey}</h4>
                            <p className={styles.resultMeta}>{venue.location}</p>
                            <p className={styles.resultPrice}>₩{formatPrice(venue.pricePerDay)} / 일</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Goods */}
                {filteredResults.goods.length > 0 && (
                  <div className={styles.resultSection}>
                    <h3 className={styles.resultSectionTitle}>{t('explore.goods')} ({filteredResults.goods.length})</h3>
                    <div className={styles.resultGrid}>
                      {filteredResults.goods.map((item: GoodsItem) => (
                        <Link key={item.id} href={`/${locale}/goods/${item.id}`} className={styles.resultCard}>
                          <div className={styles.resultImageWrap}>
                            <Image src={item.imageUrl} alt={item.nameKey} fill sizes="(max-width: 768px) 50vw, 33vw" className={styles.resultImage} />
                          </div>
                          <div className={styles.resultBody}>
                            <span className={styles.resultType}>{item.category.toUpperCase()}</span>
                            <h4 className={styles.resultName}>{item.nameKey}</h4>
                            <p className={styles.resultPrice}>₩{formatPrice(item.price)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className={styles.navButtons}>
        {step > 1 && (
          <button onClick={goPrev} className={styles.navBtn}>
            ← {t('explore.prev')}
          </button>
        )}
        {step < 5 && step > 1 && (
          <button onClick={goNext} className={styles.navBtnSkip}>
            {t('explore.skip')} →
          </button>
        )}
      </div>
    </div>
  );
}
