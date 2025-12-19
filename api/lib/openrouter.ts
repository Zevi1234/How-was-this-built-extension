const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'google/gemini-2.5-flash-lite-preview-09-2025'; // Gemini 2.5 Flash Lite - fast and cost-effective

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
}

export async function callOpenRouter(
  messages: Message[],
  options?: {
    temperature?: number;
    maxTokens?: number;
    model?: string;
    apiKey?: string; // User-provided API key
  }
): Promise<string> {
  // Use user-provided API key if available, otherwise fall back to server key
  const apiKey = options?.apiKey || process.env.OPENROUTER_API_KEY;

  // Debug logging
  console.log('[OpenRouter] API key source:', options?.apiKey ? 'user-provided' : 'env');
  console.log('[OpenRouter] API key length:', apiKey?.length || 0);
  console.log('[OpenRouter] API key prefix:', apiKey?.substring(0, 10) + '...');

  if (!apiKey) {
    throw new Error('No API key available. Please configure your OpenRouter API key in settings.');
  }

  const model = options?.model ?? DEFAULT_MODEL;

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://howwasthisbuilt.app',
      'X-Title': 'How Was This Built',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2048,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  const data = (await response.json()) as OpenRouterResponse;

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
  options?: {
    temperature?: number;
    maxTokens?: number;
    apiKey?: string;
    model?: string;
  }
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
