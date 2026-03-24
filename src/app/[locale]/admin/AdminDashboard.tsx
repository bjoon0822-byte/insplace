'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { t } from '@/i18n/request';
import type { Locale } from '@/types';
import styles from './admin.module.css';

interface AdminDashboardProps {
  locale: Locale;
  messages: Record<string, unknown>;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  product_ref: string | null;
  status: string;
  created_at: string;
}

interface DashboardStats {
  totalMessages: number;
  newMessages: number;
  totalUsers: number;
  totalPosts: number;
}

type Tab = 'dashboard' | 'messages' | 'community';

export default function AdminDashboard({ locale, messages }: AdminDashboardProps) {
  const { profile, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalMessages: 0,
    newMessages: 0,
    totalUsers: 0,
    totalPosts: 0,
  });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!profile || profile.role !== 'admin') return;
    loadData();
  }, [profile]);

  async function loadData() {
    setLoadingData(true);

    const [messagesRes, usersRes, postsRes] = await Promise.all([
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(50),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('posts').select('id', { count: 'exact', head: true }),
    ]);

    const msgs = (messagesRes.data || []) as ContactMessage[];
    setContactMessages(msgs);
    setStats({
      totalMessages: msgs.length,
      newMessages: msgs.filter((m) => m.status === 'new' || !m.status).length,
      totalUsers: usersRes.count || 0,
      totalPosts: postsRes.count || 0,
    });
    setLoadingData(false);
  }

  async function updateMessageStatus(id: string, status: string) {
    await supabase.from('contact_messages').update({ status }).eq('id', id);
    setContactMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
  }

  if (authLoading) {
    return (
      <div className={styles.container}>
        <p className={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  if (!profile || profile.role !== 'admin') {
    return (
      <div className={styles.container}>
        <div className={styles.accessDenied}>
          <h1>Access Denied</h1>
          <p>관리자 권한이 필요합니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <p className={styles.subtitle}>InsPlace 관리자 패널</p>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {(['dashboard', 'messages', 'community'] as Tab[]).map((t) => (
          <button
            key={t}
            className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'dashboard' ? '대시보드' : t === 'messages' ? '문의 관리' : '커뮤니티'}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {tab === 'dashboard' && (
        <div className={styles.statsGrid}>
          <StatCard label="총 문의" value={stats.totalMessages} accent />
          <StatCard label="신규 문의" value={stats.newMessages} />
          <StatCard label="가입 회원" value={stats.totalUsers} />
          <StatCard label="게시글" value={stats.totalPosts} />
        </div>
      )}

      {/* Messages Tab */}
      {tab === 'messages' && (
        <div className={styles.tableWrapper}>
          {loadingData ? (
            <p className={styles.loadingText}>Loading...</p>
          ) : contactMessages.length === 0 ? (
            <p className={styles.emptyText}>문의가 없습니다.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>상태</th>
                  <th>이름</th>
                  <th>이메일</th>
                  <th>주제</th>
                  <th>상품</th>
                  <th>날짜</th>
                  <th>액션</th>
                </tr>
              </thead>
              <tbody>
                {contactMessages.map((msg) => (
                  <tr key={msg.id}>
                    <td>
                      <span className={`${styles.badge} ${styles[`badge-${msg.status || 'new'}`]}`}>
                        {msg.status || 'new'}
                      </span>
                    </td>
                    <td>{msg.name}</td>
                    <td>{msg.email}</td>
                    <td>{msg.subject}</td>
                    <td>{msg.product_ref || '-'}</td>
                    <td>{new Date(msg.created_at).toLocaleDateString()}</td>
                    <td>
                      <select
                        value={msg.status || 'new'}
                        onChange={(e) => updateMessageStatus(msg.id, e.target.value)}
                        className={styles.statusSelect}
                      >
                        <option value="new">신규</option>
                        <option value="in-progress">처리중</option>
                        <option value="resolved">완료</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Community Tab */}
      {tab === 'community' && (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>커뮤니티 관리 기능 (게시글/댓글 신고 처리, 삭제)</p>
          <p className={styles.comingSoon}>준비 중</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`${styles.statCard} ${accent ? styles.statCardAccent : ''}`}>
      <div className={styles.statValue}>{value.toLocaleString()}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}
