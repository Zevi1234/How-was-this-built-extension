import { createStorage, StorageEnum, DEFAULT_AI_MODEL } from '../base/index.js';
import type { AppStateType, AppStorageType, UserLevel, LearningStyle, Analysis, ChatMessage, AIConfigType, AIModelId } from '../base/index.js';

const MAX_RECENT_ANALYSES = 20;

const storage = createStorage<AppStateType>(
  'hwtb-app-storage',
  {
    userLevel: 'beginner',
    userBio: undefined,
    learningStyle: undefined,
    onboardingComplete: false,
    recentAnalyses: [],
    currentAnalysis: null,
    currentChat: [],
    isAnalyzing: false,
    aiConfig: {
      selectedModel: DEFAULT_AI_MODEL,
      openRouterApiKey: undefined,
      apiKeyValidated: false,
    },
  },
  {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
  },
);

export const appStorage: AppStorageType = {
  ...storage,

  setUserLevel: async (level: UserLevel) => {
    await storage.set(state => ({
      ...state,
      userLevel: level,
    }));
  },

  setUserProfile: async (profile: { level: UserLevel; bio?: string; learningStyle?: LearningStyle }) => {
    await storage.set(state => ({
      ...state,
      userLevel: profile.level,
      userBio: profile.bio,
      learningStyle: profile.learningStyle,
    }));
  },

  completeOnboarding: async () => {
    await storage.set(state => ({
      ...state,
      onboardingComplete: true,
    }));
  },

  addAnalysis: async (analysis: Analysis) => {
    await storage.set(state => {
      // Remove any existing analysis for the same URL
      const filtered = state.recentAnalyses.filter(a => a.url !== analysis.url);
      // Add new analysis at the beginning and keep only MAX_RECENT_ANALYSES
      const recentAnalyses = [analysis, ...filtered].slice(0, MAX_RECENT_ANALYSES);

      return {
        ...state,
        recentAnalyses,
        currentAnalysis: analysis,
        currentChat: [], // Clear chat when new analysis is added
      };
    });
  },

  setCurrentAnalysis: async (analysis: Analysis | null) => {
    await storage.set(state => ({
      ...state,
      currentAnalysis: analysis,
      currentChat: [], // Clear chat when switching analysis
    }));
  },

  addChatMessage: async (message: ChatMessage) => {
    await storage.set(state => ({
      ...state,
      currentChat: [...state.currentChat, message],
    }));
  },

  clearChat: async () => {
    await storage.set(state => ({
      ...state,
      currentChat: [],
    }));
  },

  setAnalyzing: async (isAnalyzing: boolean) => {
    await storage.set(state => ({
      ...state,
      isAnalyzing,
    }));
  },

  setAIConfig: async (config: Partial<AIConfigType>) => {
    await storage.set(state => ({
      ...state,
      aiConfig: {
        ...state.aiConfig,
        ...config,
      },
    }));
  },

  setOpenRouterApiKey: async (apiKey: string, validated = false) => {
    await storage.set(state => ({
      ...state,
      aiConfig: {
        ...state.aiConfig,
        openRouterApiKey: apiKey,
        apiKeyValidated: validated,
      },
    }));
  },

  setSelectedModel: async (modelId: AIModelId) => {
    await storage.set(state => ({
      ...state,
      aiConfig: {
        ...state.aiConfig,
        selectedModel: modelId,
      },
    }));
  },

  setUserBio: async (bio: string) => {
    await storage.set(state => ({
      ...state,
      userBio: bio,
    }));
  },

  setLearningStyle: async (learningStyle: string) => {
    await storage.set(state => ({
      ...state,
      learningStyle,
    }));
  },
};
