'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import LoginModal from '@/components/auth/LoginModal';
import type { Locale } from '@/types';
import styles from '../community.module.css';
import { t } from '@/i18n/request';
import subStyles from '../../subpage.module.css';

interface PostData {
  id: string;
  title: string;
  content: string;
  category: string;
  like_count: number;
  comment_count: number;
  view_count: number;
  created_at: string;
  author_id: string;
  author: { nickname: string } | null;
}

interface CommentData {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  author: { nickname: string } | null;
}

interface PostDetailProps {
  postId: string;
  locale: Locale;
  messages: Record<string, unknown>;
}

export default function PostDetail({ postId, locale, messages }: PostDetailProps) {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [post, setPost] = useState<PostData | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [commentText, setCommentText] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showLogin, setShowLogin] = useState(false);

  const fetchPost = useCallback(async () => {
    const { data } = await supabase
      .from('posts')
      .select('*, author:profiles!author_id(nickname)')
      .eq('id', postId)
      .single();

    if (data) {
      const p = {
        ...data,
        author: Array.isArray(data.author) ? data.author[0] : data.author,
      } as PostData;
      setPost(p);
      setLikeCount(p.like_count);

      // Increment view count
      await supabase.from('posts').update({ view_count: (p.view_count || 0) + 1 }).eq('id', postId);
    }
  }, [postId]);

  const fetchComments = useCallback(async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, author:profiles!author_id(nickname)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (data) {
      setComments(data.map((row: Record<string, unknown>) => ({
        ...row,
        author: Array.isArray(row.author) ? row.author[0] : row.author,
      })) as CommentData[]);
    }
  }, [postId]);

  const checkLiked = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle();
    setLiked(!!data);
  }, [postId, user]);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [fetchPost, fetchComments]);

  useEffect(() => {
    checkLiked();
  }, [checkLiked]);

  async function handleLike() {
    if (!user) { setShowLogin(true); return; }

    if (liked) {
      await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', user.id);
      setLiked(false);
      setLikeCount((c) => Math.max(0, c - 1));
      await supabase.from('posts').update({ like_count: Math.max(0, likeCount - 1) }).eq('id', postId);
    } else {
      await supabase.from('likes').insert({ post_id: postId, user_id: user.id });
      setLiked(true);
      setLikeCount((c) => c + 1);
      await supabase.from('posts').update({ like_count: likeCount + 1 }).eq('id', postId);
    }
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { setShowLogin(true); return; }
    if (!commentText.trim()) return;

    await supabase.from('comments').insert({
      post_id: postId,
      author_id: user.id,
      content: commentText.trim(),
    });

    setCommentText('');
    fetchComments();
    // refresh post comment count
    setPost((p) => p ? { ...p, comment_count: p.comment_count + 1 } : p);
  }

  async function handleDeleteComment(commentId: string) {
    await supabase.from('comments').delete().eq('id', commentId);
    fetchComments();
    setPost((p) => p ? { ...p, comment_count: Math.max(0, p.comment_count - 1) } : p);
  }

  async function handleDeletePost() {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    await supabase.from('posts').delete().eq('id', postId);
    router.push(`/${locale}/community`);
  }

  if (!post) {
    return (
      <div className={styles.detailWrap} style={{ textAlign: 'center', padding: '80px 24px' }}>
        <p style={{ color: 'var(--gray-400)' }}>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.detailWrap}>
        <Link href={`/${locale}/community`} className={subStyles.backLink}>
          ← {t(messages, 'community.back')}
        </Link>

        {/* Post Header */}
        <div className={styles.detailHeader}>
          <span className={styles.detailCategoryBadge}>
            {t(messages, `community.category${post.category.charAt(0).toUpperCase() + post.category.slice(1)}`)}
          </span>
          <h1 className={styles.detailTitle}>{post.title}</h1>
          <div className={styles.detailAuthorRow}>
            <div className={styles.detailAvatar}>
              {post.author?.nickname?.charAt(0)?.toUpperCase() ?? '?'}
            </div>
            <div className={styles.detailAuthorInfo}>
              <span className={styles.detailAuthorName}>{post.author?.nickname ?? '?'}</span>
              <span className={styles.detailDate}>
                {new Date(post.created_at).toLocaleDateString()} · {t(messages, 'community.views')} {post.view_count}
              </span>
            </div>
            {user?.id === post.author_id && (
              <div className={styles.detailStatsRow}>
                <button onClick={handleDeletePost} style={{ color: 'var(--danger)', fontSize: '0.8125rem' }}>
                  {t(messages, 'community.delete')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className={styles.detailContent}>{post.content}</div>

        {/* Like Button */}
        <div className={styles.likeRow}>
          <button
            className={`${styles.likeBtn} ${liked ? styles.likeBtnActive : ''}`}
            onClick={handleLike}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {t(messages, 'community.likes')} {likeCount}
          </button>
        </div>

        {/* Comments */}
        <div className={styles.commentsSection}>
          <h3 className={styles.commentsTitle}>
            {t(messages, 'community.comments')} ({comments.length})
          </h3>

          <form className={styles.commentForm} onSubmit={handleComment}>
            <input
              className={styles.commentInput}
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={profile ? t(messages, 'community.commentPlaceholder') : t(messages, 'community.loginRequired')}
              disabled={!profile}
            />
            <button type="submit" className={styles.commentSubmitBtn} disabled={!profile}>
              {t(messages, 'community.commentSubmit')}
            </button>
          </form>

          <div className={styles.commentList}>
            {comments.map((c) => (
              <div key={c.id} className={styles.commentItem}>
                <div className={styles.commentHeader}>
                  <span className={styles.commentAuthor}>{c.author?.nickname ?? '?'}</span>
                  <span className={styles.commentDate}>
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                  {user?.id === c.author_id && (
                    <button
                      className={styles.commentDeleteBtn}
                      onClick={() => handleDeleteComment(c.id)}
                    >
                      {t(messages, 'community.delete')}
                    </button>
                  )}
                </div>
                <p className={styles.commentContent}>{c.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} messages={messages} />
      )}
    </>
  );
}
