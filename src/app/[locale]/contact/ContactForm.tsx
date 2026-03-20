// 문의하기 폼 — 클라이언트 컴포넌트
'use client';

import { useState } from 'react';
import { t } from '@/i18n/request';
import styles from '../subpage.module.css';

interface ContactFormProps {
  messages: Record<string, unknown>;
}

export default function ContactForm({ messages }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>{t(messages, 'contact.title')}</h1>
          <p className={styles.pageSubtitle}>{t(messages, 'contact.success')}</p>
        </div>
        <div className={styles.formContainer} style={{ textAlign: 'center', paddingTop: 'var(--space-2xl)' }}>
          <div className={styles.successIcon}>✅</div>
          <p className={styles.detailDesc}>{t(messages, 'contact.success')}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{t(messages, 'contact.title')}</h1>
        <p className={styles.pageSubtitle}>{t(messages, 'contact.subtitle')}</p>
      </div>

      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="contact-name">{t(messages, 'contact.name')}</label>
          <input id="contact-name" type="text" placeholder={t(messages, 'contact.name')} required />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="contact-email">{t(messages, 'contact.email')}</label>
          <input id="contact-email" type="email" placeholder="example@email.com" required />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="contact-phone">{t(messages, 'contact.phone')}</label>
          <input id="contact-phone" type="tel" placeholder="010-0000-0000" />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="contact-subject">{t(messages, 'contact.subject')}</label>
          <div className={styles.selectWrapper}>
            <select id="contact-subject" required>
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
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          {t(messages, 'contact.submit')}
        </button>
      </form>
    </>
  );
}
