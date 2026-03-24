'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { LEVEL_THRESHOLDS, type UserProfile, type UserLevel } from '@/types';
import type { User, Session } from '@supabase/supabase-js';

function getLevel(points: number): UserLevel {
  if (points >= 1000) return 'legend';
  if (points >= 500) return 'master';
  if (points >= 200) return 'superfan';
  if (points >= 50) return 'fan';
  return 'newbie';
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string, nickname: string) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signInWithGoogle: () => Promise<void>;
  signInWithKakao: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

/** Supabase 에러 메시지를 한국어로 변환 */
function translateAuthError(message: string): string {
  const map: Record<string, string> = {
    'Invalid login credentials': '이메일 또는 비밀번호가 올바르지 않습니다.',
    'Email not confirmed': '이메일 인증이 완료되지 않았습니다. 메일함을 확인해주세요.',
    'User already registered': '이미 가입된 이메일입니다.',
    'Password should be at least 6 characters': '비밀번호는 6자 이상이어야 합니다.',
    'Unable to validate email address: invalid format': '올바른 이메일 형식이 아닙니다.',
    'Signup requires a valid password': '비밀번호를 입력해주세요.',
    'To signup, please provide your email': '이메일을 입력해주세요.',
    'Email rate limit exceeded': '너무 많은 시도입니다. 잠시 후 다시 시도해주세요.',
    'For security purposes, you can only request this once every 60 seconds': '보안상 60초에 한 번만 요청할 수 있습니다.',
  };
  // Exact match first
  if (map[message]) return map[message];
  // Partial match for varying error messages
  const lower = message.toLowerCase();
  if (lower.includes('rate limit')) return '너무 많은 시도입니다. 잠시 후 다시 시도해주세요.';
  if (lower.includes('already registered')) return '이미 가입된 이메일입니다.';
  if (lower.includes('invalid login')) return '이메일 또는 비밀번호가 올바르지 않습니다.';
  if (lower.includes('email not confirmed')) return '이메일 인증이 완료되지 않았습니다. 메일함을 확인해주세요.';
  return message;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;

    const userProfile: UserProfile = {
      id: data.id,
      email: data.email,
      nickname: data.nickname,
      avatar_url: data.avatar_url,
      points: data.points,
      level: getLevel(data.points),
      role: data.role || 'user',
      post_count: data.post_count,
      comment_count: data.comment_count,
      review_count: data.review_count,
      created_at: data.created_at,
    };
    return userProfile;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const p = await fetchProfile(user.id);
    if (p) setProfile(p);
  }, [user, fetchProfile]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfile(s.user.id).then((p) => {
          setProfile(p);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfile(s.user.id).then(setProfile);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? translateAuthError(error.message) : null };
  };

  const signUpWithEmail = async (email: string, password: string, nickname: string) => {
    // Use server-side API route that auto-confirms email
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, nickname }),
    });
    const body = await res.json();
    if (!res.ok) {
      return { error: body.error || '가입에 실패했습니다.', needsConfirmation: false };
    }
    // User created & confirmed — now sign in automatically
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      return { error: translateAuthError(signInError.message), needsConfirmation: false };
    }
    return { error: null, needsConfirmation: false };
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  };

  const signInWithKakao = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: { redirectTo: window.location.origin },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user, profile, session, loading,
        signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithKakao, signOut, refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
