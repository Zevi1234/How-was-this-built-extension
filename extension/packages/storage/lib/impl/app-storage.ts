import { createStorage, StorageEnum, DEFAULT_AI_MODEL } from '../base/index.js';
import type { AppStateType, AppStorageType, UserLevel, LearningStyle, Analysis, ChatMessage, AIConfigType, AIModelId, SlashCommand } from '../base/index.js';

const MAX_RECENT_ANALYSES = 20;
const MAX_CUSTOM_COMMANDS = 50;

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
      chatResponseLength: 512,
    },
    customCommands: [],
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

  setChatResponseLength: async (length: number) => {
    await storage.set(state => ({
      ...state,
      aiConfig: {
        ...state.aiConfig,
        chatResponseLength: Math.min(2048, Math.max(256, length)),
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

  addCommand: async (commandData: Omit<SlashCommand, 'id' | 'createdAt' | 'updatedAt'>) => {
    const sanitizedName = commandData.name.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 20);

    // Validate name is not empty after sanitization
    if (!sanitizedName) {
      throw new Error('Command name must contain at least one letter or number');
    }

    // Check for duplicate names and max limit
    const currentState = await storage.get();
    const existingCommands = currentState.customCommands || [];

    if (existingCommands.some(cmd => cmd.name === sanitizedName)) {
      throw new Error(`A command named "/${sanitizedName}" already exists`);
    }

    if (existingCommands.length >= MAX_CUSTOM_COMMANDS) {
      throw new Error(`Maximum of ${MAX_CUSTOM_COMMANDS} commands reached`);
    }

    const now = Date.now();
    const newCommand: SlashCommand = {
      id: `cmd-${now}-${Math.random().toString(36).substring(2, 9)}`,
      name: sanitizedName,
      prompt: commandData.prompt,
      createdAt: now,
      updatedAt: now,
    };

    await storage.set(state => ({
      ...state,
      customCommands: [...(state.customCommands || []), newCommand],
    }));

    return newCommand;
  },

  updateCommand: async (id: string, updates: Partial<Pick<SlashCommand, 'name' | 'prompt'>>) => {
    const currentState = await storage.get();
    const existingCommands = currentState.customCommands || [];
    const commandToUpdate = existingCommands.find(cmd => cmd.id === id);

    if (!commandToUpdate) {
      throw new Error('Command not found');
    }

    // Validate and check for duplicate name if name is being updated
    if (updates.name) {
      const sanitizedName = updates.name.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 20);

      if (!sanitizedName) {
        throw new Error('Command name must contain at least one letter or number');
      }

      // Check if another command (not this one) has the same name
      if (existingCommands.some(cmd => cmd.id !== id && cmd.name === sanitizedName)) {
        throw new Error(`A command named "/${sanitizedName}" already exists`);
      }
    }

    await storage.set(state => ({
      ...state,
      customCommands: (state.customCommands || []).map(cmd =>
        cmd.id === id
          ? {
              ...cmd,
              ...(updates.name && { name: updates.name.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 20) }),
              ...(updates.prompt && { prompt: updates.prompt }),
              updatedAt: Date.now(),
            }
          : cmd
      ),
    }));
  },

  deleteCommand: async (id: string) => {
    await storage.set(state => ({
      ...state,
      customCommands: (state.customCommands || []).filter(cmd => cmd.id !== id),
    }));
  },
};
