'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQuote } from '@/contexts/QuoteContext';
import { Locale } from '@/types';
import { formatPrice } from '@/utils/format';
import { t } from '@/i18n/request';
import styles from './QuoteDrawer.module.css';

interface QuoteDrawerProps {
  locale: Locale;
  messages: Record<string, unknown>;
  onClose: () => void;
}

export default function QuoteDrawer({ locale, messages, onClose }: QuoteDrawerProps) {
  const { items, removeItem, total } = useQuote();
  const router = useRouter();

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSendInquiry = () => {
    const productList = items.map((i) => i.name).join(', ');
    const params = new URLSearchParams({
      subject: items[0]?.type || 'ad',
      product: productList,
      quote: 'true',
    });
    onClose();
    router.push(`/${locale}/contact?${params.toString()}`);
  };

  return (
    <>
      <div className={styles.overlay} onClick={handleOverlayClick} />
      <div className={styles.drawer}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            {t(messages, 'quote.title')} ({items.length})
          </h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items or empty */}
        {items.length === 0 ? (
          <div className={styles.empty}>
            <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <p className={styles.emptyText}>{t(messages, 'quote.empty')}</p>
          </div>
        ) : (
          <div className={styles.items}>
            {items.map((item) => (
              <div key={item.id} className={styles.item}>
                <div className={styles.itemImage}>
                  {item.imageUrl && (
                    <Image src={item.imageUrl} alt={item.name} width={56} height={56} />
                  )}
                </div>
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemPrice}>
                    ₩{formatPrice(item.price)}
                    {item.pricePeriod && (
                      <span className={styles.itemPeriod}> / {item.pricePeriod}</span>
                    )}
                  </div>
                </div>
                <button
                  className={styles.removeBtn}
                  onClick={() => removeItem(item.id)}
                  aria-label={t(messages, 'quote.remove')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>{t(messages, 'quote.total')}</span>
              <span className={styles.totalAmount}>₩{formatPrice(total)}</span>
            </div>
            <button className={styles.inquiryBtn} onClick={handleSendInquiry}>
              {t(messages, 'quote.sendInquiry')}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
