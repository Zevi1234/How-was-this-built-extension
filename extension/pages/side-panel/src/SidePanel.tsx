import { useState } from 'react';
import '@src/SidePanel.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { ErrorDisplay, LoadingSpinner } from '@extension/ui';
import type { Analysis, UserLevel, ChatAttachment, AIModelId } from '@extension/storage';

import { useAppStorage, useTheme } from './hooks/useStorage';
import { Onboarding } from './components/Onboarding';
import { MainScreen } from './components/MainScreen';
import { AnalysisResults } from './components/AnalysisResults';
import { ChatView } from './components/ChatView';
import { Header } from './components/Header';
import { Settings } from './components/Settings';

type View = 'main' | 'results' | 'settings' | 'chat';

const SidePanel = () => {
  const appState = useAppStorage();
  const { isLight, toggle: toggleTheme } = useTheme();
  const isDark = !isLight;

  const [view, setView] = useState<View>('main');
  const [error, setError] = useState<string | null>(null);

  // Handle onboarding completion
  const handleOnboardingComplete = async (profile: {
    level: UserLevel;
    bio?: string;
    learningStyle?: string;
    aiConfig: { openRouterApiKey: string; selectedModel?: AIModelId };
  }) => {
    await appState.setUserProfile({ level: profile.level, bio: profile.bio, learningStyle: profile.learningStyle });
    await appState.setAIConfig({
      openRouterApiKey: profile.aiConfig.openRouterApiKey,
      selectedModel: profile.aiConfig.selectedModel,
      apiKeyValidated: true,
    });
    await appState.completeOnboarding();
  };

  // Handle analyze
  const handleAnalyze = async () => {
    setError(null);
    chrome.runtime.sendMessage({ type: 'ANALYZE_PAGE' }, (response) => {
      if (response?.success) {
        setView('results');
      } else {
        setError(response?.error || 'Analysis failed');
      }
    });
  };

  // Handle view analysis from history
  const handleViewAnalysis = (analysis: Analysis) => {
    appState.setCurrentAnalysis(analysis);
    setView('results');
  };

  // Handle chat
  const handleSendChat = async (message: string, attachments?: ChatAttachment[]): Promise<void> => {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: 'SEND_CHAT', message, attachments }, (response) => {
        if (response?.success) {
          resolve();
        } else {
          reject(new Error(response?.error || 'Chat failed'));
        }
      });
    });
  };

  // Handle level change
  const handleChangeLevel = async (level: UserLevel) => {
    await appState.setUserLevel(level);
  };

  // Handle AI config changes
  const handleSetApiKey = async (key: string, validated: boolean) => {
    await appState.setOpenRouterApiKey(key, validated);
  };

  const handleSetModel = async (modelId: AIModelId) => {
    await appState.setSelectedModel(modelId);
  };

  // Handle user profile changes
  const handleSetBio = async (bio: string) => {
    await appState.setUserBio(bio);
  };

  const handleSetLearningStyle = async (learningStyle: string) => {
    await appState.setLearningStyle(learningStyle);
  };

  const handleSetChatResponseLength = async (length: number) => {
    await appState.setChatResponseLength(length);
  };

  // Handle tag click - sends a question to AI about the tag and navigates to chat
  const handleTagClick = async (tag: string, category: string) => {
    const question = `Tell me more about "${tag}" in the context of ${category}. What is it and how is it used on this site?`;
    setView('chat');
    await handleSendChat(question);
  };

  // Show onboarding if not completed
  if (!appState.onboardingComplete) {
    return (
      <div className={`app ${isDark ? 'app--dark' : 'app--light'}`}>
        <Onboarding onComplete={handleOnboardingComplete} isDark={isDark} />
      </div>
    );
  }

  return (
    <div className={`app ${isDark ? 'app--dark' : 'app--light'} h-screen flex flex-col overflow-hidden`}>
      <Header
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenSettings={() => setView('settings')}
      />

      {/* Error display */}
      {error && (
        <div className={`mx-4 mt-4 p-3 rounded-lg text-sm font-mono ${isDark ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
          <div className="flex items-center justify-between">
            <span>// Error: {error}</span>
            <button onClick={() => setError(null)} className="hover:opacity-70">
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main content area - internal components handle scrolling */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        {view === 'settings' && (
          <Settings
            currentLevel={appState.userLevel}
            onChangeLevel={handleChangeLevel}
            onClose={() => setView('main')}
            isDark={isDark}
            aiConfig={appState.aiConfig}
            onSetApiKey={handleSetApiKey}
            onSetModel={handleSetModel}
            onSetChatResponseLength={handleSetChatResponseLength}
            userBio={appState.userBio}
            learningStyle={appState.learningStyle}
            onSetBio={handleSetBio}
            onSetLearningStyle={handleSetLearningStyle}
          />
        )}

        {view === 'main' && (
          <MainScreen
            onAnalyze={handleAnalyze}
            onViewAnalysis={handleViewAnalysis}
            recentAnalyses={appState.recentAnalyses}
            isAnalyzing={appState.isAnalyzing}
            isDark={isDark}
          />
        )}

        {view === 'chat' && (
          <ChatView
            messages={appState.currentChat}
            onSendMessage={handleSendChat}
            onBack={() => setView('results')}
            isDark={isDark}
            isLoading={appState.isAnalyzing}
            suggestedQuestions={appState.currentAnalysis?.suggestedQuestions}
            analysis={appState.currentAnalysis}
          />
        )}

        {view === 'results' && appState.currentAnalysis && (
          <AnalysisResults
            analysis={appState.currentAnalysis}
            onBack={() => setView('main')}
            isDark={isDark}
            onTagClick={handleTagClick}
            onOpenChat={() => setView('chat')}
          />
        )}
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(SidePanel, <LoadingSpinner />), ErrorDisplay);
