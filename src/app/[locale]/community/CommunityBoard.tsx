'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import LoginModal from '@/components/auth/LoginModal';
import type { Locale } from '@/types';
import { t } from '@/i18n/request';
import styles from './community.module.css';

interface PostRow {
  id: string;
  title: string;
  category: string;
  like_count: number;
  comment_count: number;
  view_count: number;
  created_at: string;
  author: { nickname: string } | null;
}

interface CommunityBoardProps {
  locale: Locale;
  messages: Record<string, unknown>;
}

const categories = ['all', 'free', 'review', 'info', 'question'] as const;

export default function CommunityBoard({ locale, messages }: CommunityBoardProps) {
  const { profile } = useAuth();
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showLogin, setShowLogin] = useState(false);

  const fetchPosts = useCallback(async () => {
    let query = supabase
      .from('posts')
      .select('id, title, category, like_count, comment_count, view_count, created_at, author:profiles!author_id(nickname)')
      .order('created_at', { ascending: false })
      .limit(50);

    if (activeCategory !== 'all') {
      query = query.eq('category', activeCategory);
    }

    const { data } = await query;
    if (data) {
      setPosts(data.map((row: Record<string, unknown>) => ({
        ...row,
        author: Array.isArray(row.author) ? row.author[0] : row.author,
      })) as PostRow[]);
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    return d.toLocaleDateString();
  }

  const categoryKey: Record<string, string> = {
    all: 'ad.filterAll',
    free: 'community.categoryFree',
    review: 'community.categoryReview',
    info: 'community.categoryInfo',
    question: 'community.categoryQuestion',
  };

  return (
    <>
      <div className={styles.boardContainer}>
        {/* Category Tabs */}
        <div className={styles.categoryTabs}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.categoryTab} ${activeCategory === cat ? styles.categoryTabActive : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {t(messages, categoryKey[cat])}
            </button>
          ))}
        </div>

        {/* Board Header */}
        <div className={styles.boardHeader}>
          <div />
          {profile ? (
            <Link href={`/${locale}/community/write`} className={styles.writeBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              {t(messages, 'community.writePost')}
            </Link>
          ) : (
            <button className={styles.writeBtn} onClick={() => setShowLogin(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              {t(messages, 'community.writePost')}
            </button>
          )}
        </div>

        {/* Post List */}
        {posts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <p className={styles.emptyTitle}>{t(messages, 'community.noPostsYet')}</p>
            <p className={styles.emptyDesc}>{t(messages, 'community.writeFirst')}</p>
          </div>
        ) : (
          <div className={styles.postList}>
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/${locale}/community/${post.id}`}
                className={styles.postItem}
              >
                <span className={styles.postCategory} data-category={post.category}>
                  {t(messages, `community.category${post.category.charAt(0).toUpperCase() + post.category.slice(1)}`)}
                </span>
                <div className={styles.postMain}>
                  <div className={styles.postTitle}>{post.title}</div>
                  <div className={styles.postMeta}>
                    <span className={styles.postAuthor}>{post.author?.nickname ?? '?'}</span>
                    <span>·</span>
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                </div>
                <div className={styles.postStats}>
                  <span className={styles.postStat}>
                    <svg className={styles.postStatIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    {post.like_count}
                  </span>
                  <span className={styles.postStat}>
                    <svg className={styles.postStatIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    {post.comment_count}
                  </span>
                  <span className={styles.postStat}>
                    <svg className={styles.postStatIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {post.view_count}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} messages={messages} />
      )}
    </>
  );
}
