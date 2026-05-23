# CopyForge

AI-Powered Copywriting Tool — Forge words that convert.

## Features

- 🎯 **5 Copy Types**: Landing pages, ads, product descriptions, emails, social media
- 🤖 **MiMo AI**: Powered by MiMo v2.5 Pro via Gitlawb proxy
- 🎨 **Unique Theme**: Warm orange/amber gradient with glassmorphism
- 📋 **Copy to Clipboard**: One-click copy of generated content
- 📜 **Generation History**: Track your last 10 generations
- 🎭 **Tone Selection**: Professional, casual, bold, luxury, playful, urgent

## Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS with custom warm amber theme
- Lucide React icons
- MiMo AI API (no-auth via Gitlawb proxy)

## Getting Started

```bash
npm run dev
# Open http://localhost:3103
```

## API

POST `/api/generate`

```json
{
  "productName": "Product Name",
  "description": "Product description...",
  "audience": "Target audience",
  "tone": "Professional",
  "copyType": "landing"
}
```

Copy types: `landing`, `ads`, `product`, `email`, `social`
