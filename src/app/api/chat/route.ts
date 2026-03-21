import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest } from 'next/server';
import { FITNESS_SYSTEM_PROMPT } from '@/lib/constants';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured. Please set GEMINI_API_KEY in your .env.local file.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: FITNESS_SYSTEM_PROMPT,
    });

    // Build conversation history for Gemini
    const history = messages.slice(0, -1).map((msg: { role: string; content: string }) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    // Retry logic for rate limiting
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const chat = model.startChat({ history });
        const result = await chat.sendMessageStream(lastMessage.content);

        // Create a streaming response
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of result.stream) {
                const text = chunk.text();
                if (text) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
                  );
                }
              }
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              controller.close();
            } catch (error) {
              const errorMsg = error instanceof Error ? error.message : 'Stream error';
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ error: errorMsg })}\n\n`)
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
      } catch (error: unknown) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Check if it's a rate limit error (429)
        const errorMessage = lastError.message || '';
        const isRateLimit = errorMessage.includes('429') ||
          errorMessage.includes('Too Many Requests') ||
          errorMessage.includes('quota') ||
          errorMessage.includes('rate');

        if (isRateLimit && attempt < MAX_RETRIES - 1) {
          // Wait with exponential backoff before retrying
          const delay = RETRY_DELAY_MS * Math.pow(2, attempt);
          console.log(`Rate limited. Retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})`);
          await sleep(delay);
          continue;
        }

        // If it's a rate limit error, return a friendly message
        if (isRateLimit) {
          return new Response(
            JSON.stringify({
              error: '⏳ FitBot is getting too many requests right now. Please wait a few seconds and try again.'
            }),
            { status: 429, headers: { 'Content-Type': 'application/json' } }
          );
        }

        // For other errors, break out of retry loop
        break;
      }
    }

    // If we exhausted retries or got a non-retryable error
    console.error('Chat API error:', lastError);
    const message = lastError?.message || 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Chat API error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
