/**
 * OpenRouter API client for direct AI calls from the extension
 * Replaces the need for a local API server
 */

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'google/gemini-2.5-flash-lite-preview-09-2025';

// Content can be text or image
type ContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } };

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string | ContentPart[];
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  error?: {
    message: string;
    code?: number;
  };
}

export interface OpenRouterOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
  apiKey: string; // Required - user must provide their own API key
}

/**
 * Call OpenRouter API with text messages
 */
export async function callOpenRouter(
  messages: Message[],
  options: OpenRouterOptions
): Promise<string> {
  const { apiKey, model, temperature = 0.7, maxTokens = 2048 } = options;

  if (!apiKey) {
    throw new Error('No API key provided. Please configure your OpenRouter API key in settings.');
  }

  console.log('[HWTB] Calling OpenRouter:', {
    model: model || DEFAULT_MODEL,
    messageCount: messages.length,
    temperature,
    maxTokens,
  });

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://howwasthisbuilt.app',
      'X-Title': 'How Was This Built',
    },
    body: JSON.stringify({
      model: model || DEFAULT_MODEL,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    // Handle specific error codes
    if (response.status === 401) {
      throw new Error('Invalid API key. Please check your OpenRouter API key in settings.');
    }
    if (response.status === 429) {
      throw new Error('Rate limited. Please wait a moment and try again.');
    }
    if (response.status === 402) {
      throw new Error('Insufficient credits. Please add credits to your OpenRouter account.');
    }

    throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as OpenRouterResponse;

  if (data.error) {
    throw new Error(`OpenRouter error: ${data.error.message}`);
  }

  if (!data.choices?.[0]?.message?.content) {
    throw new Error('No content in OpenRouter response');
  }

  return data.choices[0].message.content;
}

/**
 * Call OpenRouter with vision capability (includes image)
 */
export async function callOpenRouterWithVision(
  systemPrompt: string,
  userPrompt: string,
  imageDataUrl: string,
  options: OpenRouterOptions
): Promise<string> {
  const messages: Message[] = [
    { role: 'system', content: systemPrompt },
    {
      role: 'user',
      content: [
        { type: 'image_url', image_url: { url: imageDataUrl } },
        { type: 'text', text: userPrompt },
      ],
    },
  ];

  return callOpenRouter(messages, options);
}
