'use client';

import { useState } from 'react';
import { useQuote } from '@/contexts/QuoteContext';
import { Locale } from '@/types';
import QuoteDrawer from './QuoteDrawer';
import styles from './QuoteFAB.module.css';

interface QuoteFABProps {
  locale: Locale;
  messages: Record<string, unknown>;
}

export default function QuoteFAB({ locale, messages }: QuoteFABProps) {
  const { items } = useQuote();
  const [open, setOpen] = useState(false);

  if (items.length === 0) return null;

  return (
    <>
      <button
        className={styles.fab}
        onClick={() => setOpen(true)}
        aria-label="Open quote cart"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        <span className={styles.badge}>{items.length}</span>
      </button>

      {open && (
        <QuoteDrawer locale={locale} messages={messages} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
