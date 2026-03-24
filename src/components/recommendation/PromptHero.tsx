'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Locale, RecommendationResult, ParsedIntent } from '@/types';
import RecommendationResults from './RecommendationResults';
import styles from './PromptHero.module.css';

interface PromptHeroProps {
  locale: Locale;
  messages: Record<string, unknown>;
}

const EXAMPLE_PROMPTS = [
  '4월 25일 홍대에서 생일 광고 3일간',
  '50만원 예산으로 강남역 디지털 사이니지',
  '성수동 카페 대관 + 포토카드 제작',
  '데뷔 기념일 합정역 조명 광고',
];

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

export default function PromptHero({ locale, messages }: PromptHeroProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RecommendationResult[] | null>(null);
  const [intent, setIntent] = useState<ParsedIntent | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const t = useCallback(
    (key: string) => getNestedValue(messages, key),
    [messages],
  );

  // Typewriter placeholder animation
  useEffect(() => {
    if (query) return; // Don't animate when user is typing

    const target = EXAMPLE_PROMPTS[placeholderIndex];
    let charIndex = 0;
    let direction: 'typing' | 'deleting' | 'pause' = 'typing';

    const interval = setInterval(() => {
      if (direction === 'typing') {
        charIndex++;
        setDisplayedPlaceholder(target.slice(0, charIndex));
        if (charIndex >= target.length) {
          direction = 'pause';
          setTimeout(() => {
            direction = 'deleting';
          }, 2000);
        }
      } else if (direction === 'deleting') {
        charIndex--;
        setDisplayedPlaceholder(target.slice(0, charIndex));
        if (charIndex <= 0) {
          setPlaceholderIndex((prev) => (prev + 1) % EXAMPLE_PROMPTS.length);
          clearInterval(interval);
        }
      }
    }, 60);

    return () => clearInterval(interval);
  }, [placeholderIndex, query]);

  const handleSubmit = async () => {
    const trimmed = query.trim();
    if (trimmed.length < 2 || loading) return;

    setLoading(true);
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: trimmed, locale }),
      });
      const data = await res.json();
      if (res.ok) {
        setResults(data.results);
        setIntent(data.intent);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChipClick = (prompt: string) => {
    setQuery(prompt);
    setResults(null);
    setIntent(null);
    inputRef.current?.focus();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <span className={styles.eyebrow}>AI RECOMMENDATION</span>
        <h1 className={styles.title}>{t('recommend.title')}</h1>
        <p className={styles.subtitle}>{t('recommend.subtitle')}</p>

        <div className={styles.inputRow}>
          <div className={styles.inputWrap}>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setResults(null);
                setIntent(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder={query ? '' : displayedPlaceholder || t('recommend.placeholder')}
              className={styles.input}
              autoComplete="off"
            />
            <button
              onClick={handleSubmit}
              disabled={query.trim().length < 2 || loading}
              className={styles.submitBtn}
            >
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className={styles.chips}>
          {EXAMPLE_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleChipClick(prompt)}
              className={styles.chip}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className={styles.loadingArea}>
          <div className={styles.skeletonGrid}>
            {[0, 1, 2].map((i) => (
              <div key={i} className={styles.skeletonCard} />
            ))}
          </div>
          <p className={styles.loadingText}>{t('recommend.loading')}</p>
        </div>
      )}

      {results && intent && (
        <RecommendationResults
          results={results}
          intent={intent}
          locale={locale}
          messages={messages}
        />
      )}
    </div>
  );
}
