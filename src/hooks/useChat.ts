'use client';

import { useState, useCallback, useRef } from 'react';
import type { ChatMessage, RecommendationResult, JourneyPackage, RegionInfo } from '@/types';

const FLUSH_INTERVAL = 80; // ms between state updates during streaming

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingTextRef = useRef('');
  const pendingProductsRef = useRef<RecommendationResult[] | undefined>(undefined);
  const pendingJourneyRef = useRef<JourneyPackage | undefined>(undefined);
  const pendingRegionInfoRef = useRef<RegionInfo | undefined>(undefined);

  // Flush accumulated text/products/journey to state (throttled)
  const flushToState = useCallback(() => {
    const text = pendingTextRef.current;
    const products = pendingProductsRef.current;
    const journey = pendingJourneyRef.current;
    const regionInfo = pendingRegionInfoRef.current;
    setMessages((prev) => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (last && last.role === 'assistant') {
        updated[updated.length - 1] = {
          ...last,
          content: text,
          products,
          journey,
          regionInfo,
        };
      }
      return updated;
    });
  }, []);

  const scheduleFlush = useCallback(() => {
    if (flushTimerRef.current) return; // already scheduled
    flushTimerRef.current = setTimeout(() => {
      flushTimerRef.current = null;
      flushToState();
    }, FLUSH_INTERVAL);
  }, [flushToState]);

  const sendMessage = useCallback(async (content: string) => {
    if (isStreaming) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsStreaming(true);
    setError(null);

    const apiMessages = [
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user' as const, content },
    ];

    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };

    // Reset pending refs
    pendingTextRef.current = '';
    pendingProductsRef.current = undefined;
    pendingJourneyRef.current = undefined;
    pendingRegionInfoRef.current = undefined;

    setMessages((prev) => [...prev, assistantMessage]);

    try {
      abortRef.current = new AbortController();

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Response generation failed');
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('Unable to read stream');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;

          try {
            const event = JSON.parse(jsonStr);

            if (event.type === 'text') {
              pendingTextRef.current += event.content;
              scheduleFlush();
            } else if (event.type === 'products') {
              pendingProductsRef.current = event.products;
              scheduleFlush();
            } else if (event.type === 'journey') {
              pendingJourneyRef.current = event.journey;
              scheduleFlush();
            } else if (event.type === 'region') {
              pendingRegionInfoRef.current = event.regionInfo;
              scheduleFlush();
            } else if (event.type === 'error') {
              setError(event.content);
            }
          } catch {
            // ignore parse failure
          }
        }
      }

      // Final flush to ensure all content is rendered
      if (flushTimerRef.current) {
        clearTimeout(flushTimerRef.current);
        flushTimerRef.current = null;
      }
      flushToState();
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant' && !last.content) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
      if (flushTimerRef.current) {
        clearTimeout(flushTimerRef.current);
        flushTimerRef.current = null;
      }
    }
  }, [messages, isStreaming, scheduleFlush, flushToState]);

  const clearChat = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    if (flushTimerRef.current) {
      clearTimeout(flushTimerRef.current);
      flushTimerRef.current = null;
    }
    pendingTextRef.current = '';
    pendingProductsRef.current = undefined;
    pendingJourneyRef.current = undefined;
    pendingRegionInfoRef.current = undefined;
    setMessages([]);
    setError(null);
    setIsStreaming(false);
  }, []);

  return { messages, isStreaming, error, sendMessage, clearChat };
}
