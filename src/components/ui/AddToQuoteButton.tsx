'use client';

import { useQuote } from '@/contexts/QuoteContext';
import { t } from '@/i18n/request';
import type { QuoteItem } from '@/types';

interface AddToQuoteButtonProps {
  item: QuoteItem;
  messages: Record<string, unknown>;
}

export default function AddToQuoteButton({ item, messages }: AddToQuoteButtonProps) {
  const { addItem, hasItem } = useQuote();
  const added = hasItem(item.id);

  return (
    <button
      className="btn btn-secondary"
      onClick={() => addItem(item)}
      disabled={added}
      style={{
        opacity: added ? 0.6 : 1,
        cursor: added ? 'default' : 'pointer',
      }}
    >
      {added ? t(messages, 'quote.added') : t(messages, 'quote.add')}
    </button>
  );
}
