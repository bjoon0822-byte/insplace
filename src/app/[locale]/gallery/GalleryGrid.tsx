'use client';

import { useState } from 'react';
import Link from 'next/link';
import { t } from '@/i18n/request';
import type { GalleryItem } from '@/data/gallery';

interface GalleryGridProps {
  items: GalleryItem[];
  locale: string;
  messages: Record<string, unknown>;
}

const CATEGORIES = ['all', 'digital', 'lightbox', 'cafe', 'popup'] as const;

export default function GalleryGrid({ items, locale, messages }: GalleryGridProps) {
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? items : items.filter((i) => i.category === filter);

  return (
    <>
      {/* Filter tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        marginBottom: '2rem',
      }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            type="button"
            style={{
              padding: '8px 16px',
              borderRadius: '999px',
              border: filter === cat ? 'none' : '1px solid var(--gray-200)',
              background: filter === cat ? 'var(--accent)' : 'transparent',
              color: filter === cat ? '#fff' : 'var(--gray-600)',
              fontWeight: filter === cat ? 600 : 400,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {t(messages, `gallery.${cat}`)}
          </button>
        ))}
      </div>

      {/* Gallery masonry grid */}
      {filtered.length === 0 ? (
        <p style={{ color: 'var(--gray-500)', textAlign: 'center', padding: '4rem' }}>
          {t(messages, 'gallery.noItems')}
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
        }}>
          {filtered.map((item) => (
            <div
              key={item.id}
              style={{
                background: 'var(--bg-main)',
                border: '1px solid var(--gray-200)',
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'all 0.3s',
              }}
            >
              {/* Image placeholder */}
              <div style={{
                aspectRatio: '4/3',
                background: 'var(--gray-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gray-400)',
                fontSize: '0.9rem',
                position: 'relative',
              }}>
                <span>{item.title}</span>
                <span style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: '999px',
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  textTransform: 'uppercase',
                }}>
                  {item.category}
                </span>
              </div>

              {/* Info */}
              <div style={{ padding: '1rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: '4px' }}>
                  {item.artistName}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                  {item.location} · {item.date}
                </p>

                {item.adProductId && (
                  <Link
                    href={`/${locale}/ad/${item.adProductId}`}
                    style={{
                      display: 'inline-block',
                      marginTop: '10px',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      color: 'var(--accent)',
                      textDecoration: 'none',
                    }}
                  >
                    {t(messages, 'gallery.viewProduct')} →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
