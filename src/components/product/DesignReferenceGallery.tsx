'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { DesignReference } from '@/types';
import { designReferences } from '@/data/design-references';
import { t } from '@/i18n/request';
import ImageLightbox from '@/components/ui/ImageLightbox';
import styles from './DesignReferenceGallery.module.css';

interface Props {
  productId: string;
  messages: Record<string, unknown>;
}

type FilterCategory = 'all' | 'birthday' | 'debut' | 'concert' | 'general';

const CATEGORY_KEYS: Record<FilterCategory, string> = {
  all: 'designRef.all',
  birthday: 'designRef.birthday',
  debut: 'designRef.debut',
  concert: 'designRef.concert',
  general: 'designRef.general',
};

export default function DesignReferenceGallery({ productId, messages }: Props) {
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const refs = useMemo(
    () => designReferences.filter((r) => r.productId === productId),
    [productId],
  );

  const filtered = useMemo(
    () => (filter === 'all' ? refs : refs.filter((r) => r.category === filter)),
    [refs, filter],
  );

  const lightboxImages = useMemo(
    () => filtered.map((r) => r.imageUrl),
    [filtered],
  );

  if (refs.length === 0) return null;

  const availableCategories = useMemo(() => {
    const cats = new Set(refs.map((r) => r.category));
    return (['all', 'birthday', 'debut', 'concert', 'general'] as FilterCategory[]).filter(
      (c) => c === 'all' || cats.has(c),
    );
  }, [refs]);

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{t(messages, 'designRef.title')}</h3>

      {availableCategories.length > 2 && (
        <div className={styles.filters}>
          {availableCategories.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${filter === cat ? styles.filterActive : ''}`}
              onClick={() => setFilter(cat)}
            >
              {t(messages, CATEGORY_KEYS[cat])}
            </button>
          ))}
        </div>
      )}

      <div className={styles.grid}>
        {filtered.map((ref, idx) => (
          <div
            key={ref.id}
            className={styles.thumb}
            onClick={() => setLightboxIndex(idx)}
          >
            <Image
              src={ref.imageUrl}
              alt={ref.title}
              fill
              sizes="(max-width: 480px) 50vw, 33vw"
              className={styles.thumbImage}
            />
            <div className={styles.thumbOverlay}>
              <span className={styles.thumbTitle}>{ref.title}</span>
              <span className={styles.thumbDims}>{ref.dimensions}</span>
            </div>
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={lightboxImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  );
}
