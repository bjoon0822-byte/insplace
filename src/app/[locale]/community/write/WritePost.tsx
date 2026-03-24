'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Locale } from '@/types';
import { t } from '@/i18n/request';
import styles from '../community.module.css';

interface WritePostProps {
  locale: Locale;
  messages: Record<string, unknown>;
}

export default function WritePost({ locale, messages }: WritePostProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('free');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    setError('');

    const { data, error: insertError } = await supabase
      .from('posts')
      .insert({
        author_id: user.id,
        title: title.trim(),
        content: content.trim(),
        category,
      })
      .select('id')
      .single();

    if (!insertError && data) {
      router.push(`/${locale}/community/${data.id}`);
    } else {
      setError(t(messages, 'community.writeError') || '게시글 작성에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className={styles.writeForm} style={{ textAlign: 'center', padding: '80px 24px' }}>
        <p style={{ color: 'var(--gray-500)' }}>{t(messages, 'community.loginRequired')}</p>
        <Link
          href={`/${locale}/community`}
          style={{ color: 'var(--accent)', marginTop: '16px', display: 'inline-block' }}
        >
          ← {t(messages, 'community.back')}
        </Link>
      </div>
    );
  }

  return (
    <form className={styles.writeForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="write-category">{t(messages, 'community.postCategory')}</label>
        <select
          id="write-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="free">{t(messages, 'community.categoryFree')}</option>
          <option value="review">{t(messages, 'community.categoryReview')}</option>
          <option value="info">{t(messages, 'community.categoryInfo')}</option>
          <option value="question">{t(messages, 'community.categoryQuestion')}</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="write-title">{t(messages, 'community.postTitle')}</label>
        <input
          id="write-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t(messages, 'community.postTitlePlaceholder')}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="write-content">{t(messages, 'community.postContent')}</label>
        <textarea
          id="write-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t(messages, 'community.postContentPlaceholder')}
          required
        />
      </div>

      {error && (
        <p role="alert" style={{ color: 'var(--danger)', fontSize: '0.875rem', fontWeight: 600 }}>
          {error}
        </p>
      )}

      <div className={styles.writeActions}>
        <Link href={`/${locale}/community`} className={styles.cancelBtn}>
          {t(messages, 'community.cancel')}
        </Link>
        <button type="submit" className={styles.writeBtn} disabled={loading}>
          {loading ? '...' : t(messages, 'community.submit')}
        </button>
      </div>
    </form>
  );
}
