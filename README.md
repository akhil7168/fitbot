# 🏋️ FitBot AI — Your Personal Fitness Coach

A purpose-built AI fitness chatbot powered by **Google Gemini 2.0 Flash**, designed to be your always-available personal trainer. Ask about workout plans, nutrition, recovery, fat loss, and more — FitBot gives specific, evidence-based fitness advice tailored to your questions.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Gemini](https://img.shields.io/badge/Gemini_2.0_Flash-AI-blue?logo=google)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Deployed on Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)

---

## 🎯 Why Fitness?

Fitness is one of those topics where everyone has questions but quality, personalized advice is expensive and hard to access. Most people can't afford a personal trainer, and generic internet advice is often contradictory. I wanted to build something that feels like having a knowledgeable workout buddy in your pocket — one that understands exercise science, nutrition, and can generate actual workout plans on the fly.

The chatbot isn't a generic wrapper around an LLM. It has a deep system prompt covering strength training, cardio programming, nutrition science, body composition, recovery, and more. It stays in its lane (fitness) and gives structured, actionable responses.

---

## ✨ Features

### 💬 AI Chat Coach
- Real-time **streaming responses** via Server-Sent Events
- Fitness-specialized system prompt (strength, cardio, nutrition, recovery, flexibility)
- Markdown-rendered responses with headers, lists, and bold formatting
- Suggested prompts to get started quickly
- Stop generation, clear chat, and error handling built in

### 📊 Dashboard
- At-a-glance stats: total workouts, duration, calories burned, day streak
- Quick action cards linking to each section
- Recent workout activity feed
- Weekly activity bar visualization

### 🏋️ Workout Logger
- Log workouts with type, exercises, sets/reps/weight, duration, and notes
- Exercise name autocomplete from a built-in database (40+ exercises)
- Auto-estimated calorie burn based on workout type and duration
- Full workout history with delete capability

### 📈 Progress Tracking
- Monthly workout frequency bar chart
- Monthly duration area chart with gradient fill
- Workout type distribution donut chart
- Weekly activity breakdown
- All data persisted in localStorage

### 🎨 Design & UX
- Dark glassmorphism UI with vibrant gradient accents
- Inter + Outfit typography from Google Fonts
- Smooth micro-animations (float, fade-in, hover effects)
- Fully responsive — works on desktop, tablet, and mobile
- Proper empty states, loading states, and error states on every page

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| AI Model | Google Gemini 2.0 Flash |
| Charts | Recharts |
| Icons | Lucide React |
| Animations | Framer Motion |
| Styling | Vanilla CSS (custom design system) |
| State | React Hooks + localStorage |
| IDs | UUID v4 |
| Dates | date-fns |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Google Gemini API key ([get one here](https://aistudio.google.com/))

### Setup

```bash
# Clone the repo
git clone https://github.com/akhil7168/fitbot.git
cd fitbot

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Then add your Gemini API key to .env.local

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start chatting with FitBot.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Your Google Gemini API key |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/chat/route.ts    # Gemini streaming API endpoint
│   ├── chat/page.tsx         # AI chat interface
│   ├── workouts/page.tsx     # Workout logger
│   ├── progress/page.tsx     # Progress charts
│   ├── page.tsx              # Dashboard
│   ├── layout.tsx            # Root layout with sidebar
│   └── globals.css           # Full design system
├── components/
│   └── Sidebar.tsx           # Responsive navigation sidebar
├── hooks/
│   ├── useChat.ts            # Chat state + streaming logic
│   ├── useWorkouts.ts        # Workout CRUD + localStorage
│   └── useProgress.ts        # Computed progress stats
└── lib/
    ├── constants.ts          # System prompt, suggested prompts, exercise DB
    ├── types.ts              # TypeScript interfaces
    └── utils.ts              # Helper functions + progress calculations
```

---

## 🌐 Deployment

Deployed on **Vercel**. The app uses a Next.js API route for the Gemini integration, so it works seamlessly with Vercel's serverless functions.

To deploy your own:
1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add `GEMINI_API_KEY` as an environment variable
4. Deploy

---

## 📝 License

MIT
