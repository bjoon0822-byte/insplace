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

/** Map Supabase error messages to i18n keys */
function translateAuthError(message: string): string {
  const map: Record<string, string> = {
    'Invalid login credentials': 'auth.invalidCredentials',
    'Email not confirmed': 'auth.emailNotConfirmed',
    'User already registered': 'auth.alreadyRegistered',
    'Password should be at least 6 characters': 'auth.passwordTooShort',
    'Unable to validate email address: invalid format': 'auth.invalidEmail',
    'Signup requires a valid password': 'auth.passwordRequired',
    'To signup, please provide your email': 'auth.emailRequired',
    'Email rate limit exceeded': 'auth.rateLimited',
    'For security purposes, you can only request this once every 60 seconds': 'auth.rateLimited60s',
  };
  if (map[message]) return map[message];
  const lower = message.toLowerCase();
  if (lower.includes('rate limit')) return 'auth.rateLimited';
  if (lower.includes('already registered')) return 'auth.alreadyRegistered';
  if (lower.includes('invalid login')) return 'auth.invalidCredentials';
  if (lower.includes('email not confirmed')) return 'auth.emailNotConfirmed';
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
      return { error: body.error || 'auth.signupFailed', needsConfirmation: false };
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
