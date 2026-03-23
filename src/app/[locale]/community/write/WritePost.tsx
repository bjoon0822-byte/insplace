'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Locale } from '@/types';
import styles from '../community.module.css';

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!title.trim() || !content.trim()) return;

    setLoading(true);

    const { data, error } = await supabase
      .from('posts')
      .insert({
        author_id: user.id,
        title: title.trim(),
        content: content.trim(),
        category,
      })
      .select('id')
      .single();

    if (!error && data) {
      router.push(`/${locale}/community/${data.id}`);
    } else {
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
