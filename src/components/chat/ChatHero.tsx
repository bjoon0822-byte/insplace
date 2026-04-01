'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Locale } from '@/types';
import { t } from '@/i18n/request';
import { useChat } from '@/hooks/useChat';
import ChatMessage from './ChatMessage';
import styles from './ChatHero.module.css';

interface ChatHeroProps {
  locale: Locale;
  messages: Record<string, unknown>;
}

const EXAMPLE_PROMPTS_KEYS = [
  'chat.example1',
  'chat.example2',
  'chat.example3',
  'chat.example4',
];

export default function ChatHero({ locale, messages: i18n }: ChatHeroProps) {
  const { messages, isStreaming, error, sendMessage, clearChat } = useChat();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    setInput('');
    sendMessage(trimmed);
  };

  const handleChip = (key: string) => {
    const text = t(i18n, key) as string;
    if (!text || isStreaming) return;
    sendMessage(text);
  };

  const hasMessages = messages.length > 0;
  const turnCount = messages.filter((m) => m.role === 'user').length;
  const maxTurnsReached = turnCount >= 20;

  return (
    <div className={styles.wrapper}>
      {/* Ambient glow behind the panel */}
      <div className={styles.ambientGlow} />

      <div className={styles.panel}>
        {/* Top bar */}
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <div className={styles.statusDot} />
            <span className={styles.topBarLabel}>{t(i18n, 'chat.title')}</span>
          </div>
          {hasMessages && (
            <button
              className={styles.clearBtn}
              onClick={clearChat}
              disabled={isStreaming}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              </svg>
            </button>
          )}
        </div>

        {/* Message area */}
        <div className={styles.messageArea} ref={scrollRef}>
          <AnimatePresence mode="sync">
            {/* Welcome state */}
            {!hasMessages && (
              <motion.div
                key="welcome"
                className={styles.welcomeState}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.welcomeAvatar}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 12 18.469a3.374 3.374 0 0 0-.914-1.42l-.548-.547z" />
                  </svg>
                </div>
                <p className={styles.welcomeText}>{t(i18n, 'chat.welcome')}</p>

                {/* Example chips */}
                <div className={styles.chips}>
                  {EXAMPLE_PROMPTS_KEYS.map((key, i) => (
                    <motion.button
                      key={key}
                      className={styles.chip}
                      onClick={() => handleChip(key)}
                      disabled={isStreaming}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.chipIcon}>
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                      {t(i18n, key)}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Messages */}
            {messages.map((msg, i) => (
              <ChatMessage
                key={`${msg.role}-${msg.timestamp}-${i}`}
                message={msg}
                locale={locale}
                isTyping={isStreaming && i === messages.length - 1 && msg.role === 'assistant' && !msg.content}
                i18n={i18n}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              className={styles.error}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {t(i18n, 'chat.error')}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Max turns */}
        {maxTurnsReached && (
          <div className={styles.maxTurns}>
            <p>{t(i18n, 'chat.maxTurns')}</p>
            <a href={`/${locale}/contact`} className={styles.maxTurnsCta}>
              {t(i18n, 'chat.contactCta')} →
            </a>
          </div>
        )}

        {/* Input bar */}
        <form className={styles.inputBar} onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className={styles.input}
            type="text"
            placeholder={t(i18n, 'chat.placeholder') as string}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isStreaming || maxTurnsReached}
            autoComplete="off"
          />
          <button
            type="submit"
            className={styles.sendBtn}
            disabled={!input.trim() || isStreaming || maxTurnsReached}
            aria-label={t(i18n, 'chat.send') as string}
          >
            {isStreaming ? (
              <span className={styles.spinner} />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
