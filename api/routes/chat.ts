import { Router } from 'express';
import { callOpenRouter } from '../lib/openrouter.js';
import { getChatSystemPrompt } from '../lib/prompts.js';
import type { ChatRequest, ChatResponse, Analysis } from '../lib/types.js';

const router = Router();

function formatAnalysisContext(analysis: Analysis): string {
  return `
## Previous Website Analysis

**URL**: ${analysis.url}
**Analyzed**: ${new Date(analysis.timestamp).toLocaleString()}

### Tech Stack
${analysis.techStack.summary}
Tags: ${analysis.techStack.tags.join(', ')}

### Architecture
${analysis.architecture.summary}
Tags: ${analysis.architecture.tags.join(', ')}

### Design System
${analysis.designSystem.summary}
Tags: ${analysis.designSystem.tags.join(', ')}

### UX Patterns
${analysis.uxPatterns.summary}
Tags: ${analysis.uxPatterns.tags.join(', ')}
`;
}

router.post('/', async (req, res) => {
  try {
    const { message, analysis, history, userLevel, userBio, learningStyle, openRouterApiKey, selectedModel } = req.body as ChatRequest;

    if (!message || !analysis || !userLevel) {
      return res.status(400).json({ error: 'Missing message, analysis, or userLevel' });
    }

    console.log('[HWTB API] Chat request - Using custom API key:', !!openRouterApiKey, 'model:', selectedModel || 'default');

    // Create user context for personalized prompts
    const userContext = { level: userLevel, bio: userBio, learningStyle };
    const systemPrompt = getChatSystemPrompt(userContext);
    const analysisContext = formatAnalysisContext(analysis);

    // Build the message history
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: `${systemPrompt}\n\n${analysisContext}` },
    ];

    // Add conversation history
    if (history && history.length > 0) {
      // Limit history to last 10 messages to manage context size
      const recentHistory = history.slice(-10);
      for (const msg of recentHistory) {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      }
    }

    // Add the current message
    messages.push({ role: 'user', content: message });

    const response = await callOpenRouter(messages, {
      temperature: 0.7,
      maxTokens: 1024,
      apiKey: openRouterApiKey,
      model: selectedModel,
    });

    const chatResponse: ChatResponse = {
      reply: response.trim(),
    };

    return res.json(chatResponse);
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Chat failed',
    });
  }
});

export default router;
