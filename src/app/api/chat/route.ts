import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { SYSTEM_PROMPT } from '@/lib/chat/system-prompt';
import {
  TOOLS,
  executeSearchProducts,
  executeSearchJourneyPackage,
  executeGetProductDetail,
  executeGetRegionInfo,
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
        JSON.stringify({ error: 'Please enter a message.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (messages.length > MAX_TURNS * 2) {
      return new Response(
        JSON.stringify({ error: 'Conversation length limit exceeded.' }),
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
            err instanceof Error ? err.message : 'Unknown error';
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
      JSON.stringify({ error: 'An error occurred while processing the chat.' }),
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

    // Stream text response (strip markdown)
    if (message.content) {
      const text = stripMarkdown(message.content);
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

    // Handle function calls
    if (!message.tool_calls || message.tool_calls.length === 0) {
      break;
    }

    // Append assistant message to history
    currentMessages.push({
      role: 'assistant',
      content: message.content,
      tool_calls: message.tool_calls,
    });

    // Execute each tool call and append results
    for (const toolCall of message.tool_calls) {
      if (toolCall.type !== 'function') continue;
      const fn = toolCall.function;
      let args: Record<string, unknown>;
      try {
        args = JSON.parse(fn.arguments);
      } catch {
        currentMessages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify({ error: 'Argument parsing failed' }),
        });
        continue;
      }
      const toolResult = executeTool(fn.name, args);

      // Send product results to client
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

      // Send region stats to client
      if (fn.name === 'get_region_info' && toolResult.regionInfo) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: 'region',
              regionInfo: toolResult.regionInfo,
            })}\n\n`,
          ),
        );
      }

      // Send journey package to client
      if (fn.name === 'search_journey_package' && toolResult.journey) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: 'journey',
              journey: toolResult.journey,
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

/** Strip markdown symbols that GPT inserts despite instructions */
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')   // **bold** → bold
    .replace(/\*(.*?)\*/g, '$1')       // *italic* → italic
    .replace(/^#{1,6}\s+/gm, '')       // ## heading → heading
    .replace(/^[-*]\s+/gm, '')         // - list item → list item
    .replace(/`(.*?)`/g, '$1');        // `code` → code
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
    case 'search_journey_package':
      return executeSearchJourneyPackage(
        input as Parameters<typeof executeSearchJourneyPackage>[0],
      );
    case 'get_product_detail':
      return (
        executeGetProductDetail(
          input as Parameters<typeof executeGetProductDetail>[0],
        ) ?? { error: 'Product not found' }
      );
    case 'get_region_info':
      return executeGetRegionInfo(
        input as Parameters<typeof executeGetRegionInfo>[0],
      );
    default:
      return { error: `Unknown tool: ${name}` };
  }
}
