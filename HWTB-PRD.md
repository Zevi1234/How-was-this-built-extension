# How Was This Built

## What Is This?

A Chrome extension that explains how any website is built. You click the extension, it analyzes the current page, and tells you about the tech stack, architecture, design system, and UX patterns—explained at your level, whether you're a curious beginner or a senior dev.

Then you can ask follow-up questions: "How did they make that animation?" or "Is this hard to build?"

## The Problem

You land on a beautifully designed website and think "how did they build this?" Your options today:

- **DevTools**: Powerful but intimidating. You need to already know what you're looking for.
- **View Source**: A wall of minified code. Good luck.
- **Ask ChatGPT**: Loses the context. You're copy-pasting and describing instead of just pointing.

There's no "explain this to me" button for the web.

## The Solution

One-click analysis that extracts what it can about the page and uses Claude to explain it in plain language. The explanation adapts to your skill level—a beginner gets analogies and simple terms, a developer gets the technical specifics.

## Who It's For

**Primary**: People learning web development who want to understand how real sites work.

**Secondary**: Developers who want to quickly reverse-engineer an implementation.

**Tertiary**: Designers and PMs who want to understand what they're looking at well enough to talk to engineers about it.

---

## MVP Scope

### The Core Flow

```
Click extension → Side panel opens → "Analyze This Page" → 
Breakdown appears (Tech, Architecture, Design, UX) → 
Ask follow-up questions in chat
```

### What's In

- **One-click page analysis**: Analyze the current URL
- **Four analysis categories**: Tech Stack, Architecture, Design System, UX Patterns
- **Adaptive explanations**: User picks their level once (Beginner / Learning / Designer / Developer), output adapts
- **Follow-up chat**: Ask questions about what you're seeing, dig deeper

### What's Out (for now)

- Screenshot/region selection
- Point-and-click element inspection  
- "Build it yourself" code generation
- Accounts or cross-device sync
- Any payment or premium features

---

## User Experience

### Onboarding (one time)

First time you open the extension:

```
What's your background?

[ ] 🌱 Beginner - Just curious, little/no coding experience
[ ] 📚 Learning - Currently learning web development  
[ ] 🎨 Designer - Design background, work with developers
[ ] 💻 Developer - Comfortable with code, want the details
```

This choice shapes all future explanations. Can be changed in settings.

### Main Screen

Shows current URL and a big "Analyze This Page" button. Below that, recent analyses for quick access.

### Analysis Results

Four collapsible cards:

- **🛠 Tech Stack**: Frameworks, libraries, hosting (Next.js, React, Tailwind, Vercel...)
- **🏗 Architecture**: How it renders, data fetching, structure (SSR, SPA, GraphQL...)
- **🎨 Design System**: Colors, typography, spacing, component patterns
- **✨ UX Patterns**: Loading states, navigation, interactions, animations

Each card has a summary written for the user's level. Tags/chips for quick scanning.

### Chat

Text input at the bottom. Ask anything about the page. Context-aware—knows what page and analysis you're discussing.

---

## Technical Architecture

### Extension Structure (Manifest V3)

```
┌─────────────────────────────────────────────────────────┐
│                    Chrome Extension                      │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │  Background │  │  Content    │  │   Side Panel    │ │
│  │  Worker     │  │  Script     │  │   (React UI)    │ │
│  │             │  │             │  │                 │ │
│  │  • API calls│  │  • Extract  │  │  • Analysis     │ │
│  │  • Storage  │  │    page     │  │  • Chat         │ │
│  │  • Messages │  │    data     │  │  • Settings     │ │
│  └─────────────┘  └─────────────┘  └─────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  Backend API    │
                  │  (Vercel Edge)  │
                  │                 │
                  │  POST /analyze  │
                  │  POST /chat     │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   Claude API    │
                  └─────────────────┘
```

### What Each Part Does

**Content Script**: Runs on every page. When asked, extracts:
- HTML (truncated to ~50KB)
- Script and stylesheet URLs
- Meta tags
- Tech signals (checks for `window.__NEXT_DATA__`, React devtools hook, Vue globals, etc.)

**Background Worker**: Orchestrates everything. Receives page data from content script, calls backend API, manages chrome.storage for preferences and history.

**Side Panel**: React app. The entire UI lives here. Communicates with background worker via chrome.runtime messages.

**Backend**: Two endpoints. `/analyze` takes page data + user level, returns structured analysis. `/chat` handles follow-up questions with conversation context.

### Tech Stack Detection

Two layers:

**Fast client-side detection** (before API call):
```javascript
// Examples of what we check
window.__NEXT_DATA__        → Next.js
window.__NUXT__             → Nuxt
window.__VUE__              → Vue
document.querySelector('[data-reactroot]') → React
class names with "svelte-" → Svelte
Tailwind utility patterns in classes → Tailwind
```

**Claude analysis** (deeper):
Send the extracted HTML, script URLs, and detected signals to Claude. It infers architecture, identifies libraries from script names, understands design patterns from the markup.

### Data We Store Locally

```typescript
{
  userLevel: 'beginner' | 'learning' | 'designer' | 'developer',
  onboardingComplete: boolean,
  recentAnalyses: Array<{
    url: string,
    timestamp: number,
    analysis: object
  }>,  // Keep last 20
  currentChat: Array<{ role: 'user' | 'assistant', content: string }>
}
```

No backend database. Everything lives in chrome.storage.local.

---

## Key Decisions Made

### Why a Side Panel (not popup)?

Popups close when you click outside them. Side panel stays open—you can scroll the page, interact with it, and keep the analysis visible. Essential for the chat flow.

### Why our own backend (not user's API key)?

Better UX. Users shouldn't need a Claude API key to try this. We eat the cost for now, can add bring-your-own-key later for power users.

### Why Vercel Edge Functions?

Fast cold starts, simple deployment, generous free tier. Could also be Cloudflare Workers—similar tradeoffs.

### Why Claude Sonnet (not Opus)?

Speed and cost. For explaining websites, Sonnet is plenty smart. Responses come back faster, costs ~10x less. Can upgrade specific flows to Opus later if needed.

### Why React for the Side Panel?

Pairs well with Claude Code for vibe coding. Large ecosystem, good Tailwind integration. Bundle size doesn't matter much for extension side panel.

### How do we handle huge pages?

Truncate HTML to first 50KB. Extract all script/style URLs regardless (they're small). Rely on Claude to work with partial information—it's usually enough to identify patterns.

### What about pages that block content scripts?

Some pages (chrome://, extension pages, certain bank sites) block content scripts. We detect this and show a friendly message: "Can't analyze this page—try a regular website."

---

## Project Structure

```
how-was-this-built/
├── extension/
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   ├── sidepanel.html
│   ├── src/                  # React app
│   │   ├── App.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   └── lib/
│   ├── icons/
│   └── package.json
│
├── api/                      # Vercel backend
│   ├── analyze.ts
│   ├── chat.ts
│   └── lib/
│       └── prompts.ts
│
└── README.md
```

---

## Example Output by User Level

### Beginner seeing linear.app

> **🛠 Tech Stack**
> 
> Linear is built using React, which is like a set of LEGO blocks for websites. Each piece of the interface—buttons, menus, that sidebar—is a separate block that can be updated without refreshing the whole page.
>
> They use Next.js on top of React, which helps the site load faster and show up better in Google searches. For styling, they use Tailwind CSS, which is a way of designing things using small, reusable style instructions.

### Developer seeing linear.app

> **🛠 Tech Stack**
>
> Next.js 14 (App Router) with React 18. TypeScript throughout. Tailwind for styling with custom design tokens. Framer Motion for animations.
>
> Detected: `__NEXT_DATA__` with `appGip: true`, React 18 concurrent features, Tailwind utility classes, Framer Motion in bundle.

Same page, completely different explanation.

---

## Future Ideas (Post-MVP)

Not building these now, but keeping them in mind:

- **Element inspector**: Click on a specific component to analyze just that
- **Screenshot mode**: Circle something, get it explained
- **"Build it yourself"**: Generate starter code, open in Cursor/Lovable
- **Learning progression**: Track what concepts you've seen, suggest next sites to explore