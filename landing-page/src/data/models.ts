
export type AIModelId = string;

export interface AIModelInfo {
    id: AIModelId;
    name: string;
    provider: 'Google' | 'Anthropic' | 'OpenAI' | 'xAI' | 'Other';
    contextWindow: number;
    cost: number; // 1-5 scale (1=cheap, 5=expensive)
    speed: number; // 1-5 scale (1=slow, 5=fast)
    intelligence: number; // 1-5 scale (1=dumb, 5=smart)
    description?: string;
}

export const AI_MODELS: AIModelInfo[] = [
    {
        id: 'google/gemini-2.0-flash-lite-preview-02-05:free',
        name: 'Gemini 2.5 Flash Lite',
        provider: 'Google',
        contextWindow: 1000000,
        cost: 1,
        speed: 5,
        intelligence: 3,
        description: 'Ultra-fast, cost-effective model for quick analysis'
    },
    {
        id: 'google/gemini-2.0-flash-001',
        name: 'Gemini 2.5 Flash',
        provider: 'Google',
        contextWindow: 1000000,
        cost: 2,
        speed: 5,
        intelligence: 4,
        description: 'Balanced performance for general tasks'
    },
    {
        id: 'google/gemini-pro-1.5',
        name: 'Gemini 3 Flash',
        provider: 'Google',
        contextWindow: 2000000,
        cost: 3,
        speed: 4,
        intelligence: 5,
        description: 'High intelligence with massive context window'
    },
    {
        id: 'xai/grok-2-vision-1212',
        name: 'Grok 4.1 Fast',
        provider: 'xAI',
        contextWindow: 128000,
        cost: 3,
        speed: 5,
        intelligence: 4,
        description: ' rapid reasoning and vision capabilities'
    },
    {
        id: 'openai/gpt-4o-mini',
        name: 'GPT-5 Mini',
        provider: 'OpenAI',
        contextWindow: 128000,
        cost: 2,
        speed: 5,
        intelligence: 3,
        description: 'Efficient and capable for simple tasks'
    },
    {
        id: 'openai/gpt-4o',
        name: 'GPT-5.2 Chat',
        provider: 'OpenAI',
        contextWindow: 128000,
        cost: 4,
        speed: 3,
        intelligence: 5,
        description: 'Top-tier reasoning and coding abilites'
    },
    {
        id: 'anthropic/claude-3-haiku',
        name: 'Claude Haiku 4.5',
        provider: 'Anthropic',
        contextWindow: 200000,
        cost: 2,
        speed: 5,
        intelligence: 3,
        description: 'Fast and concise, great for simple explanations'
    },
    {
        id: 'anthropic/claude-3.5-sonnet',
        name: 'Claude Sonnet 4.5',
        provider: 'Anthropic',
        contextWindow: 200000,
        cost: 3,
        speed: 4,
        intelligence: 5,
        description: 'The best balance of speed and intelligence'
    }
];

export const DEFAULT_AI_MODEL: AIModelId = 'google/gemini-2.0-flash-lite-preview-02-05:free';
