// 문의하기 폼 — Supabase 저장 + 상품 프리필
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { t } from '@/i18n/request';
import { supabase } from '@/lib/supabase';
import styles from '../subpage.module.css';

interface ContactFormProps {
  messages: Record<string, unknown>;
}

function ContactFormInner({ messages }: ContactFormProps) {
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // 상품 페이지에서 넘어온 경우 프리필
  useEffect(() => {
    const paramSubject = searchParams.get('subject');
    const paramProduct = searchParams.get('product');

    if (paramSubject) {
      setSubject(paramSubject);
    }
    if (paramProduct) {
      setMessage(`[${paramProduct}] 상품에 대해 문의드립니다.\n\n`);
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');
    try {
      const productRef = searchParams.get('product') || undefined;

      const { error: insertError } = await supabase.from('contact_messages').insert({
        name,
        email,
        phone: phone || null,
        subject,
        message,
        product_ref: productRef,
      });

      if (insertError) throw insertError;
      setSubmitted(true);
    } catch {
      setError(t(messages, 'contact.error') || '문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <>
        <section className={styles.pageHero}>
          <span className={styles.pageWatermark}>CONTACT.</span>
          <div className={styles.pageHeroInner}>
            <span className={styles.pageEyebrow}>CONTACT US</span>
            <h1 className={styles.pageTitle}>{t(messages, 'contact.title')}</h1>
          </div>
        </section>
        <div className={styles.formContainer} style={{ textAlign: 'center' }}>
          <div className={styles.successCheck}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <p className={styles.detailDesc}>{t(messages, 'contact.success')}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <section className={styles.pageHero}>
        <span className={styles.pageWatermark}>CONTACT.</span>
        <div className={styles.pageHeroInner}>
          <span className={styles.pageEyebrow}>CONTACT US</span>
          <h1 className={styles.pageTitle}>{t(messages, 'contact.title')}</h1>
          <p className={styles.pageSubtitle}>{t(messages, 'contact.subtitle')}</p>
        </div>
      </section>

      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="contact-name">{t(messages, 'contact.name')}</label>
          <input
            id="contact-name"
            type="text"
            placeholder={t(messages, 'contact.name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="contact-email">{t(messages, 'contact.email')}</label>
          <input
            id="contact-email"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="contact-phone">{t(messages, 'contact.phone')}</label>
          <input
            id="contact-phone"
            type="tel"
            placeholder="010-0000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="contact-subject">{t(messages, 'contact.subject')}</label>
          <div className={styles.selectWrapper}>
            <select
              id="contact-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            >
              <option value="">{t(messages, 'contact.subject')}</option>
              <option value="ad">{t(messages, 'contact.subjectAd')}</option>
              <option value="venue">{t(messages, 'contact.subjectVenue')}</option>
              <option value="goods">{t(messages, 'contact.subjectGoods')}</option>
              <option value="popup">{t(messages, 'contact.subjectPopup')}</option>
              <option value="other">{t(messages, 'contact.subjectOther')}</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="contact-message">{t(messages, 'contact.message')}</label>
          <textarea
            id="contact-message"
            placeholder={t(messages, 'contact.message')}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        {error && (
          <p role="alert" style={{ color: 'var(--danger)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>
            {error}
          </p>
        )}

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? '...' : t(messages, 'contact.submit')}
          {!loading && <span className={styles.submitBtnArrow}>→</span>}
        </button>
      </form>
    </>
  );
}

export default function ContactForm({ messages }: ContactFormProps) {
  return (
    <Suspense>
      <ContactFormInner messages={messages} />
    </Suspense>
  );
}
