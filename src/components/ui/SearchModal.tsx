'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Locale } from '@/types';
import { adProducts } from '@/data/ads';
import { venues } from '@/data/venues';
import { goodsItems } from '@/data/goods';
import { popupEvents } from '@/data/popups';
import { t } from '@/i18n/request';
import styles from './SearchModal.module.css';

interface SearchResult {
  type: 'ad' | 'venue' | 'goods' | 'popup';
  id: string;
  name: string;
  meta: string;
  href: string;
  icon: string;
}

interface SearchModalProps {
  locale: Locale;
  messages: Record<string, unknown>;
  onClose: () => void;
}

export default function SearchModal({ locale, messages, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Build search index from static data + i18n
  const allItems = useMemo<SearchResult[]>(() => {
    const items: SearchResult[] = [];

    for (const ad of adProducts) {
      const name = (messages as Record<string, Record<string, Record<string, string>>>).adData?.[ad.id]?.name || ad.nameKey;
      const loc = (messages as Record<string, Record<string, Record<string, string>>>).adData?.[ad.id]?.location || ad.location;
      items.push({
        type: 'ad',
        id: ad.id,
        name,
        meta: `${loc} · ${ad.region}`,
        href: `/${locale}/ad/${ad.id}`,
        icon: '📺',
      });
    }

    for (const venue of venues) {
      const name = (messages as Record<string, Record<string, Record<string, string>>>).venueData?.[venue.id]?.name || venue.nameKey;
      const loc = (messages as Record<string, Record<string, Record<string, string>>>).venueData?.[venue.id]?.location || venue.location;
      items.push({
        type: 'venue',
        id: venue.id,
        name,
        meta: `${loc} · ${venue.capacity}${t(messages, 'venue.people')}`,
        href: `/${locale}/venue/${venue.id}`,
        icon: '🏠',
      });
    }

    for (const item of goodsItems) {
      items.push({
        type: 'goods',
        id: item.id,
        name: item.nameKey,
        meta: t(messages, `goods.${item.category}`),
        href: `/${locale}/goods/${item.id}`,
        icon: '🎁',
      });
    }

    for (const popup of popupEvents) {
      items.push({
        type: 'popup',
        id: popup.id,
        name: popup.nameKey,
        meta: `${popup.location} · ${popup.startDate}`,
        href: `/${locale}/popup/${popup.id}`,
        icon: '🎪',
      });
    }

    return items;
  }, [locale, messages]);

  // Filter results
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allItems.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.meta.toLowerCase().includes(q)
    );
  }, [query, allItems]);

  // Group results by type
  const grouped = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    for (const r of results) {
      if (!groups[r.type]) groups[r.type] = [];
      groups[r.type].push(r);
    }
    return groups;
  }, [results]);

  const flatResults = results;

  // Keyboard nav
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, flatResults.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && flatResults[activeIndex]) {
        e.preventDefault();
        const href = flatResults[activeIndex].href;
        onClose();
        window.location.href = href;
      } else if (e.key === 'Escape') {
        onClose();
      }
    },
    [flatResults, activeIndex, onClose]
  );

  // Reset index when query changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Scroll active item into view
  useEffect(() => {
    const container = resultsRef.current;
    if (!container) return;
    const active = container.querySelector(`.${styles.active}`);
    if (active) {
      active.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const groupLabelMap: Record<string, string> = {
    ad: t(messages, 'search.ads'),
    venue: t(messages, 'search.venues'),
    goods: t(messages, 'search.goods'),
    popup: t(messages, 'search.popups'),
  };

  let itemIndex = -1;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        {/* Input */}
        <div className={styles.inputWrap}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            className={styles.input}
            type="text"
            placeholder={t(messages, 'search.placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className={styles.shortcutHint}>
            <kbd>ESC</kbd>
          </div>
        </div>

        {/* Results */}
        <div className={styles.results} ref={resultsRef}>
          {query.trim() && results.length === 0 && (
            <div className={styles.empty}>
              <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <p className={styles.emptyTitle}>{t(messages, 'search.noResults')}</p>
              <p className={styles.emptyDesc}>{t(messages, 'search.tryAnother')}</p>
            </div>
          )}

          {Object.entries(grouped).map(([type, items]) => (
            <div key={type} className={styles.group}>
              <div className={styles.groupLabel}>
                {groupLabelMap[type] || type}
              </div>
              {items.map((item) => {
                itemIndex++;
                const idx = itemIndex;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`${styles.item} ${idx === activeIndex ? styles.active : ''}`}
                    onClick={onClose}
                    onMouseEnter={() => setActiveIndex(idx)}
                  >
                    <span className={styles.itemIcon}>{item.icon}</span>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemName}>{item.name}</div>
                      <div className={styles.itemMeta}>{item.meta}</div>
                    </div>
                    <svg className={styles.itemArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.footerKeys}>
            <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
            <span><kbd>↵</kbd> open</span>
            <span><kbd>esc</kbd> close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
