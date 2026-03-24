'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Locale, LEVEL_THRESHOLDS, UserLevel } from '@/types';
import { t } from '@/i18n/request';
import styles from './mypage.module.css';

const levelColors: Record<string, string> = {
  newbie: '#A3A3A3',
  fan: '#10B981',
  superfan: '#3B82F6',
  master: '#8B5CF6',
  legend: '#D97706',
};

function getNextLevel(current: UserLevel): { next: UserLevel | null; threshold: number } {
  const levels: UserLevel[] = ['newbie', 'fan', 'superfan', 'master', 'legend'];
  const idx = levels.indexOf(current);
  if (idx >= levels.length - 1) return { next: null, threshold: 0 };
  const nextLvl = levels[idx + 1];
  return { next: nextLvl, threshold: LEVEL_THRESHOLDS[nextLvl] };
}

interface MyPageContentProps {
  locale: Locale;
  messages: Record<string, unknown>;
}

interface PostItem {
  id: string;
  title: string;
  category: string;
  created_at: string;
}

interface ReviewItem {
  id: string;
  target_type: string;
  target_id: string;
  rating: number;
  content: string;
  created_at: string;
}

export default function MyPageContent({ locale, messages }: MyPageContentProps) {
  const { profile, loading } = useAuth();
  const [tab, setTab] = useState<'posts' | 'reviews' | 'quotes'>('posts');
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (!profile) return;

    if (tab === 'posts') {
      supabase
        .from('posts')
        .select('id, title, category, created_at')
        .eq('author_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(20)
        .then(({ data }) => {
          if (data) setPosts(data);
        });
    } else if (tab === 'reviews') {
      supabase
        .from('reviews')
        .select('id, target_type, target_id, rating, content, created_at')
        .eq('author_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(20)
        .then(({ data }) => {
          if (data) setReviews(data);
        });
    }
  }, [profile, tab]);

  if (loading) {
    return <div className={styles.container}><p style={{ textAlign: 'center', color: 'var(--gray-400)' }}>Loading...</p></div>;
  }

  if (!profile) {
    return (
      <div className={styles.container}>
        <div className={styles.loginPrompt}>
          <h2 className={styles.loginPromptTitle}>{t(messages, 'mypage.title')}</h2>
          <p className={styles.loginPromptDesc}>{t(messages, 'community.loginRequired')}</p>
          <Link href={`/${locale}/community`} className="btn btn-primary">
            {t(messages, 'community.login')}
          </Link>
        </div>
      </div>
    );
  }

  const { next, threshold } = getNextLevel(profile.level);
  const currentThreshold = LEVEL_THRESHOLDS[profile.level];
  const progressPct = next
    ? Math.min(100, Math.round(((profile.points - currentThreshold) / (threshold - currentThreshold)) * 100))
    : 100;

  return (
    <div className={styles.container}>
      {/* Profile Card */}
      <div className={styles.profileCard}>
        <div className={styles.profileTop}>
          <div
            className={styles.avatar}
            style={{ borderColor: levelColors[profile.level] || '#A3A3A3' }}
          >
            {profile.nickname.charAt(0).toUpperCase()}
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.profileName}>{profile.nickname}</div>
            <div className={styles.profileMeta}>
              <span
                className={styles.levelBadge}
                style={{ color: levelColors[profile.level], background: `${levelColors[profile.level]}15` }}
              >
                {t(messages, `community.level${profile.level.charAt(0).toUpperCase() + profile.level.slice(1)}`)}
              </span>
              <span>{profile.points} {t(messages, 'community.points')}</span>
              <span>{t(messages, 'mypage.joinDate')}: {new Date(profile.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div className={styles.levelSection}>
          <div className={styles.levelHeader}>
            <span className={styles.levelLabel}>
              {next
                ? `${t(messages, 'mypage.nextLevel')}: ${t(messages, `community.level${next.charAt(0).toUpperCase() + next.slice(1)}`)}`
                : 'MAX LEVEL'}
            </span>
            <span className={styles.levelProgress}>
              {profile.points} / {next ? threshold : profile.points}
            </span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{profile.post_count}</div>
            <div className={styles.statLabel}>{t(messages, 'community.postCount')}</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{profile.comment_count}</div>
            <div className={styles.statLabel}>{t(messages, 'community.commentCount')}</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{profile.review_count}</div>
            <div className={styles.statLabel}>{t(messages, 'community.reviewCount')}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'posts' ? styles.tabActive : ''}`}
          onClick={() => setTab('posts')}
        >
          {t(messages, 'mypage.tabPosts')}
        </button>
        <button
          className={`${styles.tab} ${tab === 'reviews' ? styles.tabActive : ''}`}
          onClick={() => setTab('reviews')}
        >
          {t(messages, 'mypage.tabReviews')}
        </button>
        <button
          className={`${styles.tab} ${tab === 'quotes' ? styles.tabActive : ''}`}
          onClick={() => setTab('quotes')}
        >
          {t(messages, 'mypage.tabQuotes')}
        </button>
      </div>

      {/* Tab Content */}
      {tab === 'posts' && (
        posts.length === 0 ? (
          <div className={styles.emptyState}>
            <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <p className={styles.emptyText}>{t(messages, 'mypage.noPosts')}</p>
          </div>
        ) : (
          <div>
            {posts.map((post) => (
              <Link key={post.id} href={`/${locale}/community/${post.id}`} className={styles.listItem}>
                <div className={styles.listItemInfo}>
                  <div className={styles.listItemTitle}>{post.title}</div>
                  <div className={styles.listItemMeta}>
                    {t(messages, `community.category${post.category.charAt(0).toUpperCase() + post.category.slice(1)}`)} · {new Date(post.created_at).toLocaleDateString()}
                  </div>
                </div>
                <svg className={styles.listItemArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            ))}
          </div>
        )
      )}

      {tab === 'reviews' && (
        reviews.length === 0 ? (
          <div className={styles.emptyState}>
            <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <p className={styles.emptyText}>{t(messages, 'mypage.noReviews')}</p>
          </div>
        ) : (
          <div>
            {reviews.map((review) => (
              <div key={review.id} className={styles.listItem}>
                <div className={styles.listItemInfo}>
                  <div className={styles.listItemTitle}>
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)} {review.content.slice(0, 50)}
                  </div>
                  <div className={styles.listItemMeta}>
                    {review.target_type} · {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'quotes' && (
        <div className={styles.emptyState}>
          <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <p className={styles.emptyText}>{t(messages, 'mypage.noQuotes')}</p>
        </div>
      )}
    </div>
  );
}
