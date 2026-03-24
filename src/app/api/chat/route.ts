import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { SYSTEM_PROMPT } from '@/lib/chat/system-prompt';
import {
  TOOLS,
  executeSearchProducts,
  executeGetProductDetail,
} from '@/lib/chat/tools';

const MAX_TURNS = 20;

function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
  return new OpenAI({ apiKey });
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: '메시지를 입력해주세요.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (messages.length > MAX_TURNS * 2) {
      return new Response(
        JSON.stringify({ error: '대화 길이 제한을 초과했습니다.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const client = getClient();

    const openaiMessages: OpenAI.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ];

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          await processChat(client, openaiMessages, controller, encoder);
        } catch (err) {
          const errorMsg =
            err instanceof Error ? err.message : '알 수 없는 오류';
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: 'error', content: errorMsg })}\n\n`,
            ),
          );
        } finally {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`),
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: '채팅 처리 중 오류가 발생했습니다.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}

async function processChat(
  client: OpenAI,
  messages: OpenAI.ChatCompletionMessageParam[],
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
) {
  let currentMessages = [...messages];
  let toolLoops = 0;
  const maxToolLoops = 3;

  while (toolLoops < maxToolLoops) {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 1024,
      tools: TOOLS,
      messages: currentMessages,
    });

    const choice = response.choices[0];
    if (!choice) break;

    const message = choice.message;

    // 텍스트 응답 스트림
    if (message.content) {
      const text = message.content;
      const chunkSize = 20;
      for (let i = 0; i < text.length; i += chunkSize) {
        const chunk = text.slice(i, i + chunkSize);
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'text', content: chunk })}\n\n`,
          ),
        );
        await new Promise((r) => setTimeout(r, 30));
      }
    }

    // function call 처리
    if (!message.tool_calls || message.tool_calls.length === 0) {
      break;
    }

    // assistant 메시지를 히스토리에 추가
    currentMessages.push({
      role: 'assistant',
      content: message.content,
      tool_calls: message.tool_calls,
    });

    // 각 tool call 실행 및 결과 추가
    for (const toolCall of message.tool_calls) {
      if (toolCall.type !== 'function') continue;
      const fn = toolCall.function;
      const args = JSON.parse(fn.arguments);
      const toolResult = executeTool(fn.name, args);

      // 상품 결과가 있으면 클라이언트에 전송
      if (fn.name === 'search_products' && toolResult.results) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: 'products',
              products: toolResult.results,
            })}\n\n`,
          ),
        );
      }

      currentMessages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: JSON.stringify(toolResult),
      });
    }

    toolLoops++;
  }
}

function executeTool(
  name: string,
  input: Record<string, unknown>,
): Record<string, unknown> {
  switch (name) {
    case 'search_products':
      return executeSearchProducts(
        input as Parameters<typeof executeSearchProducts>[0],
      );
    case 'get_product_detail':
      return (
        executeGetProductDetail(
          input as Parameters<typeof executeGetProductDetail>[0],
        ) ?? { error: '상품을 찾을 수 없습니다.' }
      );
    default:
      return { error: `알 수 없는 도구: ${name}` };
  }
}
