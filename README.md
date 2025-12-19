# How Was This Built?

A Chrome extension that explains how any website is built using AI-powered analysis.

## Quick Start

### 1. Set up the API

```bash
cd api
cp .env.example .env
# Add your OpenRouter API key to .env
npm install
npm run dev
```

The API will run on http://localhost:3001

### 2. Build the Extension

```bash
cd extension
pnpm install
pnpm build
```

### 3. Load in Chrome

1. Open `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `extension/dist` folder

### 4. Use It

1. Navigate to any website
2. Click the extension icon to open the side panel
3. Complete the quick onboarding (pick your skill level)
4. Click "Analyze This Page"
5. Ask follow-up questions in the chat

## Project Structure

```
how-was-this-built/
├── api/                    # Backend API (Express + OpenRouter)
│   ├── server.ts          # Main server
│   ├── routes/
│   │   ├── analyze.ts     # POST /analyze
│   │   └── chat.ts        # POST /chat
│   └── lib/
│       ├── prompts.ts     # LLM prompts by user level
│       ├── openrouter.ts  # OpenRouter client
│       └── types.ts       # TypeScript types
│
└── extension/              # Chrome Extension (Manifest V3)
    ├── chrome-extension/
    │   └── src/background/ # Background service worker
    ├── pages/
    │   ├── content/        # Content script (page extraction)
    │   └── side-panel/     # React UI
    └── packages/
        └── storage/        # Chrome storage abstraction
```

## Tech Stack

- **Extension**: React 19, TypeScript, Vite, Tailwind CSS
- **Backend**: Express, TypeScript
- **LLM**: OpenRouter (Gemini 3 Flash Preview)

## Features

- **Adaptive Explanations**: Beginner, Learning, Designer, or Developer level
- **Four Analysis Categories**: Tech Stack, Architecture, Design System, UX Patterns
- **Follow-up Chat**: Ask questions about the analysis
- **Dark/Light Mode**: Toggle in the header
- **Analysis History**: Recent analyses saved locally

## Development

### Extension (hot reload)
```bash
cd extension
pnpm dev
```

### API
```bash
cd api
npm run dev
```

## Environment Variables

### API (.env)
```
OPENROUTER_API_KEY=your_key_here
PORT=3001
```
