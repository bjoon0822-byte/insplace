'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CaseStudy, ProductCategory } from '@/types';
import { caseStudies } from '@/data/case-studies';
import { t } from '@/i18n/request';
import ImageLightbox from '@/components/ui/ImageLightbox';
import styles from './CaseStudySection.module.css';

interface Props {
  productId: string;
  productType: ProductCategory;
  messages: Record<string, unknown>;
}

const PURPOSE_LABELS: Record<string, string> = {
  birthday: '생일',
  debut: '데뷔',
  comeback: '컴백',
  concert: '콘서트',
  drama: '드라마',
  anniversary: '기념일',
  graduation: '졸업',
  general: '일반',
};

export default function CaseStudySection({ productId, productType, messages }: Props) {
  const [lightboxImages, setLightboxImages] = useState<string[] | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const cases = caseStudies.filter(
    (c) => c.productId === productId && c.productType === productType,
  );

  if (cases.length === 0) return null;

  function openLightbox(cs: CaseStudy, idx: number) {
    setLightboxImages(cs.imageUrls);
    setLightboxIndex(idx);
  }

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{t(messages, 'caseStudy.title')}</h3>

      <div className={styles.scrollWrap}>
        {cases.map((cs) => (
          <div
            key={cs.id}
            className={styles.card}
            onClick={() => openLightbox(cs, 0)}
          >
            <div className={styles.cardImageWrap}>
              <Image
                src={cs.imageUrls[0]}
                alt={cs.title}
                fill
                sizes="280px"
                className={styles.cardImage}
              />
              <span className={styles.purposeBadge}>
                {PURPOSE_LABELS[cs.purpose] ?? cs.purpose}
              </span>
            </div>
            <div className={styles.cardBody}>
              <span className={styles.artistName}>{cs.artistName}</span>
              <span className={styles.cardTitle}>{cs.title}</span>
              <span className={styles.cardDate}>{cs.date}</span>
              <p className={styles.cardDesc}>{cs.description}</p>
            </div>
          </div>
        ))}
      </div>

      {lightboxImages && (
        <ImageLightbox
          images={lightboxImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxImages(null)}
        />
      )}
    </section>
  );
}
