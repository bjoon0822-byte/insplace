'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import LoginModal from '@/components/auth/LoginModal';
import styles from '@/app/[locale]/community/community.module.css';

function t(messages: Record<string, unknown>, key: string): string {
  const keys = key.split('.');
  let current: unknown = messages;
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = (current as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  return typeof current === 'string' ? current : key;
}

interface ReviewData {
  id: string;
  rating: number;
  content: string;
  created_at: string;
  author_id: string;
  author: { nickname: string } | null;
}

interface ReviewSectionProps {
  targetType: 'ad' | 'venue';
  targetId: string;
  messages: Record<string, unknown>;
}

function StarIcon({ filled, size = 24, onClick }: { filled: boolean; size?: number; onClick?: () => void }) {
  return (
    <svg
      className={`${styles.star} ${filled ? styles.starFilled : ''} ${size < 20 ? styles.starSmall : ''}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default function ReviewSection({ targetType, targetId, messages }: ReviewSectionProps) {
  const { user, profile } = useAuth();
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  const fetchReviews = useCallback(async () => {
    const { data } = await supabase
      .from('reviews')
      .select('*, author:profiles!author_id(nickname)')
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .order('created_at', { ascending: false });

    if (data) {
      const mapped = data.map((row: Record<string, unknown>) => ({
        ...row,
        author: Array.isArray(row.author) ? row.author[0] : row.author,
      })) as ReviewData[];
      setReviews(mapped);

      if (user) {
        setHasReviewed(mapped.some((r) => r.author_id === user.id));
      }
    }
  }, [targetType, targetId, user]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { setShowLogin(true); return; }
    if (rating === 0 || !content.trim()) return;

    await supabase.from('reviews').insert({
      author_id: user.id,
      target_type: targetType,
      target_id: targetId,
      rating,
      content: content.trim(),
    });

    setRating(0);
    setContent('');
    fetchReviews();
  }

  return (
    <>
      <div className={styles.reviewSection}>
        <h3 className={styles.reviewSectionTitle}>
          {t(messages, 'community.reviews')} ({reviews.length})
        </h3>

        {/* Summary */}
        <div className={styles.reviewSummary}>
          <div>
            <div className={styles.reviewAvgScore}>{avgRating}</div>
            <div className={styles.reviewAvgLabel}>{t(messages, 'community.avgRating')}</div>
          </div>
          <div className={styles.starRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <StarIcon key={n} filled={n <= Math.round(Number(avgRating))} size={20} />
            ))}
          </div>
        </div>

        {/* Write Review Form */}
        {profile && !hasReviewed && (
          <form className={styles.reviewForm} onSubmit={handleSubmit}>
            <div className={styles.reviewFormRow}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--gray-700)' }}>
                {t(messages, 'community.rating')}
              </span>
              <div
                className={styles.starRow}
                onMouseLeave={() => setHoverRating(0)}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <StarIcon
                    key={n}
                    filled={n <= (hoverRating || rating)}
                    onClick={() => setRating(n)}
                  />
                ))}
              </div>
            </div>
            <textarea
              className={styles.reviewTextarea}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t(messages, 'community.reviewPlaceholder')}
            />
            <button type="submit" className={styles.writeBtn} style={{ alignSelf: 'flex-end' }}>
              {t(messages, 'community.writeReview')}
            </button>
          </form>
        )}

        {!profile && (
          <button
            className={styles.writeBtn}
            onClick={() => setShowLogin(true)}
            style={{ marginBottom: 'var(--space-xl)' }}
          >
            {t(messages, 'community.writeReview')}
          </button>
        )}

        {/* Review List */}
        <div className={styles.reviewList}>
          {reviews.map((r) => (
            <div key={r.id} className={styles.reviewItem}>
              <div className={styles.reviewItemHeader}>
                <span className={styles.reviewItemAuthor}>{r.author?.nickname ?? '?'}</span>
                <div className={styles.starRow}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <StarIcon key={n} filled={n <= r.rating} size={14} />
                  ))}
                </div>
                <span className={styles.reviewItemDate}>
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
              </div>
              {r.content && (
                <p className={styles.reviewItemContent}>{r.content}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} messages={messages} />
      )}
    </>
  );
}
