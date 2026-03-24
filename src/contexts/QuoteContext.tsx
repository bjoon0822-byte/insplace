'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { QuoteItem } from '@/types';

interface QuoteContextValue {
  items: QuoteItem[];
  addItem: (item: QuoteItem) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
  hasItem: (id: string) => boolean;
  total: number;
}

const QuoteContext = createContext<QuoteContextValue>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  clearItems: () => {},
  hasItem: () => false,
  total: 0,
});

const STORAGE_KEY = 'insplace-quote-cart';

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addItem = useCallback((item: QuoteItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearItems = useCallback(() => {
    setItems([]);
  }, []);

  const hasItem = useCallback(
    (id: string) => items.some((i) => i.id === id),
    [items]
  );

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <QuoteContext.Provider value={{ items, addItem, removeItem, clearItems, hasItem, total }}>
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  return useContext(QuoteContext);
}
