'use client';

import { motion } from 'framer-motion';
import type { ChatMessage as ChatMessageType, Locale } from '@/types';
import ChatProductCard from './ChatProductCard';
import ChatJourneyCard from './ChatJourneyCard';
import ChatRegionCard from './ChatRegionCard';
import styles from './ChatMessage.module.css';

interface Props {
  message: ChatMessageType;
  locale: Locale;
  isTyping?: boolean;
  i18n?: Record<string, unknown>;
}

export default function ChatMessage({ message, locale, isTyping, i18n }: Props) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      className={`${styles.row} ${isUser ? styles.userRow : styles.assistantRow}`}
      initial={{ opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      {!isUser && (
        <div className={styles.avatar}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 12 18.469a3.374 3.374 0 0 0-.914-1.42l-.548-.547z" />
          </svg>
        </div>
      )}

      <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.assistantBubble}`}>
        {message.content ? (
          <p className={styles.text}>{message.content}</p>
        ) : isTyping ? (
          <div className={styles.typing}>
            <span /><span /><span />
          </div>
        ) : null}

        {message.regionInfo && (
          <ChatRegionCard regionInfo={message.regionInfo} messages={i18n} locale={locale} />
        )}

        {message.journey && message.journey.steps.length > 0 && (
          <ChatJourneyCard journey={message.journey} locale={locale} messages={i18n || {}} />
        )}

        {!message.journey && message.products && message.products.length > 0 && (
          <div className={styles.products}>
            {message.products.map((result) => (
              <ChatProductCard key={result.id} result={result} locale={locale} messages={i18n} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
