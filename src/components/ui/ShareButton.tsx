'use client';

import { useState } from 'react';
import { t } from '@/i18n/request';

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  className?: string;
  messages?: Record<string, unknown>;
}

export default function ShareButton({ title, text, url, className, messages = {} }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = text || title;

  async function handleShare() {
    // Use native Web Share API if available (mobile)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url: shareUrl });
        return;
      } catch {
        // User cancelled or API failed, fall through to menu
      }
    }
    setShowMenu((prev) => !prev);
  }

  function copyLink() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShowMenu(false);
    }, 1500);
  }

  function shareToTwitter() {
    const params = new URLSearchParams({ text: `${shareText}`, url: shareUrl });
    window.open(`https://twitter.com/intent/tweet?${params}`, '_blank', 'noopener');
    setShowMenu(false);
  }

  function shareToKakao() {
    // Kakao SDK share (if loaded), otherwise copy link
    if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).Kakao) {
      const Kakao = (window as unknown as Record<string, unknown>).Kakao as {
        isInitialized: () => boolean;
        Share: { sendDefault: (options: Record<string, unknown>) => void };
      };
      if (Kakao.isInitialized()) {
        Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title,
            description: shareText,
            imageUrl: '',
            link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
          },
          buttons: [
            { title: t(messages, 'share.viewDetail'), link: { mobileWebUrl: shareUrl, webUrl: shareUrl } },
          ],
        });
        setShowMenu(false);
        return;
      }
    }
    copyLink();
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={handleShare}
        className={className}
        type="button"
        aria-label={t(messages, 'share.ariaLabel')}
        style={!className ? {
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 16px',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'var(--text-muted, #666)',
          background: 'var(--card-bg, #f5f5f5)',
          border: '1px solid var(--border, #e0e0e0)',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s',
        } : undefined}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        {t(messages, 'share.button')}
      </button>

      {showMenu && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '8px',
            background: 'var(--bg-main, #fff)',
            border: '1px solid var(--border, #e0e0e0)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            padding: '8px',
            display: 'flex',
            gap: '4px',
            zIndex: 50,
            animation: 'fadeIn 0.15s ease-out',
          }}
        >
          <ShareMenuItem label="X" onClick={shareToTwitter} color="#000">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </ShareMenuItem>
          <ShareMenuItem label={t(messages, 'share.kakao')} onClick={shareToKakao} color="#FEE500" textColor="#3C1E1E">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#3C1E1E">
              <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.72 1.8 5.108 4.508 6.457-.147.53-.946 3.412-.978 3.627 0 0-.02.165.087.228.107.063.233.014.233.014.307-.043 3.558-2.326 4.118-2.72.664.093 1.347.143 2.032.143 5.523 0 10-3.463 10-7.749S17.523 3 12 3z" />
            </svg>
          </ShareMenuItem>
          <ShareMenuItem label={copied ? t(messages, 'share.copied') : t(messages, 'share.copyLink')} onClick={copyLink} color="var(--gray-100, #f3f3f3)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </ShareMenuItem>
        </div>
      )}
    </div>
  );
}

function ShareMenuItem({
  label,
  onClick,
  color,
  textColor,
  children,
}: {
  label: string;
  onClick: () => void;
  color: string;
  textColor?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      title={label}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        padding: '8px 12px',
        borderRadius: '8px',
        border: 'none',
        background: color,
        color: textColor || 'inherit',
        cursor: 'pointer',
        fontSize: '0.6875rem',
        fontWeight: 500,
        transition: 'transform 0.15s',
        minWidth: '56px',
      }}
    >
      {children}
      <span>{label}</span>
    </button>
  );
}
