# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Accomplice is a web-based parody tool that simulates an autonomous AI performing complex tasks. It's "theater code" - it doesn't perform real actions, just pretends to with style. Users input objectives and watch the AI "execute" absurdly detailed plans in real-time.

## Development Commands

```bash
npm run dev      # Start dev server at http://localhost:5173
npm run build    # Production build to /dist
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Architecture

### Core Components

- **App.jsx** - Main container with all state management (messages, currentPlan, settings, isProcessing, isFastForward). Settings persist to localStorage under `accomplice_settings`.

- **ChatInterface.jsx** - Input area with suggestion chips. Mixes regular and "evil" task suggestions based on current style. Handles fast-forward toggle.

- **AgentResponse.jsx** - Renders task execution with animations. State machine: thinking → executing → done. Items render sequentially with nested subtask support. Speed prop controls animation timing (3x when fast-forward enabled).

### Simulator (lib/simulator.js)

Generates fake execution plans:
1. Tries Gemini API first (model: gemini-2.0-flash) with style-specific prompts
2. Falls back to dummy generator if API unavailable
3. Returns array of plan items with structure:
   - `type`: 'thought' | 'planning' | 'task'
   - `id`, `text`, `duration`, `status`
   - Tasks can have nested `subtasks` array

### Style Personas

Five distinct styles affect both plan generation prompts and UI theming:
- **absurd** - High-tech hacker jargon, absurd references
- **grounded** - Professional corporate assistant
- **evil_genius** - Ruthless dangerous operative
- **monkeys_paw** - Supernatural wish-granter with dark twists (uses purple accent)
- **incompetent** - Confused agent that keeps messing up and eventually gives up (uses red accent)

## Tech Stack

- React 19 + Vite 7
- Tailwind CSS 4 (via PostCSS)
- Google Generative AI (Gemini 2.0 Flash)
- ESLint with flat config

## Environment Variables

Copy `.env.example` to `.env` and set:
```
VITE_GEMINI_API_KEY=your_key_here
```

API is optional - app falls back to dummy plan generation.

## Key CSS Variables

Dark theme with accent colors defined in `index.css`:
- `--accent-primary: #4dd4b5` (teal)
- `--accent-warm: #f59e0b` (orange, fast-forward)
- `--accent-mystic: #a855f7` (purple, Monkey's Paw)
- `--accent-incompetent: #ef4444` (red, Incompetent)

Fonts: DM Sans (UI), Space Grotesk (display), JetBrains Mono (code)
