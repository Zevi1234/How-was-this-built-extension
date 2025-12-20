import type { StorageEnum } from './index.js';

export type ValueOrUpdateType<D> = D | ((prev: D) => Promise<D> | D);

export type BaseStorageType<D> = {
  get: () => Promise<D>;
  set: (value: ValueOrUpdateType<D>) => Promise<void>;
  getSnapshot: () => D | null;
  subscribe: (listener: () => void) => () => void;
};

export type StorageConfigType<D = string> = {
  /**
   * Assign the {@link StorageEnum} to use.
   * @default Local
   */
  storageEnum?: StorageEnum;
  /**
   * Only for {@link StorageEnum.Session}: Grant Content scripts access to storage area?
   * @default false
   */
  sessionAccessForContentScripts?: boolean;
  /**
   * Keeps state live in sync between all instances of the extension. Like between popup, side panel and content scripts.
   * To allow chrome background scripts to stay in sync as well, use {@link StorageEnum.Session} storage area with
   * {@link StorageConfigType.sessionAccessForContentScripts} potentially also set to true.
   * @see https://stackoverflow.com/a/75637138/2763239
   * @default false
   */
  liveUpdate?: boolean;
  /**
   * An optional props for converting values from storage and into it.
   * @default undefined
   */
  serialization?: {
    /**
     * convert non-native values to string to be saved in storage
     */
    serialize: (value: D) => string;
    /**
     * convert string value from storage to non-native values
     */
    deserialize: (text: string) => D;
  };
};

export interface ThemeStateType {
  theme: 'light' | 'dark';
  isLight: boolean;
}

export type ThemeStorageType = BaseStorageType<ThemeStateType> & {
  toggle: () => Promise<void>;
};

// HWTB App Types
export type UserLevel = 'beginner' | 'learning' | 'designer' | 'developer';

// LearningStyle is now free text - users can describe how they like to learn
export type LearningStyle = string;

// AI Model Configuration
export type AIModelId =
  | 'x-ai/grok-4.1-fast'
  | 'google/gemini-2.5-flash-lite-preview-09-2025'
  | 'google/gemini-2.5-flash-preview-09-2025'
  | 'google/gemini-3-flash-preview'
  | 'openai/gpt-5-mini'
  | 'openai/gpt-5.2-chat'
  | 'anthropic/claude-haiku-4.5'
  | 'anthropic/claude-sonnet-4.5';

export interface AIModelInfo {
  id: AIModelId;
  name: string;
  provider: 'Google' | 'Anthropic' | 'OpenAI' | 'xAI';
  speed: 1 | 2 | 3 | 4 | 5; // 1 = slowest, 5 = fastest
  cost: 1 | 2 | 3 | 4 | 5; // 1 = cheapest, 5 = most expensive
  intelligence: 1 | 2 | 3 | 4 | 5; // 1 = basic, 5 = most capable
  isDefault?: boolean;
  isRecommended?: boolean;
}

export interface AIConfigType {
  openRouterApiKey?: string;
  selectedModel: AIModelId;
  apiKeyValidated?: boolean;
  chatResponseLength?: number; // 256-2048 tokens, default 1024
}

// Default AI Model ID
export const DEFAULT_AI_MODEL: AIModelId = 'google/gemini-2.5-flash-lite-preview-09-2025';

// Available AI Models with metadata
export const AI_MODELS: AIModelInfo[] = [
  // Google models - Flash series optimized for speed
  {
    id: 'google/gemini-2.5-flash-lite-preview-09-2025',
    name: 'Gemini 2.5 Flash Lite',
    provider: 'Google',
    speed: 5,
    cost: 1,
    intelligence: 3,
    isDefault: true,
    isRecommended: true,
  },
  {
    id: 'google/gemini-2.5-flash-preview-09-2025',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    speed: 4,
    cost: 2,
    intelligence: 4,
  },
  {
    id: 'google/gemini-3-flash-preview',
    name: 'Gemini 3 Flash',
    provider: 'Google',
    speed: 4,
    cost: 3,
    intelligence: 5,
  },
  // xAI - Grok optimized for fast inference
  {
    id: 'x-ai/grok-4.1-fast',
    name: 'Grok 4.1 Fast',
    provider: 'xAI',
    speed: 5,
    cost: 2,
    intelligence: 4,
  },
  // OpenAI models
  {
    id: 'openai/gpt-5-mini',
    name: 'GPT-5 Mini',
    provider: 'OpenAI',
    speed: 4,
    cost: 2,
    intelligence: 4,
  },
  {
    id: 'openai/gpt-5.2-chat',
    name: 'GPT-5.2 Chat',
    provider: 'OpenAI',
    speed: 3,
    cost: 4,
    intelligence: 5,
  },
  // Anthropic models
  {
    id: 'anthropic/claude-haiku-4.5',
    name: 'Claude Haiku 4.5',
    provider: 'Anthropic',
    speed: 5,
    cost: 1,
    intelligence: 3,
  },
  {
    id: 'anthropic/claude-sonnet-4.5',
    name: 'Claude Sonnet 4.5',
    provider: 'Anthropic',
    speed: 3,
    cost: 4,
    intelligence: 5,
  },
];

export interface UserProfile {
  level: UserLevel;
  bio?: string; // Optional "tell us about yourself"
  learningStyle?: string; // Free text describing how they prefer to learn
}

export interface TechSignals {
  nextjs: boolean;
  nuxt: boolean;
  react: boolean;
  vue: boolean;
  angular: boolean;
  svelte: boolean;
  tailwind: boolean;
  wordpress: boolean;
  gatsby: boolean;
  remix: boolean;
}

export interface ExtractedFont {
  family: string;
  usage: 'heading' | 'body' | 'code' | 'other';
}

export interface ExtractedButton {
  backgroundColor: string;
  textColor: string;
  borderRadius: string;
  fontWeight: string;
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  borderColor?: string;
  borderWidth?: string;
  padding?: string;
  fontSize?: string;
  fontFamily?: string;
  boxShadow?: string;
  textTransform?: string;
  letterSpacing?: string;
}

export interface ColorPalette {
  background: string;
  foreground: string;
  primary: string;
  secondary?: string;
  accent?: string;
  muted?: string;
  border?: string;
  destructive?: string;

  source: 'css-variables' | 'semantic-analysis' | 'ai-categorization';
  confidence: 'high' | 'medium' | 'low';
  rawColors: string[];
  possibleSystem?: 'tailwind' | 'shadcn' | 'radix' | 'material' | 'custom';
}

// SEO/AEO Types
export interface SEOIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  category: 'title' | 'meta' | 'headings' | 'images' | 'links' | 'content' | 'technical';
}

export interface SEOData {
  score: number; // 0-100

  title: {
    value: string;
    length: number;
    isIdeal: boolean; // 50-60 chars
  };

  metaDescription: {
    value: string;
    length: number;
    isIdeal: boolean; // 150-160 chars
  };

  headings: {
    h1Count: number;
    h2Count: number;
    h3Count: number;
    hasProperHierarchy: boolean;
  };

  images: {
    total: number;
    withoutAlt: number;
  };

  links: {
    internal: number;
    external: number;
    broken: number; // Hrefs to # or javascript:void
  };

  content: {
    wordCount: number;
    isThinContent: boolean; // < 300 words
  };

  technical: {
    hasCanonical: boolean;
    canonicalUrl?: string;
    hasViewport: boolean;
    hasOpenGraph: boolean;
    openGraphComplete: boolean; // og:title, og:description, og:image
  };

  topIssues: SEOIssue[];
}

export interface AEOData {
  score: number; // 0-100 (AI-generated based on content quality)

  // AI-generated insight about why this content is/isn't AI-friendly
  insight?: string;

  // Technical signals (still extracted client-side for context)
  jsonLd: {
    present: boolean;
    types: string[]; // e.g., ['Article', 'FAQPage', 'Organization']
  };

  schemas: {
    hasFAQ: boolean;
    hasHowTo: boolean;
    hasArticle: boolean;
    hasProduct: boolean;
    hasOrganization: boolean;
    hasBreadcrumb: boolean;
  };

  freshness: {
    hasDatePublished: boolean;
    hasDateModified: boolean;
    datePublished?: string;
    dateModified?: string;
  };

  eeat: {
    hasAuthorMarkup: boolean;
    authorName?: string;
    hasAboutPageLink: boolean;
  };

  qaFormat: {
    questionHeadings: number; // Headings ending with ?
    hasQuestionStructure: boolean; // 2+ question headings
  };

  topIssues: SEOIssue[]; // AI-generated observations
}

export interface SEOAEOData {
  seo: SEOData;
  aeo: AEOData;
  extractedAt: number;
}

export interface PageData {
  url: string;
  title: string;
  html: string;
  scripts: string[];
  stylesheets: string[];
  metaTags: Record<string, string>;
  techSignals: TechSignals;
  screenshot?: string; // Base64 data URL of the page screenshot
  extractedColors?: string[]; // Hex colors extracted from computed styles
  extractedFonts?: ExtractedFont[]; // Fonts extracted from computed styles
  extractedButtons?: ExtractedButton[]; // Button styles extracted from DOM
  cssVariables?: Record<string, string>; // CSS custom properties from :root
  seoAeoData?: SEOAEOData; // SEO and AEO analysis data
}

export interface AnalysisCategory {
  summary: string;
  tags: string[];
}

export interface TldrSection {
  summary: string;
  landingPageTech: string[];
  productTech: string[];
  confidence: 'high' | 'medium' | 'low';
}

export interface TopLearning {
  title: string;
  insight: string;
  category: 'marketing' | 'strategy' | 'pricing' | 'competitive' | 'tech' | 'growth' | 'other';
}

export interface Analysis {
  url: string;
  timestamp: number;
  tldr: TldrSection;
  techStack: AnalysisCategory;
  architecture: AnalysisCategory;
  designSystem: AnalysisCategory;
  uxPatterns: AnalysisCategory;
  suggestedQuestions: string[];
  colorPalette?: string[]; // Hex colors extracted (backward compat)
  structuredPalette?: ColorPalette; // Structured palette with semantic roles
  fonts?: ExtractedFont[]; // Fonts extracted from DOM
  buttons?: ExtractedButton[]; // Button styles extracted from DOM
  topLearnings?: TopLearning[]; // Top 3 takeaways from the page
  seoAeoData?: SEOAEOData; // SEO and AEO analysis data
}

// Attachment types for chat messages
export interface ScreenshotAttachment {
  type: 'screenshot';
  dataUrl: string;
  region: { x: number; y: number; width: number; height: number };
  timestamp: number;
}

export interface ElementAttachment {
  type: 'element';
  outerHTML: string;
  computedStyles: {
    backgroundColor: string;
    color: string;
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    borderRadius: string;
    border: string;
    padding: string;
    margin: string;
    display: string;
    position: string;
  };
  tagName: string;
  className: string;
  timestamp: number;
}

export type ChatAttachment = ScreenshotAttachment | ElementAttachment;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  attachments?: ChatAttachment[];
}

export interface SlashCommand {
  id: string;
  name: string;
  prompt: string;
  createdAt: number;
  updatedAt: number;
}

export interface AppStateType {
  userLevel: UserLevel;
  userBio?: string; // Optional user bio from onboarding
  learningStyle?: string; // Free text describing how they prefer to learn
  onboardingComplete: boolean;
  recentAnalyses: Analysis[];
  currentAnalysis: Analysis | null;
  currentChat: ChatMessage[];
  isAnalyzing: boolean;
  // AI Configuration
  aiConfig: AIConfigType;
  // Custom slash commands
  customCommands: SlashCommand[];
}

export type AppStorageType = BaseStorageType<AppStateType> & {
  setUserLevel: (level: UserLevel) => Promise<void>;
  setUserProfile: (profile: { level: UserLevel; bio?: string; learningStyle?: string }) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  addAnalysis: (analysis: Analysis) => Promise<void>;
  setCurrentAnalysis: (analysis: Analysis | null) => Promise<void>;
  addChatMessage: (message: ChatMessage) => Promise<void>;
  clearChat: () => Promise<void>;
  setAnalyzing: (isAnalyzing: boolean) => Promise<void>;
  // AI Configuration methods
  setAIConfig: (config: Partial<AIConfigType>) => Promise<void>;
  setOpenRouterApiKey: (apiKey: string, validated?: boolean) => Promise<void>;
  setSelectedModel: (modelId: AIModelId) => Promise<void>;
  setChatResponseLength: (length: number) => Promise<void>;
  // User profile methods
  setUserBio: (bio: string) => Promise<void>;
  setLearningStyle: (learningStyle: string) => Promise<void>;
  // Slash command methods
  addCommand: (command: Omit<SlashCommand, 'id' | 'createdAt' | 'updatedAt'>) => Promise<SlashCommand>;
  updateCommand: (id: string, updates: Partial<Pick<SlashCommand, 'name' | 'prompt'>>) => Promise<void>;
  deleteCommand: (id: string) => Promise<void>;
};
