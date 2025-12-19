export type UserLevel = 'beginner' | 'learning' | 'designer' | 'developer';

// LearningStyle is now free text - users can describe how they like to learn
export type LearningStyle = string;

export interface UserProfile {
  level: UserLevel;
  bio?: string;
  learningStyle?: string;
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
  topLearnings?: TopLearning[]; // Key business/strategy takeaways
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface TopLearning {
  title: string;
  insight: string;
  category: 'marketing' | 'strategy' | 'pricing' | 'competitive' | 'tech' | 'growth' | 'other';
}

export interface AnalyzeRequest {
  pageData: PageData;
  userLevel: UserLevel;
  userBio?: string;
  learningStyle?: LearningStyle;
  // User-provided AI configuration
  openRouterApiKey?: string;
  selectedModel?: string;
}

export interface AnalyzeResponse {
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
  topLearnings?: TopLearning[]; // Key business/strategy takeaways
}

export interface ChatRequest {
  message: string;
  analysis: Analysis;
  history: ChatMessage[];
  userLevel: UserLevel;
  userBio?: string;
  learningStyle?: LearningStyle;
  // User-provided AI configuration
  openRouterApiKey?: string;
  selectedModel?: string;
}

export interface ChatResponse {
  reply: string;
}
