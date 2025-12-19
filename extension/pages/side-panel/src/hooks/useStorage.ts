import { useStorage } from '@extension/shared';
import { appStorage, exampleThemeStorage } from '@extension/storage';
import type { AppStateType } from '@extension/storage';

export function useAppStorage() {
  const state = useStorage(appStorage);
  return {
    ...state,
    setUserLevel: appStorage.setUserLevel,
    setUserProfile: appStorage.setUserProfile,
    completeOnboarding: appStorage.completeOnboarding,
    addAnalysis: appStorage.addAnalysis,
    setCurrentAnalysis: appStorage.setCurrentAnalysis,
    addChatMessage: appStorage.addChatMessage,
    clearChat: appStorage.clearChat,
    setAnalyzing: appStorage.setAnalyzing,
    // AI Configuration methods
    setAIConfig: appStorage.setAIConfig,
    setOpenRouterApiKey: appStorage.setOpenRouterApiKey,
    setSelectedModel: appStorage.setSelectedModel,
    setChatResponseLength: appStorage.setChatResponseLength,
    // User profile methods
    setUserBio: appStorage.setUserBio,
    setLearningStyle: appStorage.setLearningStyle,
  };
}

export function useTheme() {
  const { isLight } = useStorage(exampleThemeStorage);
  return {
    isLight,
    isDark: !isLight,
    toggle: exampleThemeStorage.toggle,
  };
}

export type { AppStateType };
